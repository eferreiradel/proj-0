# Design Document — card-dnd-reorder

## Overview

This feature adds drag-and-drop reordering to the option cards in the `RoofOptions` component of the 3D configurator. Users can grab a card by its drag handle and reorder the list; the resulting order is persisted in the Zustand store for the duration of the session.

**Key design decisions:**

- Use the new `@dnd-kit/react` package (not the legacy `@dnd-kit/core` + `@dnd-kit/sortable`), which is the React 19–compatible API and the current recommended path per the dnd-kit migration guide.
- Manage order state in Zustand (`optionsOrder: RoofOption[]`) so it survives section navigation.
- Keep the active selection (`roofOption`) completely independent of the order array — reordering never changes which option is selected.
- Use dnd-kit's built-in `OptimisticSortingPlugin` (enabled by default) for smooth visual feedback without React re-renders on every `dragover`.
- Keyboard accessibility is provided by dnd-kit's keyboard sensor plus explicit `aria-live` announcements.

---

## Architecture

The feature touches three layers:

```
┌─────────────────────────────────────────────────────┐
│  RoofOptions.tsx  (UI layer)                        │
│  ┌─────────────────────────────────────────────┐    │
│  │  DragDropProvider  (dnd-kit context)        │    │
│  │  ┌───────────────────────────────────────┐  │    │
│  │  │  SortableCard  ×N  (per-card hook)    │  │    │
│  │  │  • useSortable(id, index)             │  │    │
│  │  │  • handleRef → GripVertical icon      │  │    │
│  │  │  • isDragging / isDropTarget styles   │  │    │
│  │  └───────────────────────────────────────┘  │    │
│  │  AriaLiveRegion  (screen-reader announce)   │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
          │ onDragEnd → setOptionsOrder
          ▼
┌─────────────────────────────────────────────────────┐
│  useConfigStore  (Zustand)                          │
│  • optionsOrder: RoofOption[]                       │
│  • setOptionsOrder(order: RoofOption[]) => void     │
│  • roofOption / setRoofOption  (unchanged)          │
└─────────────────────────────────────────────────────┘
```

The `RoofOptions` component owns the `DragDropProvider` context. Each card is rendered as a `SortableCard` sub-component that calls `useSortable`. The `onDragEnd` callback on the provider reads `source.initialIndex` and `source.index` (via the `isSortable` type guard), performs the splice, and calls `setOptionsOrder` only when the position actually changed.

---

## Components and Interfaces

### 1. `useConfigStore` — store additions

```typescript
// New state slice added to ConfigState
optionsOrder: RoofOption[];
setOptionsOrder: (order: RoofOption[]) => void;

// Initial value
optionsOrder: ["liscio", "crossbars", "roof_rack_full"],
setOptionsOrder: (order) => set({ optionsOrder: order }),
```

The existing `roofOption` and `setRoofOption` are untouched.

### 2. `SortableCard` (internal sub-component of `RoofOptions`)

```typescript
interface SortableCardProps {
  option: { id: RoofOption; label: string; description: string };
  index: number;
  isActive: boolean;           // roofOption === option.id
  onSelect: (id: RoofOption) => void;
  announcePosition: (label: string, pos: number, total: number) => void;
}
```

Internally calls:

```typescript
const { ref, handleRef, isDragging, isDropTarget } = useSortable({
  id: option.id,
  index,
  transition: { duration: 200, easing: "ease" },
});
```

- `ref` is attached to the outer card `<div>`.
- `handleRef` is attached to the `<GripVertical>` icon wrapper.
- `isDragging` drives: `opacity-50 shadow-xl` on the card, `cursor-grabbing` on the body.
- `isDropTarget` drives: a 2px blue top-border indicator on the card.

### 3. `RoofOptions` (updated)

Reads `optionsOrder` from the store and maps it to the static `OPTIONS_MAP` to get the full option objects in the correct order. Wraps the list in `DragDropProvider` and handles `onDragEnd`.

```typescript
const OPTIONS_MAP: Record<RoofOption, { label: string; description: string }> = {
  liscio:         { label: "Liscio",          description: "Profilo aerodinamico stan..." },
  crossbars:      { label: "Crossbars",       description: "Barre trasversali in allu..." },
  roof_rack_full: { label: "Roof Rack Full",  description: "Portapacchi completo per il tetto..." },
};
```

### 4. `AriaLiveRegion` (internal)

A visually-hidden `<div aria-live="assertive" aria-atomic="true">` that receives position announcements during keyboard drag. Managed via a local `useState<string>` in `RoofOptions`.

---

