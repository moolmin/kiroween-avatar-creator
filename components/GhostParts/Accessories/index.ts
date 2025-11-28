import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

// List all SVG files in the accessories category
const svgFiles = [
  'none.svg',
  'wand.svg',
  'pumpkin-basket.svg',
  'candy.svg',
];

// Automatically generate registry from SVG files
export const registry = createSvgRegistryFromFiles('accessories', svgFiles);
