# Requirements Document

## Introduction

Questa feature aggiunge il drag-and-drop alle card di opzioni nel configuratore 3D (componente `RoofOptions`). L'utente potrà riordinare le card trascinandole, e l'ordine risultante verrà persistito nello store Zustand. La feature utilizza una libreria DnD compatibile con React 19 (dnd-kit), integrata nel progetto Next.js 16 App Router con Tailwind CSS v4.

## Glossary

- **Card**: Un elemento UI cliccabile che rappresenta un'opzione di configurazione (es. "Liscio", "Crossbars", "Roof Rack Full") all'interno di `RoofOptions`.
- **DnD_Manager**: Il sistema di drag-and-drop responsabile di gestire gli eventi di trascinamento e il riordino delle card.
- **Options_List**: La lista ordinata di card visualizzata nel pannello `RoofOptions`.
- **Config_Store**: Lo store Zustand (`useConfigStore`) che mantiene lo stato della configurazione, incluso l'ordine delle opzioni.
- **Drag_Handle**: L'area visiva di una card che l'utente può afferrare per iniziare il trascinamento.
- **Drop_Target**: La posizione nella lista in cui una card può essere rilasciata.
- **Active_Card**: La card attualmente selezionata come opzione di configurazione attiva.

## Requirements

### Requirement 1: Riordino delle card tramite drag-and-drop

**User Story:** Come utente del configuratore 3D, voglio trascinare le card di opzioni per riordinarle, così posso organizzare le opzioni nell'ordine che preferisco.

#### Acceptance Criteria

1. WHEN l'utente inizia a trascinare una card tramite il Drag_Handle, THE DnD_Manager SHALL applicare alla card trascinata un'opacità ridotta (≤ 0.5) e un'ombra elevata (box-shadow con blur ≥ 8px) per distinguerla visivamente dalle altre card nella Options_List.
2. WHEN l'utente trascina una card sopra una posizione valida nella Options_List, THE DnD_Manager SHALL mostrare un indicatore visivo (linea orizzontale di almeno 2px o area evidenziata) nella posizione di rilascio prevista, aggiornato in tempo reale durante il movimento.
3. WHEN l'utente rilascia una card in una posizione diversa da quella originale, THE DnD_Manager SHALL aggiornare l'ordine della Options_List riposizionando la card nell'indice corrispondente alla posizione di rilascio, entro un singolo frame di rendering.
4. WHEN l'utente rilascia una card nella posizione originale (stesso indice di partenza), THE DnD_Manager SHALL mantenere l'ordine della Options_List invariato senza emettere aggiornamenti allo store.
5. WHEN l'utente preme il tasto Escape durante il trascinamento, THE DnD_Manager SHALL ripristinare la Options_List all'ordine precedente all'inizio del trascinamento corrente.
6. WHEN l'utente rilascia la card fuori dall'area della Options_List, THE DnD_Manager SHALL ripristinare la Options_List all'ordine precedente all'inizio del trascinamento corrente.

### Requirement 2: Persistenza dell'ordine nello store

**User Story:** Come utente del configuratore 3D, voglio che l'ordine delle card venga mantenuto durante la sessione, così non devo riordinare le opzioni ogni volta che cambio sezione.

#### Acceptance Criteria

1. THE Config_Store SHALL mantenere un array ordinato degli identificatori delle opzioni (`optionsOrder: RoofOption[]`) inizializzato con tutti gli ID delle opzioni disponibili nell'ordine di definizione originale (es. `["liscio", "crossbars", "roof_rack_full"]`), senza duplicati e senza ID mancanti.
2. WHEN l'utente completa un riordino tramite drag-and-drop (evento `onDragEnd` con destinazione diversa dall'origine), THE Config_Store SHALL aggiornare `optionsOrder` con il nuovo array risultante dall'operazione `arrayMove`, garantendo che l'array risultante contenga esattamente gli stessi ID dell'array precedente in ordine diverso.
3. WHILE l'utente naviga tra le sezioni del configuratore (cambiando `activeSection`), THE Config_Store SHALL preservare il valore di `optionsOrder` senza modificarlo.
4. WHEN il componente `RoofOptions` viene montato, THE Options_List SHALL renderizzare le card nell'ordine definito da `optionsOrder` nel Config_Store, mappando ogni ID al corrispondente oggetto opzione.

### Requirement 3: Accessibilità e interazione da tastiera

**User Story:** Come utente del configuratore 3D, voglio poter riordinare le card anche tramite tastiera, così la feature è accessibile anche senza mouse.

#### Acceptance Criteria

