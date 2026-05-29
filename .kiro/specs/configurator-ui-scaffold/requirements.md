# Requirements Document

## Introduction

This feature provides the UI scaffolding for a 3D caravan configurator. It introduces a floating toolbar with tabbed navigation (pill style), reusable card containers, selection components (checkbox multi-select and radio single-select), a bottom summary bar with colorway selector and call-to-action, and a Zustand state store to manage active tab and user selections. The UI layer overlays the existing 3D viewport and integrates with the project's module-based architecture.

## Glossary

- **Configurator_UI**: The overlay UI layer rendered on top of the 3D viewport, containing all configuration controls
- **Toolbar**: A floating horizontal navigation bar with pill-shaped tab buttons for switching between configuration categories
- **Tab**: A selectable navigation item within the Toolbar representing a configuration category (e.g., Layout, Exterior, Interior, Accessories)
- **FloatCard**: A reusable floating card container component used to display configuration options for the active tab
- **OptionItem**: A checkbox-based selection component for multi-select configuration choices
- **RadioItem**: A radio-button-based selection component for single-select configuration choices
- **BottomBar**: A fixed bottom bar displaying a configuration summary, colorway selector, and a call-to-action button
- **Colorway_Selector**: A UI element within the BottomBar that allows the user to pick a color scheme for the caravan
- **Config_Store**: A Zustand store managing the active tab, selected options, and colorway state
- **ShellPanel**: A 3D panel component within the R3F scene that animates the caravan exterior shell using spring-based animation (@react-spring/three)
- **Caravan_Model**: A GLTF model loader component that loads the caravan model and manages individual mesh visibility based on configuration selections

## Requirements

### Requirement 1: Toolbar Navigation

**User Story:** As a user, I want a floating tabbed toolbar so that I can switch between configuration categories while viewing the 3D caravan.

#### Acceptance Criteria

1. THE Configurator_UI SHALL render a Toolbar component with exactly four Tab items labeled "Layout", "Modules", "Materials", and "Accessories", positioned as a floating element horizontally centered at the bottom of the viewport
2. WHEN a user selects a Tab, THE Config_Store SHALL update the active tab state to the selected category
3. WHEN the Configurator_UI first loads, THE Config_Store SHALL set the active tab state to the first tab ("Layout") by default
4. THE Toolbar SHALL visually distinguish the active Tab from inactive Tabs by applying a pill-shaped highlight background to the active Tab
5. THE Toolbar SHALL render Tab labels using translated strings from the next-intl localization system for all supported locales (en, it)

### Requirement 2: FloatCard Container

**User Story:** As a user, I want configuration options displayed in a clean floating card so that I can browse choices without obstructing the 3D view.

#### Acceptance Criteria

1. THE FloatCard SHALL render as a reusable container component that accepts children and an optional title prop, where the title is rendered as a heading element when provided and omitted from the DOM when not provided
2. WHEN the active tab changes, THE Configurator_UI SHALL display a FloatCard with the options corresponding to the selected tab
3. THE FloatCard SHALL apply a backdrop with opacity between 0.7 and 0.95, border-radius of at least 8px, and a box shadow, styled with Tailwind CSS utility classes
4. THE FloatCard SHALL be positioned as a floating overlay using pointer-events none on its positioning container and pointer-events auto on the card element itself, so that pointer events pass through to the viewport outside the card bounds
5. IF the FloatCard content exceeds the card's maximum height, THEN THE FloatCard SHALL display a vertical scrollbar allowing the user to scroll through all options
6. THE FloatCard SHALL not exceed 50% of the viewport width and 70% of the viewport height

### Requirement 3: OptionItem (Multi-Select)

**User Story:** As a user, I want to select multiple accessories or features using checkboxes so that I can customize my caravan with several add-ons simultaneously.

#### Acceptance Criteria

