import { describe, it, expect, beforeEach } from 'vitest';
import { 
  componentRegistry, 
  getComponent, 
  getCategoryOptions, 
  hasComponent, 
  getCategories 
} from './componentRegistry';
import { ComponentRegistryEntry } from './types';

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
});