1. WHEN una card riceve il focus da tastiera e l'utente preme Spazio o Invio, THE DnD_Manager SHALL attivare la modalità keyboard-drag per quella card, applicando un indicatore visivo distinto dal focus ring (es. bordo tratteggiato o colore di sfondo differente) per segnalare lo stato attivo.
2. WHEN una card è in modalità keyboard-drag e l'utente preme il tasto freccia Giù, THE DnD_Manager SHALL spostare la card di una posizione verso il basso nella Options_List; WHEN l'utente preme il tasto freccia Su, THE DnD_Manager SHALL spostare la card di una posizione verso l'alto.
3. WHEN una card in modalità keyboard-drag si trova già in prima posizione e l'utente preme freccia Su, THE DnD_Manager SHALL mantenere la card in prima posizione senza modificare l'ordine; WHEN la card è in ultima posizione e l'utente preme freccia Giù, THE DnD_Manager SHALL mantenere la card in ultima posizione.
4. WHEN l'utente preme Spazio o Invio durante la modalità keyboard-drag, THE DnD_Manager SHALL confermare il rilascio nella posizione corrente, aggiornare `optionsOrder` nello store e disattivare la modalità keyboard-drag.
5. WHEN l'utente preme Escape durante la modalità keyboard-drag, THE DnD_Manager SHALL annullare il trascinamento, ripristinare la posizione originale della card e disattivare la modalità keyboard-drag senza aggiornare lo store.
6. THE DnD_Manager SHALL esporre su ogni card draggable gli attributi `aria-pressed` (true quando in modalità keyboard-drag, false altrimenti), `aria-roledescription="sortable item"`, e un elemento `aria-live="assertive"` che annunci la posizione corrente della card (es. "Liscio, posizione 1 di 2") ad ogni spostamento da tastiera.

### Requirement 4: Feedback visivo durante il trascinamento

**User Story:** Come utente del configuratore 3D, voglio ricevere un feedback visivo chiaro durante il trascinamento, così capisco cosa sta succedendo nell'interfaccia.

#### Acceptance Criteria

1. WHEN l'utente inizia a trascinare una card tramite il Drag_Handle, THE DnD_Manager SHALL impostare il cursore del puntatore a `grabbing` per tutta la durata del trascinamento, ripristinando il cursore al valore precedente al rilascio.
2. WHILE una card è in stato di trascinamento, THE Options_List SHALL mostrare un segnaposto (placeholder) nella posizione originale della card con altezza e larghezza equivalenti alla card stessa, bordo tratteggiato e sfondo trasparente o leggermente colorato.
3. WHEN l'utente trascina una card oltre la metà di una card adiacente, THE DnD_Manager SHALL applicare una transizione CSS (`transition: transform 200ms ease`) alle card che si spostano per fare spazio alla card trascinata.
4. WHEN l'utente rilascia una card in una nuova posizione, THE DnD_Manager SHALL applicare una transizione CSS (`transition: transform 150ms ease-out`) alla card per portarla nella posizione finale.
5. THE Drag_Handle SHALL essere sempre visibile all'interno di ogni card come icona grip (es. `GripVertical` da lucide-react), posizionata sul lato sinistro della card, con cursore `grab` al hover.
6. WHEN l'utente annulla il trascinamento (Escape o rilascio fuori area), THE DnD_Manager SHALL applicare una transizione CSS (`transition: transform 200ms ease-in`) alla card per riportarla alla posizione originale.

### Requirement 5: Compatibilità con la selezione attiva

**User Story:** Come utente del configuratore 3D, voglio che il riordino delle card non interferisca con la selezione dell'opzione attiva, così posso riordinare e selezionare in modo indipendente.

#### Acceptance Criteria

1. WHEN l'utente completa un riordino tramite drag-and-drop, THE Config_Store SHALL preservare il valore di `roofOption` (opzione attiva) invariato, indipendentemente dalla nuova posizione della card corrispondente nell'Options_List.
2. WHEN l'utente clicca su una card senza trascinarla (spostamento del puntatore < 5px tra mousedown e mouseup), THE Config_Store SHALL aggiornare `roofOption` con il valore `"liscio"`, `"crossbars"` o `"roof_rack_full"` corrispondente alla card cliccata.
3. WHEN l'utente inizia a trascinare una card (spostamento del puntatore ≥ 5px dopo mousedown), THE DnD_Manager SHALL sopprimere l'evento di click sulla card, impedendo l'aggiornamento di `roofOption`.
4. WHILE una card è in stato di trascinamento, THE Config_Store SHALL mantenere il valore corrente di `roofOption` senza modificarlo.
5. THE Options_List SHALL applicare il cursore `grab` al Drag_Handle e il cursore `pointer` al resto della card, rendendo visivamente distinguibili le aree di drag da quelle di click.