1. THE OptionItem SHALL render a native checkbox input with a visible label and an optional description text, where the label is clickable and toggles the checkbox state
2. WHEN a user toggles an unchecked OptionItem, THE Config_Store SHALL add the corresponding option ID to the selected options set for the active category; WHEN a user toggles a checked OptionItem, THE Config_Store SHALL remove the corresponding option ID from the selected options set for the active category
3. THE OptionItem SHALL reflect its checked state by reading the selected options set for the active category from the Config_Store and rendering the checkbox as checked if the option ID is present
4. WHEN an OptionItem receives a disabled prop set to true, THE OptionItem SHALL prevent user interaction (click and keyboard input produce no state change), render the checkbox and label with reduced opacity (Tailwind opacity utility), and set the aria-disabled attribute to "true"
5. IF a user attempts to toggle an OptionItem that is in the disabled state, THEN THE Config_Store SHALL NOT modify the selected options set

### Requirement 4: RadioItem (Single-Select)

**User Story:** As a user, I want to choose one option from a group of mutually exclusive choices so that I can select a single layout or material variant.

#### Acceptance Criteria

1. THE RadioItem SHALL render a native radio input with a visible label and optional description text, where the radio input is associated with a group name prop that identifies the mutually exclusive set it belongs to
2. WHEN a user selects a RadioItem, THE Config_Store SHALL set the selected value for the group identified by the RadioItem's group name prop, replacing any previous selection so that at most one value is stored per group
3. WHEN a user selects the RadioItem that is already selected, THE Config_Store SHALL retain the current selection without change
4. THE RadioItem SHALL indicate its selected state by rendering the radio input with the checked attribute set to true when its value matches the Config_Store's stored value for its group, and checked set to false otherwise
5. WHILE the RadioItem is in a disabled state, THE RadioItem SHALL prevent user interaction (click and keyboard input ignored) and render with a reduced opacity of 0.5 or lower to visually distinguish it from enabled items

### Requirement 5: BottomBar Summary

**User Story:** As a user, I want a persistent bottom bar showing my configuration summary and a way to finalize so that I always see the current state of my choices.

#### Acceptance Criteria

1. THE BottomBar SHALL render as a fixed-position bar at the bottom of the viewport
2. THE BottomBar SHALL display a summary section showing the total count of selected options aggregated across all categories, updating reactively when the Config_Store selections change
3. THE BottomBar SHALL include a Colorway_Selector element that displays the color swatches defined in the configuration data
4. WHEN a user selects a color swatch, THE Config_Store SHALL update the active colorway state
5. THE Colorway_Selector SHALL visually distinguish the currently active color swatch from inactive swatches
6. THE BottomBar SHALL include a call-to-action button with a localized label
7. THE BottomBar SHALL render all user-facing text using translated strings from the next-intl localization system

### Requirement 6: Config Store (Zustand)

**User Story:** As a developer, I want a centralized state store so that all UI components and the 3D scene can reactively share configuration state.

#### Acceptance Criteria

1. THE Config_Store SHALL expose the active tab identifier as a readable and writable string state property, initialized to the first tab in the configuration
2. THE Config_Store SHALL expose a selections map keyed by category string, where each category holds either a set of selected option IDs (multi-select) or a single selected option ID (single-select), initialized to an empty map
3. THE Config_Store SHALL expose the active colorway identifier as a readable and writable string state property, initialized to the first available colorway
4. WHEN a toggle action is invoked for a multi-select category, THE Config_Store SHALL add the option ID if it is not present in the category set, or remove it if it is already present
5. WHEN a radio selection action is invoked for a single-select category, THE Config_Store SHALL replace the currently selected option ID with the new option ID for that category
6. WHEN a change active tab action is invoked, THE Config_Store SHALL update the active tab identifier to the provided value
7. WHEN a change colorway action is invoked, THE Config_Store SHALL update the active colorway identifier to the provided value
8. THE Config_Store SHALL be implemented using Zustand and follow the project convention of a single store file within a dedicated module store directory

### Requirement 7: Caravan Model Loader

**User Story:** As a user, I want the 3D caravan model to load and display individual meshes so that configuration changes can show or hide parts of the model.

#### Acceptance Criteria

