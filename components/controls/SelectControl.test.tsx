import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SelectControl from './SelectControl';
import { ComponentRegistryEntry } from '@/lib/types';

describe('SelectControl', () => {
  const mockOptions: ComponentRegistryEntry[] = [
    { id: 'option1', label: 'Option 1', component: () => null },
    { id: 'option2', label: 'Option 2', component: () => null },
    { id: 'option3', label: 'Option 3', component: () => null },
  ];

  it('renders with label and selected value', () => {
    const onChange = vi.fn();
    const { container } = render(
      <SelectControl
        label="Test Select"
        value="option1"
        options={mockOptions}
        onChange={onChange}
      />
    );

    expect(screen.getByText('Test Select')).toBeTruthy();
    expect(screen.getByText('Option 1')).toBeTruthy();
    expect(container).toBeTruthy();
  });

  it('displays "None" when nullable and value is null', () => {
    const onChange = vi.fn();
    const { container } = render(
      <SelectControl
        label="Test Select"
        value={null}
        options={mockOptions}
        onChange={onChange}
        nullable={true}
      />
    );

    expect(screen.getByText('None')).toBeTruthy();
    expect(container).toBeTruthy();
  });

  it('displays "Select..." when value is null and not nullable', () => {
    const onChange = vi.fn();
    const { container } = render(
      <SelectControl
        label="Test Select"
        value={null}
        options={mockOptions}
        onChange={onChange}
        nullable={false}
      />
    );

    expect(screen.getByText('Select...')).toBeTruthy();
    expect(container).toBeTruthy();
  });
});
