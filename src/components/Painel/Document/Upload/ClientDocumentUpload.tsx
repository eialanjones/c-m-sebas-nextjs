"use client";

import { useEffect, useState } from "react";
import { DocumentProgress } from "../Detail/DocumentProgress";
import { ClientUploadContent } from "./ClientUploadContent";
import type { Document, ClientData } from "../Detail/DocumentsDetails";
import { clientApi } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import type { ClientUploadedFileData } from "uploadthing/types";
import { useCustomer } from "@/hooks/useCustomer";

export default function ClientDocumentUpload() {
	const [documents, setDocuments] = useState<Document[]>([]);
	const [fileToDelete, setFileToDelete] = useState<Document | null>(null);
	const { data: session } = useSession();
	const { toast } = useToast();
	
	const [currentStep, setCurrentStep] = useState(0);

	const { customer, mutate } = useCustomer({userId: session?.user?.id ?? ''});

	const [clientData, setClientData] = useState<ClientData>(customer?.data ?? []);

	const completedSteps = documents.map((doc, index) => {
		if (index === 0 && customer?.data.every(field => field.value?.length > 0)) return true;
		return !!doc.url;
	});

	useEffect(() => {
		if(customer){
			setDocuments(customer.documents);
			setClientData(customer.data);
		}
	}, [customer]);

	const handleSubmit = async () => {
		try {
			const payload = {
				data: clientData,
				userId: session?.user?.id,
				documents: documents,
			};

			if (fileToDelete) {
				await clientApi.delete(`/customers/${customer?.id}/files/${fileToDelete.fileKey}`);
				setFileToDelete(null);
			}

			const response = await clientApi.patch(`/customers/${customer?.id}`, payload);
			mutate();
			if (response.status !== 200) {
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

	const onFileUpload = (files: ClientUploadedFileData<{ uploadedBy: string; }>[]) => {
		const newDocument: Document = {
			...documents[currentStep],
			url: files[0]?.url || '',
			fileKey: files[0]?.key || '',
		};
		
		setDocuments(prev => prev.map(doc => doc.name === documents[currentStep].name ? newDocument : doc));
	};

	const onRemoveFile = async (file: Document) => {
		try {
			setDocuments(prev => prev.map(doc => doc.name === file.name ? { ...doc, url: "", fileKey: "" } : doc));

			setFileToDelete(file);
		} catch (error) {
			toast({
				title: "Erro",
				description: "Falha ao remover o arquivo. Tente novamente.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="flex h-full viewbox">
			<DocumentProgress
				documents={[{
					id: 0,
					name: "Informações Iniciais",
					description: "Tutorial",
					url: "",
					fileKey: "",
					observation: "",
				}, ...documents]}
				currentStep={currentStep}
				onStepChange={setCurrentStep}
				completedSteps={completedSteps}
			/>
			<ClientUploadContent
				currentStep={currentStep}
				currentDocument={documents[currentStep]}
				clientData={clientData}
				setClientData={setClientData}
				onFileUpload={onFileUpload}
				uploadedFiles={documents.filter(doc => doc.name === documents[currentStep].name)}
				onSubmit={handleSubmit}
				onRemoveFile={onRemoveFile}
				customer={customer}
			/>
		</div>
	);
}
