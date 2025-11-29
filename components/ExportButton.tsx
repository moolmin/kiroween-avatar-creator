/**
 * ExportButton Component
 * 
 * A button that exports the current avatar as a PNG image.
 * Connects to the exportAvatarAsPNG() function and handles loading
 * and error states during the export process.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 12.3
 */

'use client';

import { useState, useEffect } from 'react';
import { exportAvatarAsPNG } from '@/lib/exportUtils';
import { checkBrowserCompatibility } from '@/lib/browserCompatibility';

export interface ExportButtonProps {
  svgRef: React.RefObject<SVGSVGElement>;
  className?: string;
}

export default function ExportButton({ svgRef, className = '' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canvasSupported, setCanvasSupported] = useState(true);

  useEffect(() => {
    // Check Canvas API support on mount
    const compatibility = checkBrowserCompatibility();
    setCanvasSupported(compatibility.canvas);
  }, []);

  const handleExport = async () => {
    // Clear any previous errors
    setError(null);

    // Check Canvas API support
    if (!canvasSupported) {
      setError('Your browser does not support Canvas API, which is required for PNG export. Please use a modern browser.');
      return;
    }

    // Validate SVG ref
    if (!svgRef.current) {
      setError('Avatar canvas not ready. Please try again.');
      return;
    }

    setIsExporting(true);

    try {
      await exportAvatarAsPNG(svgRef.current);
      // Success - no need to show a message, download will start
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export avatar';
      setError(errorMessage);
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Auto-dismiss error after 5 seconds
  if (error) {
    setTimeout(() => setError(null), 5000);
  }

  return (
    <div className={className}>
      <button
        onClick={handleExport}
        disabled={isExporting || !canvasSupported}
        className="px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={
          !canvasSupported 
            ? 'Export not available - Canvas API not supported' 
            : isExporting 
            ? 'Exporting avatar, please wait' 
            : 'Export avatar as PNG image'
        }
        aria-busy={isExporting}
        title={
          !canvasSupported
            ? 'Canvas API not supported in your browser'
            : 'Download your customized avatar as a PNG image (1024x1024 pixels)'
        }
      >
        <span className="text-sm font-semibold">
          {isExporting ? 'DOWNLOADING...' : 'DOWNLOAD'}
        </span>
      </button>

      {/* Error toast notification */}
      {error && (
        <div
          className="mt-3 rounded-xl bg-red-50 border-2 border-red-300 px-4 py-3 text-red-800 text-sm shadow-lg animate-pulse"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <svg
              className="h-6 w-6 flex-shrink-0 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
