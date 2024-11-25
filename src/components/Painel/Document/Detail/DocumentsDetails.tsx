"use client";

export type ClientData = ClientDataField[];

export interface ClientDataField {
	name: string;
	value: string;
	description: string;
}

export interface Document {
	id: number;
	name: string;
	description: string;
	url: string;
	fileKey: string;
	observation: string;
	checklist?: {
		name: string;
		value: boolean;
		description: string;
	}[];
}

import { useEffect, useState } from "react";
import { DocumentProgress } from "./DocumentProgress";
import {
	ModelCebasAssistencia,
	ModelCebasCts,
	ModelCebasIlpi,
	ModelCebasSaude60Sus,
	ModelCebasSaudePromocaoASaude,
} from "./data";
import { DocumentContent } from "./DocumentContent";
import { PDFViewer } from "./PDFViewer";
import type { Customer } from "@/types/customer";
import type { DOCUMENT_STATUS } from "../../DocumentTable";

interface DocumentViewerProps {
	customer?: Customer;
}

export default function DocumentViewer({ customer }: DocumentViewerProps) {
	const [documents, setDocuments] = useState<Document[]>([]);
	const documentType: string = "saude-promocao";
	const [currentPdfUrl, setCurrentPdfUrl] = useState<string>("");

	// Move checkedItems state after documents are set
	const [checkedItems, setCheckedItems] = useState<
		Record<number, Record<string, boolean>>
	>({});

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
			Object.fromEntries(selectedDocuments.map((_, index) => [index, {}])),
		);
	}, []);

	const [currentStep, setCurrentStep] = useState(0);
	const [clientData, setClientData] = useState<ClientData>(customer?.data ?? []);
	const [observations, setObservations] = useState<string[]>(
		Array(documents.length).fill(""),
	);

	const [status, setStatus] = useState<DOCUMENT_STATUS | CUSTOMER_DATA_STATUS>(
		(customer?.data?.find(field => field.name === 'status')?.value as DOCUMENT_STATUS | CUSTOMER_DATA_STATUS) || 
		CUSTOMER_DATA_STATUS.WAITING_SUBMISSION
	);

	// Add new function to check if current step is complete
	const isCurrentStepComplete = (step: number): boolean => {
		if (step === 0) return true; // First step (client data) is always valid

		const currentDocument = documents[step];
		const currentCheckedItems = checkedItems[step];

		return (
			currentDocument?.checklist?.every(
				(item) => currentCheckedItems?.[item.name] === true,
			) || false
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
			{currentStep !== 0 && (
				<div className="flex md:w-6/12 bg-neutral-700">
					<PDFViewer pdfUrl={currentPdfUrl} />
				</div>
			)}
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

export enum CUSTOMER_DATA_STATUS {
	WAITING_SUBMISSION = 'WAITING_SUBMISSION',
	PENDING_ANALYSIS = 'PENDING_ANALYSIS',
	WAITING_CORRECTION = 'WAITING_CORRECTION',
	VALIDATED = 'VALIDATED'
  }
  
  export const CUSTOMER_DATA_STATUS_METADATA = {
	[CUSTOMER_DATA_STATUS.WAITING_SUBMISSION]: {
	  description: 'Aguardando Envio',
	  longDescription: 'Dados ainda não foram enviados pelo cliente',
	},
	[CUSTOMER_DATA_STATUS.PENDING_ANALYSIS]: {
	  description: 'Pendente de Análise',
	  longDescription: 'Dados enviados e aguardando análise técnica',
	},
	[CUSTOMER_DATA_STATUS.WAITING_CORRECTION]: {
	  description: 'Aguardando Correção',
	  longDescription: 'Dados analisados e necessitam de correções',
	},
	[CUSTOMER_DATA_STATUS.VALIDATED]: {
	  description: 'Validado',
	  longDescription: 'Dados analisados e validados',
	}
  } as const;