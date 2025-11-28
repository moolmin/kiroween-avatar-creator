# Design Document

## Overview

The Halloween Ghost Avatar Maker is a Next.js 14 application using the App Router architecture, TypeScript for type safety, and Tailwind CSS for styling. The application follows a component-based architecture where SVG assets are organized as React components, enabling easy extensibility without modifying core logic.

The system uses a registry pattern to map customization options to their corresponding SVG components. This allows developers to add new assets by simply creating SVG component files and registering them in category-specific index files. The application renders avatars in real-time using SVG composition, then converts to PNG format for export using html2canvas.

Key architectural principles:
- **Separation of concerns**: UI logic, asset management, and rendering are decoupled
- **Extensibility**: New assets can be added without touching core code
- **Type safety**: TypeScript ensures compile-time validation of all customization options
- **Performance**: Dynamic imports and efficient re-rendering strategies

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
│                    (app/page.tsx - Main)                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐            ┌────────▼─────────┐
│ Customization  │            │  Avatar Preview  │
│     Panel      │            │     Canvas       │
│  (UI Controls) │            │  (SVG Renderer)  │
└───────┬────────┘            └────────┬─────────┘
        │                               │
        │         ┌─────────────────────┘
        │         │
┌───────▼─────────▼──────┐
│   Avatar State Store   │
│  (Zustand/Context)     │
└───────┬────────────────┘
        │
┌───────▼────────────────┐
│  Component Registry    │
│  (Asset Mappings)      │
└───────┬────────────────┘
        │
