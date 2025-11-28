# Implementation Plan

- [x] 1. Initialize Next.js project and install dependencies
  - Create Next.js 14 app with TypeScript and Tailwind CSS
  - Install required packages: zustand, html2canvas, downloadjs, @headlessui/react, fast-check
  - Configure TypeScript with strict mode
  - Set up Tailwind configuration
  - _Requirements: All_

- [x] 2. Create type definitions and core interfaces
  - Define GhostPartProps interface for SVG components
  - Define AvatarConfiguration interface for state management
  - Define ComponentRegistryEntry and CategoryRegistry interfaces
  - Create utility types for component mapping
  - _Requirements: 8.3, 9.5_

- [x] 3. Implement component registry system
  - Create componentRegistry.ts with central registry structure
  - Implement getComponent() function for registry lookups
  - Add error handling for invalid component IDs
  - _Requirements: 8.1, 8.2_

- [x] 3.1 Write property test for registry extension
  - **Property 12: Registry extension enables component usage**
  - **Validates: Requirements 8.1, 8.2**

- [x] 4. Create example SVG assets for Eyes category
  - Create public/ghost-parts/eyes directory
  - Create round-eyes.svg with circular eye shapes
  - Create happy-eyes.svg with curved eye shapes
  - Create components/GhostParts/Eyes/index.ts with SVG file list
  - _Requirements: 1.1_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [ ] 5. Create example SVG assets for Mouths category
  - Create public/ghost-parts/mouths directory
  - Create smile-mouth.svg with curved smile
  - Create grin-mouth.svg with wide grin
  - Create components/GhostParts/Mouths/index.ts with SVG file list
  - _Requirements: 1.2_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [ ] 6. Create example SVG assets for Eyebrows category
  - Create public/ghost-parts/eyebrows directory
  - Create normal-brows.svg with standard eyebrows
  - Create angry-brows.svg with angled eyebrows
  - Create components/GhostParts/Eyebrows/index.ts with SVG file list
  - _Requirements: 1.3_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [ ] 7. Create example SVG assets for Bodies category
  - Create public/ghost-parts/bodies directory
  - Create white-ghost.svg with white ghost body
  - Create purple-ghost.svg with purple ghost body
  - Create components/GhostParts/Bodies/index.ts with SVG file list
  - _Requirements: 2.1_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [ ] 8. Create example SVG assets for Hats category
  - Create public/ghost-parts/hats directory
  - Create witch-hat.svg with witch hat design
  - Create pumpkin-hat.svg with pumpkin hat design
  - Create components/GhostParts/Hats/index.ts with SVG file list
  - _Requirements: 3.1_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [ ] 9. Create example SVG assets for HandItems category
  - Create public/ghost-parts/hand-items directory
  - Create candy.svg with candy design
  - Create broom.svg with broom design
  - Create components/GhostParts/HandItems/index.ts with SVG file list
  - _Requirements: 3.2, 3.3_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [ ] 10. Create example SVG assets for Backgrounds category
  - Create public/ghost-parts/backgrounds directory
  - Create sparkles.svg with sparkle effects
  - Create none.svg (empty/transparent background)
  - Create components/GhostParts/Backgrounds/index.ts with SVG file list
  - _Requirements: 4.1, 4.2_
  - _Note: Uses SVG file-based system - just add SVG files to public folder_

- [ ]* 10.1 Write property test for facial feature rendering
  - **Property 1: Facial feature selection renders correct component**
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [ ]* 10.2 Write property test for body rendering
  - **Property 3: Body selection renders correct variant**
  - **Validates: Requirements 2.1**

- [ ]* 10.3 Write property test for accessory rendering
  - **Property 4: Accessory selection renders correct component**
  - **Validates: Requirements 3.1, 3.2, 3.3**

- [ ]* 10.4 Write property test for null accessory handling
  - **Property 5: Null accessory removes component**
  - **Validates: Requirements 3.4**

- [ ]* 10.5 Write property test for background rendering
  - **Property 6: Background selection renders correct component**
  - **Validates: Requirements 4.1**

- [ ] 11. Implement Zustand state management
  - Create avatarStore.ts with AvatarConfiguration state
  - Implement updateConfig() action for partial updates
  - Set default configuration values
  - Add state validation middleware
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 3.2, 3.3, 4.1_

- [ ]* 11.1 Write unit tests for state management
  - Test updateConfig() merges partial updates correctly
  - Test default configuration values
  - Test state validation

- [ ] 12. Create AvatarCanvas component with SVG composition
  - Create AvatarCanvas.tsx component
  - Implement SVG viewBox with 1024x1024 dimensions
  - Use getComponent() to retrieve components from registry
  - Implement layering system: background → body → facial features → accessories
  - Add ref for export functionality
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 3.2, 3.3, 4.1, 9.2_

- [ ]* 12.1 Write property test for blush toggle
  - **Property 2: Blush toggle controls visibility**
  - **Validates: Requirements 1.4**

- [ ]* 12.2 Write property test for component layering
  - **Property 14: Component layering order is correct**
  - **Validates: Requirements 9.2**