## Data Models

### Store state (updated `ConfigState`)

```typescript
interface ConfigState {
  // existing
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  roofOption: RoofOption;  // "liscio" | "crossbars" | "roof_rack_full"
  setRoofOption: (option: RoofOption) => void;

  // new
  optionsOrder: RoofOption[];
  setOptionsOrder: (order: RoofOption[]) => void;
}
```

`optionsOrder` is always a permutation of all `RoofOption` values — same length, no duplicates, no missing IDs.

### Drag event data flow

```
onDragEnd(event):
  if event.canceled → no-op (OptimisticSortingPlugin reverts DOM automatically)
  source = event.operation.source
  if isSortable(source):
    { initialIndex, index } = source
    if initialIndex !== index:
      newOrder = [...optionsOrder]
      [removed] = newOrder.splice(initialIndex, 1)
      newOrder.splice(index, 0, removed)
      setOptionsOrder(newOrder)
```

No snapshot ref is needed for single-list optimistic sorting — dnd-kit reverts the DOM automatically when `event.canceled` is true.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Reorder produces a valid permutation

*For any* `optionsOrder` array and any valid source index `i` and target index `j` (where `i ≠ j`), applying the reorder operation shall produce an array that contains exactly the same set of IDs as the original, with the item originally at `i` now at position `j`.

**Validates: Requirements 1.3, 2.2**

### Property 2: No-op reorder leaves order unchanged

*For any* `optionsOrder` array and any index `k`, if the drag source and target are both at index `k` (i.e. `initialIndex === index`), the resulting order shall be identical to the original and `setOptionsOrder` shall not be called.

**Validates: Requirements 1.4**

### Property 3: Section navigation preserves optionsOrder

*For any* `optionsOrder` value and any `Section` value, calling `setActiveSection` shall leave `optionsOrder` unchanged.

**Validates: Requirements 2.3**

### Property 4: Rendered card order matches optionsOrder

*For any* permutation of option IDs stored in `optionsOrder`, the `RoofOptions` component shall render the cards in exactly that order (first card in DOM corresponds to `optionsOrder[0]`, etc.).

**Validates: Requirements 2.4**

### Property 5: Reorder does not affect active selection

*For any* current `roofOption` value and any valid reorder operation, after `setOptionsOrder` is called, `roofOption` shall remain equal to its value before the reorder.

**Validates: Requirements 5.1, 5.4**

### Property 6: Aria-live announces correct position

*For any* card with label `L` at 1-based position `p` in a list of `n` cards, the aria-live region shall contain a string that includes `L`, `p`, and `n` after a keyboard-drag move event.

**Validates: Requirements 3.6**

### Property 7: Every rendered card has a drag handle

*For any* non-empty `optionsOrder` array, every card rendered by `RoofOptions` shall contain exactly one element with the `handleRef` attached (the `GripVertical` icon wrapper).

**Validates: Requirements 4.5**

---

## Error Handling

| Scenario | Handling |
|---|---|
| `optionsOrder` contains unknown ID | Silently filtered out during `OPTIONS_MAP` lookup; card is not rendered |
| `optionsOrder` is missing an ID | The missing option simply does not appear; no crash |
| `setOptionsOrder` called with wrong length | Store accepts it; UI renders whatever is in the array |
| Drag canceled (Escape / drop outside) | `event.canceled === true` → no store update; dnd-kit reverts DOM |
| Drop at same position | `initialIndex === index` guard → no store update |

The store does not validate the `optionsOrder` array on write. Validation is the responsibility of the caller (the `onDragEnd` handler), which only calls `setOptionsOrder` with a correctly spliced array derived from the existing `optionsOrder`.

---

## Testing Strategy

### Unit tests (example-based)

Focus on specific behaviors and edge cases:

- Store initial state: `optionsOrder` equals `["liscio", "crossbars"]`, no duplicates.
- `SortableCard` renders `GripVertical` icon with `handleRef`.
- `SortableCard` with `isDragging=true` has `opacity-50` and elevated shadow classes.
- `SortableCard` with `isDropTarget=true` shows the drop indicator border.
- `onDragEnd` with `event.canceled=true` does not call `setOptionsOrder`.
- `onDragEnd` with `initialIndex === index` does not call `setOptionsOrder`.
- Click on card (no drag) calls `setRoofOption` with the correct ID.
- `setActiveSection` does not mutate `optionsOrder`.
- `useSortable` is called with `transition: { duration: 200, easing: "ease" }`.

### Property-based tests

Use **fast-check** (compatible with Vitest/Jest, works in Node without a browser). Each test runs a minimum of **100 iterations**.