┌───────▼────────────────┐
│   SVG Components       │
│  (GhostParts/*)        │
└────────────────────────┘
```

### Component Structure

```
app/
├── page.tsx                    # Main application page
├── layout.tsx                  # Root layout
└── globals.css                 # Global styles with Tailwind

components/
├── AvatarCanvas.tsx            # SVG composition and rendering
├── CustomizationPanel.tsx      # Main control panel
├── controls/
│   ├── SelectControl.tsx       # Dropdown/select component
│   ├── ToggleControl.tsx       # Toggle switch component
│   └── RandomButton.tsx        # Random generation button
├── ExportButton.tsx            # PNG download functionality
└── GhostParts/
    ├── README.md               # Guide for adding new SVG assets
    ├── Eyes/
    │   └── index.ts            # SVG file list for eyes
    ├── Mouths/
    │   └── index.ts            # SVG file list for mouths
    ├── Eyebrows/
    │   └── index.ts            # SVG file list for eyebrows
    ├── Bodies/
    │   └── index.ts            # SVG file list for bodies
    ├── Hats/
    │   └── index.ts            # SVG file list for hats
    ├── HandItems/
    │   └── index.ts            # SVG file list for hand items
    └── Backgrounds/
        └── index.ts            # SVG file list for backgrounds

lib/
├── avatarStore.ts              # State management (Zustand)
├── componentRegistry.ts        # Central registry system
├── svgLoader.tsx               # SVG file loader utility
├── exportUtils.ts              # PNG export functionality
└── types.ts                    # TypeScript type definitions

public/
└── ghost-parts/                # SVG asset files
    ├── eyes/
    │   ├── round-eyes.svg
    │   └── happy-eyes.svg
    ├── mouths/
    ├── eyebrows/
    ├── bodies/
    ├── hats/
    ├── hand-items/
    └── backgrounds/
```

## Components and Interfaces

### Core Type Definitions

```typescript
// lib/types.ts

export interface GhostPartProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface AvatarConfiguration {
  eyes: string;
  mouth: string;
  eyebrows: string;
  blush: boolean;
  body: string;
  hat: string | null;
  leftHandItem: string | null;
  rightHandItem: string | null;
  background: string;
}

export interface ComponentRegistryEntry {
  id: string;
  label: string;
  component: React.ComponentType<GhostPartProps>;
}

export interface CategoryRegistry {
  [categoryName: string]: ComponentRegistryEntry[];
}
```

### Component Registry System

The registry system provides a centralized mapping between option IDs and their corresponding React components:

```typescript
// lib/componentRegistry.ts

import { CategoryRegistry } from './types';
import * as Eyes from '@/components/GhostParts/Eyes';
import * as Mouths from '@/components/GhostParts/Mouths';
// ... other imports

export const componentRegistry: CategoryRegistry = {
  eyes: Eyes.registry,
  mouths: Mouths.registry,
  eyebrows: Eyebrows.registry,
  bodies: Bodies.registry,
  hats: Hats.registry,
  handItems: HandItems.registry,
  backgrounds: Backgrounds.registry,
};

export function getComponent(category: string, id: string) {
  const categoryRegistry = componentRegistry[category];
  const entry = categoryRegistry?.find(item => item.id === id);
  return entry?.component || null;
}
```

### Category Index Pattern (SVG File-Based)

Each asset category has an index file that lists SVG files to load:

```typescript
// components/GhostParts/Eyes/index.ts

import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

// List all SVG files in the eyes category
const svgFiles = [
  'round-eyes.svg',
  'happy-eyes.svg',
  // Add more SVG files here
];

// Automatically generate registry from SVG files
export const registry = createSvgRegistryFromFiles('eyes', svgFiles);
```

### SVG File Pattern

Each SVG file should be placed in `public/ghost-parts/{category}/` and follow this structure:

```xml
<!-- public/ghost-parts/eyes/round-eyes.svg -->

<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Left eye -->
  <circle cx="380" cy="420" r="35" fill="#000000" />
  
  <!-- Right eye -->
  <circle cx="644" cy="420" r="35" fill="#000000" />
</svg>
```

**Benefits of SVG File-Based Approach:**
- No need to write React components manually
- Simply add SVG files to the public folder
- File names automatically convert to labels (e.g., `round-eyes.svg` → "Round Eyes")
- Easy for designers to add new assets without coding
```

### State Management

Using Zustand for lightweight, performant state management:

```typescript
// lib/avatarStore.ts

import { create } from 'zustand';
import { AvatarConfiguration } from './types';

interface AvatarStore {
  config: AvatarConfiguration;
  updateConfig: (updates: Partial<AvatarConfiguration>) => void;
  randomize: () => void;
}

export const useAvatarStore = create<AvatarStore>((set) => ({
  config: {
    eyes: 'round',
    mouth: 'smile',
    eyebrows: 'normal',
    blush: false,
    body: 'white',
    hat: null,
    leftHandItem: null,
    rightHandItem: null,
    background: 'none',
  },
  updateConfig: (updates) => set((state) => ({
    config: { ...state.config, ...updates }
  })),
  randomize: () => {
    // Implementation to select random options from each category
  },
}));
```

### Avatar Canvas Component

The main rendering component that composes all SVG parts:

```typescript
// components/AvatarCanvas.tsx

export default function AvatarCanvas() {
  const config = useAvatarStore((state) => state.config);
  const canvasRef = useRef<SVGSVGElement>(null);

  // Get components from registry
  const BackgroundComponent = getComponent('backgrounds', config.background);
  const BodyComponent = getComponent('bodies', config.body);
  const EyesComponent = getComponent('eyes', config.eyes);
  // ... other components

  return (
    <svg
      ref={canvasRef}
      viewBox="0 0 1024 1024"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 1: Background */}
      {BackgroundComponent && <BackgroundComponent />}
      
      {/* Layer 2: Body */}
      {BodyComponent && <BodyComponent />}
      
      {/* Layer 3: Facial features */}
      {EyesComponent && <EyesComponent />}
      {/* ... other facial features */}
      
      {/* Layer 4: Accessories */}
      {/* ... hats and hand items */}
    </svg>
  );
}
```

### Export Functionality

```typescript
// lib/exportUtils.ts

import html2canvas from 'html2canvas';
import download from 'downloadjs';