1. THE Caravan_Model SHALL load the GLTF/GLB file at the configured model path using the useGLTF hook from @react-three/drei with Draco decoding enabled
2. THE Caravan_Model SHALL traverse the loaded scene graph and expose each mesh whose name matches a key in the Config_Store as an independently visibility-controllable element
3. WHEN the Caravan_Model finishes loading, THE Caravan_Model SHALL set all configuration-mapped meshes to visible by default
4. WHEN the Config_Store selections change, THE Caravan_Model SHALL show meshes whose corresponding Config_Store key is selected and hide meshes whose corresponding Config_Store key is deselected within the same render cycle
5. IF the GLTF file fails to load or the file is unreachable, THEN THE Caravan_Model SHALL render a fallback placeholder geometry in place of the model and not throw an unhandled error
6. IF the loaded scene graph contains no meshes matching any Config_Store key, THEN THE Caravan_Model SHALL render the full scene graph with all meshes visible

### Requirement 8: ShellPanel Animation

**User Story:** As a user, I want the caravan exterior shell to animate open or closed so that I can see the interior when browsing interior options.

#### Acceptance Criteria

1. THE ShellPanel SHALL obtain the exterior shell mesh by name from the Caravan_Model loaded scene graph
2. WHEN the active tab in Config_Store changes to the "Interior" category, THE ShellPanel SHALL animate the shell mesh rotation to the open position using a spring animation from @react-spring/three, where the open position is a rotation offset that exposes the interior (e.g., rotation around the hinge axis)
3. WHEN the active tab in Config_Store changes to any category other than "Interior", THE ShellPanel SHALL animate the shell mesh rotation back to its original closed position (0 offset) using a spring animation from @react-spring/three
4. THE ShellPanel SHALL configure the spring animation with explicit mass, tension, and friction values so that the animation settles within 1500 milliseconds without visible oscillation beyond one overshoot
5. IF the exterior shell mesh is not found in the loaded model scene graph, THEN THE ShellPanel SHALL render nothing and not throw an error

### Requirement 9: Module Integration

**User Story:** As a developer, I want the configurator UI to follow the existing module-based architecture so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE Configurator_UI SHALL be organized as a new module under the modules/ directory containing a dedicated modules/configurator/ folder with a main Configurator.tsx component, an index.ts barrel file that re-exports the main component as a named export, and a components/ subdirectory for internal sub-components
2. THE Configurator_UI SHALL use TypeScript (.tsx) files for all components
3. THE Configurator_UI SHALL use Tailwind CSS utility classes for all styling without introducing additional CSS frameworks or module-scoped CSS files
4. THE Configurator_UI SHALL provide translation files at locales/configurator/en.ts and locales/configurator/it.ts, each using `export default {...} as const` format, and integrate them into messages/en.ts and messages/it.ts under the namespace key "Configurator"

### Requirement 10: Accessibility

**User Story:** As a user with assistive technology, I want the configurator controls to be keyboard-navigable and screen-reader accessible so that I can configure the caravan without relying solely on pointer input.

#### Acceptance Criteria

1. THE Toolbar SHALL implement the WAI-ARIA tablist pattern with role="tablist" on the container and role="tab" on each Tab, supporting Left and Right arrow key navigation between Tabs with focus wrapping from last to first and first to last, and activation of the focused Tab using Enter or Space
2. THE OptionItem SHALL use a native checkbox input or an element with role="checkbox" whose aria-checked attribute is set to "true" when selected and "false" when not selected, and whose accessible name is provided by its associated label text
3. THE RadioItem SHALL use native radio inputs grouped within a fieldset with a descriptive legend, or elements with role="radio" within a container with role="radiogroup" and an accessible group name via aria-labelledby or aria-label, where each radio element has aria-checked set to "true" when selected and "false" otherwise
4. THE BottomBar call-to-action button SHALL have an accessible name provided via its visible text content or aria-label attribute
5. WHEN any interactive element within the Configurator_UI receives keyboard focus, THE element SHALL display a visible focus indicator with a minimum contrast ratio of 3:1 against adjacent colors
6. THE Colorway_Selector SHALL provide keyboard navigation between color swatches using arrow keys, and each swatch SHALL have an accessible name describing its color and an aria-selected attribute set to "true" for the active colorway and "false" for inactive swatches
