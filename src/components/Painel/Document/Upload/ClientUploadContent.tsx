"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ClientForm } from "../Detail/ClientForm";
import { FileUpload } from "./FileUpload";
import type { Document, ClientData } from "../Detail/DocumentsDetails";
import { useState, type Dispatch, type SetStateAction } from "react";

interface ClientUploadContentProps {
	currentStep: number;
	currentDocument: Document;
	clientData: ClientData;
	setClientData: Dispatch<SetStateAction<ClientData>>;
	onFileUpload: (files: FileList | null, documentId: number) => void;
	uploadedFiles: File[];
	onSubmit: () => void;
}

export function ClientUploadContent({
	currentStep,
	currentDocument,
	clientData,
	setClientData,
	onFileUpload,
	uploadedFiles,
	onSubmit,
}: ClientUploadContentProps) {
  const [documents, setDocuments] = useState<Document[]>([]);

	return (
		<div className="flex w-9/12 flex-col p-4 pr-0">
			<header className="mb-4">
				<h2 className="text-lg font-semibold">
					{currentStep === 0
						? "Seus Dados"
						: `Upload - ${currentDocument?.name}`}
				</h2>
			</header>

			<ScrollArea className="flex-grow">
				{currentStep === 0 ? (
					<ClientForm clientData={clientData} setClientData={setClientData} />
				) : (
					<FileUpload
						documentId={currentDocument?.id}
						onFileUpload={onFileUpload}
						uploadedFiles={uploadedFiles}
						checkItems={currentDocument?.checkItems || []}
					/>
				)}
			</ScrollArea>

			<Separator className="my-4" />

			<footer className="flex justify-end space-x-2">
				<Button onClick={onSubmit}>
					{currentStep === documents.length - 1 ? "Finalizar Envio" : "Salvar"}
				</Button>
			</footer>
		</div>
	);
}
