"use client";

export interface ClientData {
	nomeCliente: string;
	cnpj: string;
	email: string;
	responsavel: string;
	siscebas: {
		login: string;
		senha: string;
	};
	numeroCNES: string;
}

export interface Document {
	id: number;
	name: string;
	checkItems: string[];
}

export type DocumentStatus = 
  | "Documentos Pedentes"
  | "Pendente de Analise"
  | "Aguardando Correção"
  | "Pendente de Protocolo"
  | "Protocolado Deferido"
  | "Protocolado Indeferido"
  | "Protocolado Recursal";

import { useEffect, useState } from "react";
import { DocumentProgress } from "./DocumentProgress";
import { ModelCebasAssistencia, ModelCebasCts, ModelCebasIlpi, ModelCebasSaude60Sus, ModelCebasSaudePromocaoASaude } from "./data";
import { DocumentContent } from "./DocumentContent";
import { PDFViewer } from "./PDFViewer";
import type { Customer } from '@/types/customer';

interface DocumentViewerProps {
	customer?: Customer;
}

export default function DocumentViewer({ customer }: DocumentViewerProps) {
	const [documents, setDocuments] = useState<Document[]>([]);
	const documentType: string = "saude-promocao";
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>('');

	// Move checkedItems state after documents are set
	const [checkedItems, setCheckedItems] = useState<Record<number, Record<string, boolean>>>({});

	useEffect(() => {
		let selectedDocuments: Document[] = [];
		
		switch (documentType) {
			case "saude-promocao":
				selectedDocuments = ModelCebasSaudePromocaoASaude;
				break;
			case "saude-60sus":
				selectedDocuments = ModelCebasSaude60Sus;
				break;
			case "assistencia":
				selectedDocuments = ModelCebasAssistencia;
				break;
			case "ilpi":
				selectedDocuments = ModelCebasIlpi;
				break;
			case "cts":
				selectedDocuments = ModelCebasCts;
				break;
			default:
				selectedDocuments = [];
		}

		setDocuments(selectedDocuments);
		// Initialize checkedItems for each document
		setCheckedItems(
			Object.fromEntries(
				selectedDocuments.map((_, index) => [index, {}])
			)
		);
	}, []);

	const [currentStep, setCurrentStep] = useState(0);
	const [clientData, setClientData] = useState<ClientData>({
		nomeCliente: customer?.data?.nomeCliente || "",
		cnpj: customer?.data?.cnpj || "",
		email: customer?.data?.email || "",
		responsavel: customer?.data?.responsavel || "",
		siscebas: {
			login: customer?.data?.siscebas?.login || "",
			senha: customer?.data?.siscebas?.senha || "",
		},
		numeroCNES: customer?.data?.numeroCNES || "",
	});
	const [observations, setObservations] = useState<string[]>(
		Array(documents.length).fill(""),
	);
	const [status, setStatus] = useState<DocumentStatus>(customer?.status || "Documentos Pedentes");

	// Add new function to check if current step is complete
	const isCurrentStepComplete = (step: number): boolean => {
		if (step === 0) return true; // First step (client data) is always valid
		
		const currentDocument = documents[step];
		const currentCheckedItems = checkedItems[step];
		
		return currentDocument?.checkItems.every(
			item => currentCheckedItems?.[item] === true
		);
	};

	const handleReturnToClient = () => setCurrentStep(0);
	const handleConcludeAnalysis = () => setCurrentStep(0);

	// Modify DocumentProgress props to include validation
	return (
		<div className="flex h-full">
			<DocumentProgress
				documents={documents}
				currentStep={currentStep}
				onStepChange={setCurrentStep}
				completedSteps={Array(documents.length)
					.fill(0)
					.map((_, index) => isCurrentStepComplete(index))}
			/>
      {currentStep !== 0 && <div className="flex w-5/12 bg-neutral-700" >
        <PDFViewer pdfUrl={currentPdfUrl} />
      </div>}
			<DocumentContent
				currentStep={currentStep}
				documents={documents}
				clientData={clientData}
				setClientData={setClientData}
				checkedItems={checkedItems}
				setCheckedItems={setCheckedItems}
				observations={observations}
				setObservations={setObservations}
				onReturnToClient={handleReturnToClient}
				onConcludeAnalysis={handleConcludeAnalysis}
				status={status}
				onStatusChange={setStatus}
			/>
		</div>
	);
}
