/**
 * Component Registry System
 * 
 * Central registry that maps customization option IDs to their corresponding
 * React components. This enables extensibility - new components can be added
 * by simply registering them in their category index files.
 * 
 * Requirements: 8.1, 8.2
 */

import { CategoryRegistry, ComponentRegistryEntry } from './types';

/**
 * Central component registry
 * 
 * Each category (eyes, mouths, etc.) will export a registry array from its
 * index file. Those registries are imported and combined here.
 * 
 * Structure:
 * {
 *   eyes: [{ id: 'round', label: 'Round Eyes', component: RoundEyes }, ...],
 *   mouths: [{ id: 'smile', label: 'Smile', component: SmileMouth }, ...],
 *   ...
 * }
 */
export const componentRegistry: CategoryRegistry = {
  eyes: [],
  mouths: [],
  eyebrows: [],
  bodies: [],
  hats: [],
  handItems: [],
  backgrounds: [],
};

/**
 * Retrieve a component from the registry by category and ID
 * 
 * @param category - The asset category (e.g., 'eyes', 'mouths', 'bodies')
 * @param id - The unique identifier for the component within that category
 * @returns The React component if found, null otherwise
 * 
 * @example
 * const EyesComponent = getComponent('eyes', 'round');
 * if (EyesComponent) {
 *   return <EyesComponent />;
 * }
 */
export function getComponent(
  category: string,
  id: string
): React.ComponentType<any> | null {
  // Validate category exists
  const categoryRegistry = componentRegistry[category];
  
  if (!categoryRegistry) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Component Registry] Invalid category: "${category}". ` +
        `Available categories: ${Object.keys(componentRegistry).join(', ')}`
      );
    }
    return null;
  }
  
  // Find component by ID
  const entry = categoryRegistry.find((item: ComponentRegistryEntry) => item.id === id);
  
  if (!entry) {
    if (process.env.NODE_ENV === 'development') {
      const availableIds = categoryRegistry.map((item: ComponentRegistryEntry) => item.id).join(', ');
      console.warn(
        `[Component Registry] Invalid component ID: "${id}" in category "${category}". ` +
        `Available IDs: ${availableIds || 'none'}`
      );
    }
    return null;
  }
  
  return entry.component;
}

/**
 * Get all available options for a category
 * 
 * @param category - The asset category
 * @returns Array of registry entries for that category, or empty array if invalid
 * 
 * @example
 * const eyeOptions = getCategoryOptions('eyes');
 * // Returns: [{ id: 'round', label: 'Round Eyes', component: ... }, ...]
 */
export function getCategoryOptions(category: string): ComponentRegistryEntry[] {
  const categoryRegistry = componentRegistry[category];
  
  if (!categoryRegistry) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Component Registry] Invalid category: "${category}". ` +
        `Available categories: ${Object.keys(componentRegistry).join(', ')}`
      );
    }
    return [];
  }
  
  return categoryRegistry;
}

/**
 * Check if a component exists in the registry
 * 
 * @param category - The asset category
 * @param id - The component ID
 * @returns true if the component exists, false otherwise
 */
export function hasComponent(category: string, id: string): boolean {
  const categoryRegistry = componentRegistry[category];
  if (!categoryRegistry) return false;
  
  return categoryRegistry.some((item: ComponentRegistryEntry) => item.id === id);
}

/**
 * Get all registered categories
 * 
 * @returns Array of category names
 */
export function getCategories(): string[] {
  return Object.keys(componentRegistry);
}
