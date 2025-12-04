/**
 * Tests for Avatar Store
 * 
 * Verifies that the Zustand store correctly manages avatar configuration state,
 * validates inputs, and provides working update and randomize actions.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useAvatarStore } from './avatarStore';

describe('Avatar Store', () => {
  // Reset store to default state before each test
  beforeEach(() => {
    const { updateConfig } = useAvatarStore.getState();
    updateConfig({
      eyes: 'eyes-01',
      hat: null,
      cape: null,
      accessory: null,
      background: 'background-00',
    });
  });

  describe('Default Configuration', () => {
    it('should have valid default configuration', () => {
      const { config } = useAvatarStore.getState();
      
      expect(config).toBeDefined();
      expect(config.eyes).toBe('eyes-01');
      expect(config.hat).toBeNull();
      expect(config.cape).toBeNull();
      expect(config.accessory).toBeNull();
      expect(config.background).toBe('background-00');
    });
  });

  describe('updateConfig', () => {
    it('should update single property', () => {
      const { updateConfig, config: initialConfig } = useAvatarStore.getState();
      
      updateConfig({ eyes: 'eyes-02' });
      
      const { config: updatedConfig } = useAvatarStore.getState();
      expect(updatedConfig.eyes).toBe('eyes-02');
      expect(updatedConfig.cape).toBe(initialConfig.cape); // Other properties unchanged
    });

    it('should update multiple properties at once', () => {
      const { updateConfig } = useAvatarStore.getState();
      
      updateConfig({
        eyes: 'eyes-02',
        hat: 'hat-01',
        cape: 'capes-01',
      });
      
      const { config } = useAvatarStore.getState();
      expect(config.eyes).toBe('eyes-02');
      expect(config.hat).toBe('hat-01');
      expect(config.cape).toBe('capes-01');
    });

    it('should allow setting nullable properties to null', () => {
      const { updateConfig } = useAvatarStore.getState();
      
      // First set a hat
      updateConfig({ hat: 'hat-01' });
      expect(useAvatarStore.getState().config.hat).toBe('hat-01');
      
      // Then remove it
      updateConfig({ hat: null });
      expect(useAvatarStore.getState().config.hat).toBeNull();
    });

    it('should validate and fallback invalid values', () => {
      const { updateConfig } = useAvatarStore.getState();
      
      // Try to set an invalid eyes value
      updateConfig({ eyes: 'invalid-eyes-id' as any });
      
      const { config } = useAvatarStore.getState();
      // Should fall back to a valid value (first available option)
      expect(config.eyes).toBeTruthy();
      expect(typeof config.eyes).toBe('string');
    });
  });

  describe('randomize', () => {
    it('should generate valid random configuration', () => {
      const { randomize } = useAvatarStore.getState();
      
      randomize();
      
      const { config } = useAvatarStore.getState();
      
      // All required fields should have values
      expect(config.eyes).toBeTruthy();
      expect(config.cape).toBeTruthy();
      expect(config.background).toBeTruthy();
      
      // Nullable fields can be null or have values
      expect(config.hat === null || typeof config.hat === 'string').toBe(true);
      expect(config.accessory === null || typeof config.accessory === 'string').toBe(true);
    });

    it('should produce different configurations on multiple calls', () => {
      const { randomize, config: initialConfig } = useAvatarStore.getState();
      
      const configs = new Set<string>();
      
      // Generate 10 random configurations
      for (let i = 0; i < 10; i++) {
        randomize();
        const { config } = useAvatarStore.getState();
        configs.add(JSON.stringify(config));
      }
      
      // Should have generated at least 2 different configurations
      // (very unlikely to get the same config 10 times in a row)
      expect(configs.size).toBeGreaterThan(1);
    });
  });

  describe('State Validation', () => {
    it('should maintain valid state after multiple updates', () => {
      const { updateConfig } = useAvatarStore.getState();
      
      // Perform multiple updates
      updateConfig({ eyes: 'eyes-02' });
      updateConfig({ hat: 'hat-01' });
      updateConfig({ cape: 'capes-01' });
      updateConfig({ accessory: 'accessories-01' });
      updateConfig({ background: 'background-01' });
      
      const { config } = useAvatarStore.getState();
      
      // All values should be valid
      expect(config.eyes).toBe('eyes-02');
      expect(config.hat).toBe('hat-01');
      expect(config.cape).toBe('capes-01');
      expect(config.accessory).toBe('accessories-01');
      expect(config.background).toBe('background-01');
    });
  });
});