- [ ] 13. Implement blush feature
  - Add blush SVG component or effect
  - Integrate blush rendering in AvatarCanvas based on config.blush
  - Position blush appropriately on ghost cheeks
  - _Requirements: 1.4_

- [ ] 14. Create SelectControl component for dropdowns
  - Create components/controls/SelectControl.tsx
  - Use Headless UI Listbox for accessible dropdown
  - Accept options array and onChange handler
  - Style with Tailwind CSS
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 3.1, 3.2, 3.3, 4.1_

- [ ] 15. Create ToggleControl component
  - Create components/controls/ToggleControl.tsx
  - Use Headless UI Switch for accessible toggle
  - Accept label, checked state, and onChange handler
  - Style with Tailwind CSS
  - _Requirements: 1.4_

- [ ] 16. Create CustomizationPanel component
  - Create CustomizationPanel.tsx with all customization controls
  - Add SelectControl for eyes, mouths, eyebrows, bodies, hats, hand items, backgrounds
  - Add ToggleControl for blush
  - Connect controls to Zustand store
  - Populate options from component registry
  - Implement responsive layout (sidebar on desktop, bottom sheet on mobile)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 3.1, 3.2, 3.3, 3.4, 4.1, 7.1, 7.2, 7.4_

- [ ] 17. Implement random generation functionality
  - Add randomize() action to avatarStore
  - Implement logic to select random valid options from each category
  - Handle nullable accessories (randomly include or exclude)
  - Ensure all randomized options exist in registries
  - _Requirements: 6.1, 6.4_

- [ ]* 17.1 Write property test for random generation validity
  - **Property 10: Random generation produces valid configuration**
  - **Validates: Requirements 6.1, 6.4**

- [ ]* 17.2 Write property test for state synchronization
  - **Property 11: Random generation synchronizes state**
  - **Validates: Requirements 6.2**

- [ ] 18. Create RandomButton component
  - Create components/controls/RandomButton.tsx
  - Connect to randomize() action from store
  - Add icon and styling
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 19. Implement PNG export functionality
  - Create lib/exportUtils.ts
  - Implement exportAvatarAsPNG() function using html2canvas
  - Set canvas dimensions to 1024x1024
  - Configure transparent background
  - Generate filename with timestamp pattern: kiro-avatar-{timestamp}.png
  - Use downloadjs to trigger download
  - Add error handling for export failures
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 19.1 Write property test for PNG dimensions
  - **Property 7: PNG export dimensions are correct**
  - **Validates: Requirements 5.1**

- [ ]* 19.2 Write property test for PNG transparency
  - **Property 8: PNG export preserves transparency**
  - **Validates: Requirements 5.2**

- [ ]* 19.3 Write property test for filename pattern
  - **Property 9: Export filename follows pattern**
  - **Validates: Requirements 5.3**

- [ ] 20. Create ExportButton component
  - Create ExportButton.tsx component
  - Connect to exportAvatarAsPNG() function
  - Pass SVG ref from AvatarCanvas
  - Add loading state during export
  - Display error toast on export failure
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 10.3_

- [ ] 21. Build main application page
  - Create app/page.tsx with main layout
  - Integrate AvatarCanvas and CustomizationPanel
  - Add ExportButton and RandomButton
  - Implement responsive grid layout
  - Add loading states
  - _Requirements: 7.1, 7.2, 7.3, 10.2_

- [ ] 22. Style application with Tailwind CSS
  - Configure Tailwind theme for Halloween aesthetic
  - Style CustomizationPanel with proper spacing and typography
  - Style controls with hover and focus states
  - Implement responsive breakpoints (mobile < 768px, desktop >= 768px)
  - Add smooth transitions for interactions
  - Ensure minimum touch target sizes (44x44px)
  - _Requirements: 7.1, 7.2, 7.4, 10.4_

- [ ] 23. Add accessibility features
  - Add ARIA labels to all controls
  - Implement keyboard navigation
  - Add focus indicators
  - Test with screen readers
  - Add descriptive labels for avatar preview
  - _Requirements: 10.4_

- [ ] 24. Implement error boundaries
  - Create error boundary component for SVG rendering
  - Add fallback UI for missing components
  - Log errors to console
  - _Requirements: Error handling_

- [ ] 25. Add browser compatibility checks
  - Detect SVG and Canvas API support
  - Display compatibility warning for unsupported browsers
  - Add graceful degradation
  - _Requirements: 7.5_

- [ ]* 26. Write integration tests
  - Test complete customization flow
  - Test random generation and export workflow
  - Test responsive layout changes
  - Test error scenarios

- [ ] 27. Create documentation for adding new SVG assets
  - Write README.md with instructions for adding new components
  - Provide code examples for creating SVG components
  - Document registry pattern
  - Include troubleshooting guide
  - _Requirements: 8.1, 8.2, 8.5_

- [ ] 28. Optimize performance
  - Add React.memo() to SVG components
  - Implement shallow comparison for config changes
  - Test rendering performance with all options
  - Optimize SVG path complexity if needed
  - _Requirements: 10.1_

- [ ] 29. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
