"use client";

import { useEffect, useState } from "react";
import { DocumentProgress } from "../Detail/DocumentProgress";
import { ClientUploadContent } from "./ClientUploadContent";
import type { Document, ClientData } from "../Detail/DocumentsDetails";
import { baseFetch } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import type { CustomerBase } from "@/types/customer_base";

export default function ClientDocumentUpload() {
	const [documents, setDocuments] = useState<Document[]>([]);
	const [customerBase, setCustomerBase] = useState<CustomerBase | null>(null);
	const { data: session } = useSession();
	const { toast } = useToast();
	
	const [uploadedFiles, setUploadedFiles] = useState<Record<number, File[]>>({});
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

	// Add this computed value for completedSteps
	const completedSteps = documents.map((doc) => {
		if (currentStep === 0) return true; // First step (client data) is always considered complete
		return uploadedFiles[doc.id]?.length > 0; // Check if there are uploaded files for this document
	});

	// Fetch the appropriate customer base based on user type
	useEffect(() => {
		const fetchCustomerBase = async () => {
			try {
				const bases = await baseFetch('/customer-bases');
				const userTypeMap: Record<string, string> = {
					'HEALTH_PROMOTION': 'saude-promocao',
					'SUS': 'saude-60sus',
					'ASSISTANCE': 'assistencia',
					'ILPI': 'ilpi',
					'CT': 'cts'
				};
				
				const baseType = userTypeMap[session?.user?.userType || ''];
				const matchingBase = bases.find((base: CustomerBase) => base.name === baseType);
				
				if (matchingBase) {
					setCustomerBase(matchingBase);
					setDocuments(matchingBase.structure.documents);
				}
			} catch (error) {
				console.error('Error fetching customer base:', error);
				toast({
					title: "Erro",
					description: "Não foi possível carregar a estrutura de documentos.",
					variant: "destructive",
				});
			}
		};

		if (session?.user) {
			fetchCustomerBase();
		}
	}, [session?.user, toast]);

	const handleFileUpload = (files: FileList | null, documentId: number) => {
		if (!files) return;

		setUploadedFiles((prev) => ({
			...prev,
			[documentId]: Array.from(files),
		}));
	};

	const handleSubmit = async () => {
		try {
			if (!customerBase) {
				throw new Error("Base de cliente não carregada");
			}

			const formData = new FormData();
			
			// Add client data
			formData.append('data', JSON.stringify(clientData));
			formData.append('baseId', customerBase.id.toString());
			
			// Add documents
			for (const [documentId, files] of Object.entries(uploadedFiles)) {
				for (const file of files) {
					formData.append(`documents[${documentId}]`, file);
				}
			}

			const response = await fetch('/api/customers', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Falha ao enviar os dados');
			}

			toast({
				title: "Sucesso",
				description: "Documentos enviados com sucesso!",
			});
		} catch (error) {
			console.error('Error submitting customer data:', error);
			toast({
				title: "Erro",
				description: "Falha ao enviar os documentos. Tente novamente.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex h-full">
			<DocumentProgress
				documents={documents}
				currentStep={currentStep}
				onStepChange={setCurrentStep}
				completedSteps={completedSteps}
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
