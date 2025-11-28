/**
 * RandomButton Component Tests
 * 
 * Tests for the RandomButton component to ensure it properly connects
 * to the store and triggers randomization.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RandomButton from './RandomButton';
import { useAvatarStore } from '@/lib/avatarStore';

describe('RandomButton', () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useAvatarStore.setState({
      config: {
        eyes: 'round-eyes',
        hat: null,
        cape: 'white-cape',
        accessory: null,
        background: 'none',
      },
    });
  });

  it('renders the randomize button', () => {
    render(<RandomButton />);
    
    const button = screen.getByRole('button', { name: /generate random avatar/i });
    expect(button).toBeDefined();
    expect(screen.getByText('Randomize')).toBeDefined();
  });

  it('updates avatar configuration when clicked', () => {
    render(<RandomButton />);
    
    const initialConfig = useAvatarStore.getState().config;
    
    const button = screen.getByRole('button', { name: /generate random avatar/i });
    fireEvent.click(button);
    
    const newConfig = useAvatarStore.getState().config;
    
    // At least one property should have changed (very high probability with random generation)
    // We check that the config object is different
    const configChanged = 
      initialConfig.eyes !== newConfig.eyes ||
      initialConfig.hat !== newConfig.hat ||
      initialConfig.cape !== newConfig.cape ||
      initialConfig.accessory !== newConfig.accessory ||
      initialConfig.background !== newConfig.background;
    
    expect(configChanged).toBe(true);
  });

  it('has proper accessibility attributes', () => {
    render(<RandomButton />);
    
    const button = screen.getByRole('button', { name: /generate random avatar/i });
    expect(button.getAttribute('aria-label')).toBe('Generate random avatar with random eyes, hat, cape, accessory, and background');
    expect(button.getAttribute('title')).toBe('Click to randomize all avatar options');
  });
});
