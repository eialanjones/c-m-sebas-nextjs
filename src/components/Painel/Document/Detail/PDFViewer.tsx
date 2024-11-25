'use client';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
}

interface PDFViewerProps {
  pdfUrl: string;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-neutral-800 text-neutral-400 w-full">
        <svg
          aria-hidden="true"
          className="w-20 h-20 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        <p className="text-lg">Nenhum documento disponível</p>
        <p className="text-sm mt-2">Aguarde o envio do documento</p>
      </div>
    );
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col h-full w-full max-w-[calc(100vw-100px)] overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-neutral-800 rounded-lg">
        <button 
          type="button"
          onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-white">
          Página {pageNumber} de {numPages}
        </span>
        <button 
          type="button"
          onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
          disabled={pageNumber >= numPages}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center"
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="max-w-full"
            scale={1}
            width={Math.min(window.innerWidth - 220, 800)}
          />
        </Document>
      </div>
    </div>
  );
}