export async function exportAvatarAsPNG(svgElement: SVGSVGElement) {
  // Create a temporary container with white background for rendering
  const container = document.createElement('div');
  container.style.width = '1024px';
  container.style.height = '1024px';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute('width', '1024');
  clonedSvg.setAttribute('height', '1024');
  
  container.appendChild(clonedSvg);
  document.body.appendChild(container);
  
  try {
    const canvas = await html2canvas(container, {
      backgroundColor: null, // Transparent background
      scale: 1,
      width: 1024,
      height: 1024,
    });
    
    const timestamp = Date.now();
    const filename = `kiro-avatar-${timestamp}.png`;
    
    canvas.toBlob((blob) => {
      if (blob) {
        download(blob, filename, 'image/png');
      }
    });
  } finally {
    document.body.removeChild(container);
  }
}
```

## Data Models

### Avatar Configuration Model

The avatar configuration represents the current state of all customization options:

```typescript
interface AvatarConfiguration {
  // Facial features
  eyes: string;           // ID of selected eye variant
  mouth: string;          // ID of selected mouth variant
  eyebrows: string;       // ID of selected eyebrow variant
  blush: boolean;         // Whether blush is enabled
  
  // Body
  body: string;           // ID of selected body variant
  
  // Accessories (nullable - can be "none")
  hat: string | null;           // ID of selected hat or null
  leftHandItem: string | null;  // ID of left hand item or null
  rightHandItem: string | null; // ID of right hand item or null
  
  // Background
  background: string;     // ID of selected background
}
```

### Component Registry Model

The registry maps option IDs to their React components:

```typescript
interface ComponentRegistryEntry {
  id: string;                                    // Unique identifier
  label: string;                                 // Display name in UI
  component: React.ComponentType<GhostPartProps>; // React component
}