**Tag format:** `Feature: card-dnd-reorder, Property {N}: {property_text}`

#### Property 1 — Reorder produces a valid permutation
```
// Feature: card-dnd-reorder, Property 1: Reorder produces a valid permutation
fc.property(
  fc.shuffledSubarray(["liscio", "crossbars", "roof_rack_full"], { minLength: 2 }),
  fc.integer({ min: 0, max: 2 }),
  fc.integer({ min: 0, max: 2 }).filter((j, ctx) => j !== ctx.values[1]),
  (order, i, j) => {
    const result = applyReorder(order, i, j);
    expect(result).toHaveLength(order.length);
    expect(new Set(result)).toEqual(new Set(order));
    expect(result[j]).toBe(order[i]);
  }
)
```

#### Property 2 — No-op reorder
```
// Feature: card-dnd-reorder, Property 2: No-op reorder leaves order unchanged
fc.property(
  fc.shuffledSubarray(["liscio", "crossbars", "roof_rack_full"], { minLength: 2 }),
  fc.integer({ min: 0, max: 2 }),
  (order, k) => {
    const setOptionsOrder = vi.fn();
    handleDragEnd(mockCanceledFalseEvent(k, k), order, setOptionsOrder);
    expect(setOptionsOrder).not.toHaveBeenCalled();
  }
)
```

#### Property 3 — Section navigation preserves optionsOrder
```
// Feature: card-dnd-reorder, Property 3: Section navigation preserves optionsOrder
fc.property(
  fc.constantFrom("esterni", "tetto", "interni", "galley", "freeview"),
  (section) => {
    const store = createTestStore();
    const before = store.getState().optionsOrder;
    store.getState().setActiveSection(section);
    expect(store.getState().optionsOrder).toEqual(before);
  }
)
```

#### Property 4 — Rendered card order matches optionsOrder
```
// Feature: card-dnd-reorder, Property 4: Rendered card order matches optionsOrder
fc.property(
  fc.shuffledSubarray(["liscio", "crossbars", "roof_rack_full"], { minLength: 2 }),
  (order) => {
    // Set store optionsOrder to `order`, render RoofOptions (activeSection="tetto")
    // Query all rendered card labels in DOM order
    // Assert labels match order.map(id => OPTIONS_MAP[id].label)
  }
)
```

#### Property 5 — Reorder does not affect active selection
```
// Feature: card-dnd-reorder, Property 5: Reorder does not affect active selection
fc.property(
  fc.constantFrom("liscio", "crossbars", "roof_rack_full"),
  fc.shuffledSubarray(["liscio", "crossbars", "roof_rack_full"], { minLength: 2 }),
  (activeOption, newOrder) => {
    const store = createTestStore({ roofOption: activeOption });
    store.getState().setOptionsOrder(newOrder);
    expect(store.getState().roofOption).toBe(activeOption);
  }
)
```

#### Property 6 — Aria-live announces correct position
```
// Feature: card-dnd-reorder, Property 6: Aria-live announces correct position
fc.property(
  fc.shuffledSubarray(["liscio", "crossbars", "roof_rack_full"], { minLength: 2 }),
  fc.integer({ min: 0, max: 2 }),
  (order, movedIndex) => {
    fc.pre(movedIndex < order.length);
    const label = OPTIONS_MAP[order[movedIndex]].label;
    const announcement = buildAnnouncement(label, movedIndex + 1, order.length);
    expect(announcement).toContain(label);
    expect(announcement).toContain(String(movedIndex + 1));
    expect(announcement).toContain(String(order.length));
  }
)
```

#### Property 7 — Every rendered card has a drag handle
```
// Feature: card-dnd-reorder, Property 7: Every rendered card has a drag handle
fc.property(
  fc.shuffledSubarray(["liscio", "crossbars", "roof_rack_full"], { minLength: 1 }),
  (order) => {
    // Render RoofOptions with optionsOrder=order, activeSection="tetto"
    // Query all drag handle elements (data-testid="drag-handle")
    // Assert count equals order.length
  }
)
```

### Integration tests

- Render `RoofOptions` inside a real `DragDropProvider` with a mocked store; simulate a pointer drag sequence and verify the store's `optionsOrder` is updated correctly.
- Verify keyboard drag: focus a card, press Space, press ArrowDown, press Space — verify store update and aria-live announcement.

### Test library

- **fast-check** for property-based tests
- **Vitest** + **@testing-library/react** for unit and integration tests
- Minimum **100 iterations** per property test (`fc.property` default is 100)
