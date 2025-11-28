import html2canvas from 'html2canvas';
import download from 'downloadjs';

/**
 * Exports an SVG element as a PNG image with transparent background
 * @param svgElement - The SVG element to export
 * @throws Error if export fails
 */
export async function exportAvatarAsPNG(svgElement: SVGSVGElement): Promise<void> {
  try {
    // Wait a bit to ensure all SVG content is fully rendered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.width = '1024px';
    container.style.height = '1024px';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.background = 'transparent';
    
    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute('width', '1024');
    clonedSvg.setAttribute('height', '1024');
    clonedSvg.style.width = '1024px';
    clonedSvg.style.height = '1024px';
    
    container.appendChild(clonedSvg);
    document.body.appendChild(container);
    
    try {
      // Wait for any dynamic content to load
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Convert to canvas with transparent background
      const canvas = await html2canvas(container, {
        backgroundColor: null, // Transparent background
        scale: 2, // Higher quality
        width: 1024,
        height: 1024,
        logging: false,
        useCORS: true, // Enable CORS for external resources
        allowTaint: true, // Allow tainting the canvas with cross-origin images
      });
      
      // Generate filename with timestamp pattern
      const timestamp = Date.now();
      const filename = `kiro-avatar-${timestamp}.png`;
      
      // Convert canvas to blob and trigger download
      canvas.toBlob((blob) => {
        if (blob) {
          download(blob, filename, 'image/png');
        } else {
          throw new Error('Failed to create PNG blob');
        }
      }, 'image/png', 1.0); // Maximum quality
    } finally {
      // Clean up temporary container
      document.body.removeChild(container);
    }
  } catch (error) {
    console.error('PNG export failed:', error);
    throw new Error(
      `Failed to export avatar as PNG: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
