"use client";

import { useEffect, useState } from "react";
import { DocumentProgress } from "../Detail/DocumentProgress";
import { ClientUploadContent } from "./ClientUploadContent";
import {
	ModelCebasAssistencia,
	ModelCebasCts,
	ModelCebasIlpi,
	ModelCebasSaude60Sus,
	ModelCebasSaudePromocaoASaude,
} from "../Detail/data";
import type { Document, ClientData } from "../Detail/DocumentsDetails";

export default function ClientDocumentUpload() {
	const [documents, setDocuments] = useState<Document[]>([]);
	const documentType: string = "saude-promocao"; // Isso poderia vir de um contexto ou prop
	const [uploadedFiles, setUploadedFiles] = useState<Record<number, File[]>>(
		{},
	);
	const [currentStep, setCurrentStep] = useState(0);

	const [clientData, setClientData] = useState<ClientData>({
		nomeCliente: "",
		cnpj: "",
		email: "",
		responsavel: "",
		siscebas: {
			login: "",
			senha: "",
		},
		numeroCNES: "",
	});

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
	}, []);

	const handleFileUpload = (files: FileList | null, documentId: number) => {
		if (!files) return;

		setUploadedFiles((prev) => ({
			...prev,
			[documentId]: Array.from(files),
		}));
	};

	const handleSubmit = async () => {
		// Aqui você implementaria a lógica para enviar os arquivos ao servidor
		console.log("Enviando arquivos:", uploadedFiles);
		console.log("Dados do cliente:", clientData);
	};

	return (
		<div className="flex h-full">
			<DocumentProgress
				documents={documents}
				currentStep={currentStep}
				onStepChange={setCurrentStep}
			/>
			<ClientUploadContent
				currentStep={currentStep}
				currentDocument={documents[currentStep]}
				clientData={clientData}
				setClientData={setClientData}
				onFileUpload={handleFileUpload}
				uploadedFiles={uploadedFiles[documents[currentStep]?.id] || []}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
