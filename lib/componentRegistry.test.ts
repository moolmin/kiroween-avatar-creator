import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { 
  componentRegistry, 
  getComponent, 
  getCategoryOptions, 
  hasComponent, 
  getCategories 
} from './componentRegistry';
import { ComponentRegistryEntry, GhostPartProps } from './types';

describe('Component Registry System', () => {
  describe('componentRegistry structure', () => {
    it('should have all required categories', () => {
      const expectedCategories = [
        'eyes',
        'mouths',
        'eyebrows',
        'bodies',
        'hats',
        'handItems',
        'backgrounds'
      ];
      
      expectedCategories.forEach(category => {
        expect(componentRegistry).toHaveProperty(category);
        expect(Array.isArray(componentRegistry[category])).toBe(true);
      });
    });
  });

  describe('getComponent', () => {
    it('should return null for invalid category', () => {
      const result = getComponent('invalidCategory', 'someId');
      expect(result).toBeNull();
    });

    it('should return null for invalid component ID in valid category', () => {
      const result = getComponent('eyes', 'nonexistentId');
      expect(result).toBeNull();
    });

    it('should return null when category is empty', () => {
      const result = getComponent('eyes', 'anyId');
      expect(result).toBeNull();
    });
  });

  describe('getCategoryOptions', () => {
    it('should return empty array for invalid category', () => {
      const result = getCategoryOptions('invalidCategory');
      expect(result).toEqual([]);
    });

    it('should return empty array for valid but unpopulated category', () => {
      const result = getCategoryOptions('eyes');
      expect(result).toEqual([]);
    });
  });

  describe('hasComponent', () => {
    it('should return false for invalid category', () => {
      const result = hasComponent('invalidCategory', 'someId');
      expect(result).toBe(false);
    });

    it('should return false for invalid component ID in valid category', () => {
      const result = hasComponent('eyes', 'nonexistentId');
      expect(result).toBe(false);
    });
  });

  describe('getCategories', () => {
    it('should return all category names', () => {
      const categories = getCategories();
      expect(categories).toContain('eyes');
      expect(categories).toContain('mouths');
      expect(categories).toContain('eyebrows');
      expect(categories).toContain('bodies');
      expect(categories).toContain('hats');
      expect(categories).toContain('handItems');
      expect(categories).toContain('backgrounds');
    });
  });

  // Feature: halloween-ghost-avatar, Property 12: Registry extension enables component usage
  describe('Property 12: Registry extension enables component usage', () => {
    it('should make any new component added to a category registry available for selection and rendering', () => {
      fc.assert(
        fc.property(
          // Generate random category from existing categories
          fc.constantFrom(...getCategories()),
          // Generate random component ID
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
          // Generate random label
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          (category, componentId, componentLabel) => {
            // Create a mock component
            const MockComponent: React.ComponentType<GhostPartProps> = ({ className, style }) => {
              return null; // Simple mock component
            };
            MockComponent.displayName = `Mock${componentId}`;

            // Create a new registry entry
            const newEntry: ComponentRegistryEntry = {
              id: componentId,
              label: componentLabel,
              component: MockComponent,
            };

            // Store original registry state
            const originalRegistry = [...componentRegistry[category]];

            // Add the new component to the registry
            componentRegistry[category].push(newEntry);

            try {
              // Verify the component is now available for selection
              const retrievedComponent = getComponent(category, componentId);
              expect(retrievedComponent).not.toBeNull();
              expect(retrievedComponent).toBe(MockComponent);

              // Verify it appears in category options
              const categoryOptions = getCategoryOptions(category);
              const foundEntry = categoryOptions.find(entry => entry.id === componentId);
              expect(foundEntry).toBeDefined();
              expect(foundEntry?.label).toBe(componentLabel);
              expect(foundEntry?.component).toBe(MockComponent);

              // Verify hasComponent returns true
              expect(hasComponent(category, componentId)).toBe(true);
            } finally {
              // Restore original registry state
              componentRegistry[category] = originalRegistry;
            }
          }
        ),
        { numRuns: 100 } // Run 100 iterations as specified in design
      );
    });
  });
});
