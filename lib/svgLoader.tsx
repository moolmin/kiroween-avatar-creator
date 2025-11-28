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

'use client';

import React, { useEffect, useState } from 'react';
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
 * Cache for loaded SVG content
 */
const svgContentCache: Record<string, string> = {};

/**
 * Load SVG content and cache it
 */
async function loadSvgContent(svgPath: string): Promise<string> {
  if (svgContentCache[svgPath]) {
    return svgContentCache[svgPath];
  }

  try {
    const response = await fetch(svgPath);
    const text = await response.text();
    
    // Parse the SVG to extract only the inner content
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    
    if (!svgElement) {
      throw new Error('Invalid SVG file');
    }
    
    // Get the inner HTML (everything inside the <svg> tag)
    const innerContent = svgElement.innerHTML;
    svgContentCache[svgPath] = innerContent;
    
    return innerContent;
  } catch (error) {
    console.error(`Failed to load SVG: ${svgPath}`, error);
    return '';
  }
}

/**
 * Create a React component that renders an SVG from the public folder
 * 
 * @param category - Category name (e.g., 'eyes', 'mouths')
 * @param filename - SVG filename (e.g., 'round-eyes.svg')
 * @returns React component that renders the SVG content inline
 */
export function createSvgComponent(
  category: string,
  filename: string
): React.ComponentType<GhostPartProps> {
  const svgPath = `/ghost-parts/${category}/${filename}`;
  
  const SvgComponent = ({ className, style }: GhostPartProps) => {
    const [svgContent, setSvgContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      loadSvgContent(svgPath)
        .then(content => {
          setSvgContent(content);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }, []);
    
    if (isLoading) {
      // Return empty group while loading
      return <g className={className} style={style} />;
    }
    
    if (!svgContent) {
      // Fallback to image element if inline loading fails
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
    }
    
    // Render the SVG content inline
    return (
      <g 
        className={className} 
        style={style}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
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

/**
 * Preload all SVG files for a category to populate cache
 * This can be called on app initialization to improve performance
 */
export async function preloadCategorySvgs(
  category: string,
  filenames: string[]
): Promise<void> {
  const promises = filenames.map(filename => {
    const svgPath = `/ghost-parts/${category}/${filename}`;
    return loadSvgContent(svgPath);
  });
  
  await Promise.all(promises);
}