interface CategoryRegistry {
  [categoryName: string]: ComponentRegistryEntry[];
}
```

### SVG Coordinate System

All SVG components use a consistent 1024x1024 viewBox coordinate system:

- **Origin**: Top-left corner (0, 0)
- **Dimensions**: 1024 x 1024 units
- **Body center**: Approximately (512, 512)
- **Head area**: Y coordinates 200-500
- **Body area**: Y coordinates 400-900
- **Hand positions**: 
  - Left hand: X ~300, Y ~600
  - Right hand: X ~724, Y ~600

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Facial feature selection renders correct component

*For any* valid facial feature option (eyes, mouth, or eyebrows) from the component registry, when that option is selected in the avatar configuration, the rendered SVG should contain the corresponding component.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Blush toggle controls visibility

*For any* avatar configuration, toggling the blush option from false to true should add blush effects to the rendered avatar, and toggling from true to false should remove them.

**Validates: Requirements 1.4**

### Property 3: Body selection renders correct variant

*For any* valid body variant from the component registry, when that variant is selected in the avatar configuration, the rendered SVG should contain the corresponding body component with its pre-designed colors and patterns.

**Validates: Requirements 2.1**

### Property 4: Accessory selection renders correct component

*For any* valid accessory option (hat, left hand item, or right hand item) from the component registry, when that option is selected in the avatar configuration, the rendered SVG should contain the corresponding accessory component.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 5: Null accessory removes component

*For any* accessory type (hat, left hand item, or right hand item), when the configuration value is set to null, the rendered SVG should not contain any component for that accessory type.

**Validates: Requirements 3.4**

### Property 6: Background selection renders correct component

*For any* valid background option from the component registry, when that option is selected in the avatar configuration, the rendered SVG should contain the corresponding background component.

**Validates: Requirements 4.1**

### Property 7: PNG export dimensions are correct

*For any* avatar configuration, when the export function is called, the resulting PNG image should have dimensions of exactly 1024x1024 pixels.

**Validates: Requirements 5.1**

### Property 8: PNG export preserves transparency

*For any* avatar configuration, when exported to PNG, areas outside the avatar composition should have an alpha channel value of 0 (fully transparent).

**Validates: Requirements 5.2**

### Property 9: Export filename follows pattern

*For any* export operation, the generated filename should match the pattern "kiro-avatar-{timestamp}.png" where timestamp is a valid Unix timestamp in milliseconds.

**Validates: Requirements 5.3**

### Property 10: Random generation produces valid configuration

*For any* random generation operation, all selected options should exist in their respective component registries and form a valid avatar configuration.

**Validates: Requirements 6.1, 6.4**

### Property 11: Random generation synchronizes state

*For any* random generation operation, the avatar configuration state should match the options displayed in all customization controls.

**Validates: Requirements 6.2**

### Property 12: Registry extension enables component usage

*For any* new component added to a category registry, that component should be available for selection and rendering in the avatar maker without modifying UI logic.

**Validates: Requirements 8.1, 8.2**

### Property 13: New category registration is functional

*For any* new asset category added to the component registry system, components in that category should be selectable and renderable following the same patterns as existing categories.

**Validates: Requirements 8.4**

### Property 14: Component layering order is correct

*For any* avatar configuration, the rendered SVG should layer components in the correct z-order: background (layer 1), body (layer 2), facial features (layer 3), accessories (layer 4).

**Validates: Requirements 9.2**

## Error Handling

### Invalid Option Selection

**Scenario**: User attempts to select an option ID that doesn't exist in the registry

**Handling**:
- Validate option IDs against the registry before updating state
- If invalid, log a warning and fall back to the first available option in that category
- Display a user-friendly error message in development mode

### Export Failures

**Scenario**: PNG export fails due to browser limitations or html2canvas errors

**Handling**:
- Wrap export function in try-catch block
- Display error toast notification to user
- Log detailed error information to console
- Provide fallback option to copy SVG code

### Missing Components

**Scenario**: Registry references a component that doesn't exist or fails to load

**Handling**:
- Implement error boundaries around component rendering
- Display placeholder component with error indicator
- Log missing component details
- Continue rendering other valid components

### State Corruption

**Scenario**: Avatar configuration state becomes invalid (e.g., through manual state manipulation)

**Handling**:
- Implement state validation middleware in Zustand
- Reset to default configuration if validation fails
- Log corruption details for debugging
- Notify user that configuration was reset

### Browser Compatibility Issues

**Scenario**: Browser doesn't support required features (SVG, Canvas API, etc.)

**Handling**:
- Detect feature support on application load
- Display compatibility warning for unsupported browsers
- Provide graceful degradation where possible
- Suggest alternative browsers

## Testing Strategy

### Unit Testing

The application will use **Vitest** as the testing framework for unit tests, chosen for its speed, native ESM support, and excellent TypeScript integration with Next.js.

Unit tests will cover:

**Component Registry System**:
- Test that `getComponent()` returns correct components for valid IDs
- Test that registry lookups handle invalid IDs gracefully
- Test that each category index exports the expected registry structure

**State Management**:
- Test that `updateConfig()` correctly merges partial updates
- Test that state updates trigger re-renders
- Test default configuration values

**Export Utilities**:
- Test filename generation with various timestamps
- Test that export function handles missing elements gracefully
- Mock html2canvas to test export flow without actual rendering

**SVG Components**:
- Test that each example component renders without errors
- Test that components accept and apply className and style props
- Verify components render valid SVG markup

### Property-Based Testing

The application will use **fast-check** as the property-based testing library, which is the standard PBT library for TypeScript/JavaScript and integrates seamlessly with Vitest.

**Configuration**:
- Each property-based test will run a minimum of 100 iterations
- Tests will use custom generators for avatar configurations
- Each test will be tagged with a comment referencing the design document property

**Property Test Requirements**:
- Each correctness property MUST be implemented by a SINGLE property-based test
- Each test MUST be tagged using the format: `// Feature: halloween-ghost-avatar, Property {number}: {property_text}`
- Tests MUST use fast-check's generators to create random but valid test data

**Custom Generators**:

