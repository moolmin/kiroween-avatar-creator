import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SelectControl from './SelectControl';
import { getCategoryOptions } from '@/lib/componentRegistry';

describe('SelectControl Integration', () => {
  it('works with actual component registry data', () => {
    const onChange = vi.fn();
    const eyeOptions = getCategoryOptions('eyes');
    
    // Verify we have options from the registry
    expect(eyeOptions.length).toBeGreaterThan(0);
    
    const { container } = render(
      <SelectControl
        label="Eyes"
        value={eyeOptions[0].id}
        options={eyeOptions}
        onChange={onChange}
      />
    );

    expect(screen.getByText('Eyes')).toBeTruthy();
    expect(screen.getByText(eyeOptions[0].label)).toBeTruthy();
    expect(container).toBeTruthy();
  });

  it('works with nullable options like hats', () => {
    const onChange = vi.fn();
    const hatOptions = getCategoryOptions('hats');
    
    const { container } = render(
      <SelectControl
        label="Hat"
        value={null}
        options={hatOptions}
        onChange={onChange}
        nullable={true}
      />
    );

    expect(screen.getByText('Hat')).toBeTruthy();
    expect(screen.getByText('None')).toBeTruthy();
    expect(container).toBeTruthy();
  });
});
