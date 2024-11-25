'use client';
import { useState } from 'react';

interface PDFViewerProps {
  pdfUrl: string;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
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

  return (
    <div className="flex flex-col h-full w-full max-w-[calc(100vw-100px)] overflow-hidden">
      <object
        data={pdfUrl}
        type="application/pdf"
        className="w-full h-full"
      >
        <p>
          Seu navegador não suporta a visualização de PDF.{' '}
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Clique aqui para baixar
          </a>
        </p>
      </object>
    </div>
  );
}
