/**
 * SVG Loader Utility
 * 
 * Automatically loads SVG files from category folders and converts them
 * to React components. This eliminates the need to manually create
 * component files for each SVG asset.
 * 
 * Usage:
 * 1. Place SVG files in public/ghost-parts/{category}/ folder
 * 2. Name files descriptively (e.g., round-eyes.svg, happy-eyes.svg)
 * 3. Import this utility in your category index.ts file
 * 4. Call createSvgRegistryFromFiles() with the list of SVG filenames
 * 
 * Example:
 * // components/GhostParts/Eyes/index.ts
 * import { createSvgRegistryFromFiles } from '@/lib/svgLoader';
 * export const registry = createSvgRegistryFromFiles('eyes', [
 *   'round-eyes.svg',
 *   'happy-eyes.svg',
 * ]);
 */

import React from 'react';
import { ComponentRegistryEntry, GhostPartProps } from './types';

/**
 * Convert kebab-case filename to Title Case label
 * @example "round-eyes" -> "Round Eyes"
 */
export function filenameToLabel(filename: string): string {
  return filename
    .replace(/\.svg$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert filename to ID (remove .svg extension)
 * @example "round-eyes.svg" -> "round-eyes"
 */
export function filenameToId(filename: string): string {
  return filename.replace(/\.svg$/, '');
}

/**
 * Create a React component that renders an SVG from the public folder
 * 
 * @param category - Category name (e.g., 'eyes', 'mouths')
 * @param filename - SVG filename (e.g., 'round-eyes.svg')
 * @returns React component that renders the SVG content
 */
export function createSvgComponent(
  category: string,
  filename: string
): React.ComponentType<GhostPartProps> {
  const svgPath = `/ghost-parts/${category}/${filename}`;
  
  const SvgComponent = ({ className, style }: GhostPartProps) => {
    return (
      <g className={className} style={style}>
        <image
          href={svgPath}
          width="1024"
          height="1024"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    );
  };

  SvgComponent.displayName = `Svg(${category}/${filename})`;
  return SvgComponent;
}

/**
 * Create registry entries from a list of SVG filenames
 * 
 * @param category - Category name (e.g., 'eyes', 'mouths')
 * @param filenames - Array of SVG filenames in public/ghost-parts/{category}/
 * @returns Array of ComponentRegistryEntry objects
 * 
 * @example
 * export const registry = createSvgRegistryFromFiles('eyes', [
 *   'round-eyes.svg',
 *   'happy-eyes.svg',
 * ]);
 */
export function createSvgRegistryFromFiles(
  category: string,
  filenames: string[]
): ComponentRegistryEntry[] {
  return filenames.map(filename => ({
    id: filenameToId(filename),
    label: filenameToLabel(filename),
    component: createSvgComponent(category, filename),
  }));
}