```typescript
// Test utilities for generating random configurations
import * as fc from 'fast-check';
import { componentRegistry } from '@/lib/componentRegistry';

// Generator for valid option IDs from a category
export const optionIdArbitrary = (category: string) => {
  const options = componentRegistry[category].map(entry => entry.id);
  return fc.constantFrom(...options);
};

// Generator for valid avatar configurations
export const avatarConfigArbitrary = fc.record({
  eyes: optionIdArbitrary('eyes'),
  mouth: optionIdArbitrary('mouths'),
  eyebrows: optionIdArbitrary('eyebrows'),
  blush: fc.boolean(),
  body: optionIdArbitrary('bodies'),
  hat: fc.option(optionIdArbitrary('hats'), { nil: null }),
  leftHandItem: fc.option(optionIdArbitrary('handItems'), { nil: null }),
  rightHandItem: fc.option(optionIdArbitrary('handItems'), { nil: null }),
  background: optionIdArbitrary('backgrounds'),
});
```

**Property Test Coverage**:
- Property 1: Test that selecting any valid facial feature option renders the correct component
- Property 2: Test that toggling blush adds/removes blush effects
- Property 3: Test that selecting any valid body variant renders correctly
- Property 4: Test that selecting any valid accessory renders the correct component
- Property 5: Test that null accessories don't render
- Property 6: Test that selecting any valid background renders correctly
- Property 7: Test PNG dimensions are always 1024x1024
- Property 8: Test PNG transparency is preserved
- Property 9: Test filename pattern matches for all timestamps
- Property 10: Test random generation produces valid configurations
- Property 11: Test state synchronization after randomization
- Property 12: Test that registry additions are immediately usable
- Property 13: Test that new categories work like existing ones
- Property 14: Test component layering order

### Integration Testing

Integration tests will verify:
- Complete user flows (customize → preview → export)
- Interaction between state management and UI components
- Registry system integration with rendering pipeline
- Export pipeline from SVG to PNG download

### Testing Approach

Following implementation-first development:
1. Implement core functionality first
2. Write property-based tests to verify correctness properties
3. Write unit tests for specific examples and edge cases
4. Run integration tests to verify complete workflows

This dual approach ensures both general correctness (via properties) and specific behavior validation (via unit tests).

## Performance Considerations

### Rendering Optimization

- Use React.memo() for SVG components to prevent unnecessary re-renders
- Implement shallow comparison for avatar configuration changes
- Debounce rapid configuration changes during UI interactions

### Code Splitting

- Lazy load SVG components using dynamic imports
- Split customization panel and preview canvas into separate chunks
- Load export utilities only when needed

### Asset Loading

- SVG components are code-based (no external file loading)
- Minimize SVG path complexity for faster rendering
- Use CSS transforms instead of SVG transforms where possible

### State Management

- Zustand provides minimal re-render overhead
- Selective state subscriptions to update only affected components
- Avoid deep object nesting in state

## Accessibility

### Keyboard Navigation

- All controls accessible via keyboard
- Logical tab order through customization options
- Enter/Space to activate buttons and toggles

### Screen Readers

- Proper ARIA labels for all controls
- Announce state changes (e.g., "Eyes changed to Happy Eyes")
- Descriptive alt text for preview canvas

### Visual Accessibility

- Sufficient color contrast for UI controls
- Focus indicators on all interactive elements
- Support for reduced motion preferences

## Browser Compatibility

**Target Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features**:
- SVG rendering
- Canvas API
- ES6+ JavaScript
- CSS Grid and Flexbox
- Local Storage (for future enhancements)

**Polyfills**: None required for target browsers

## Deployment Considerations

### Build Configuration

- Next.js static export for hosting on any static server
- Optimize SVG components during build
- Tree-shaking to remove unused code

### Environment Variables

- No sensitive data or API keys required
- All configuration is client-side

### Hosting

- Can be deployed to Vercel, Netlify, or any static host
- No server-side rendering required
- No database or backend services needed

## Future Enhancements

### Potential Features

- Save/load avatar configurations to local storage
- Share avatar via URL with encoded configuration
- Animation options for avatar elements
- Additional export formats (SVG, WebP)
- Undo/redo functionality
- Preset avatar templates
- Color customization for individual elements
- Multiple ghost characters in one composition

### Extensibility Points

- Plugin system for custom asset categories
- Theme system for UI customization
- Export format adapters
- Custom rendering pipelines
