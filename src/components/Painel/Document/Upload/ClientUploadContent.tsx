"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ClientForm } from "../Detail/ClientForm";
import { FileUpload } from "./FileUpload";
import type { Document, ClientData } from "../Detail/DocumentsDetails";
import type { Dispatch, SetStateAction } from "react";
import type { ClientUploadedFileData } from "uploadthing/types";
import type { Customer } from "@/types/customer";
import { TutorialContent } from "../Detail/TutorialContent";

interface ClientUploadContentProps {
	currentStep: number;
	currentDocument: Document;
	clientData: ClientData;
	setClientData: Dispatch<SetStateAction<ClientData>>;
	onFileUpload: (files: ClientUploadedFileData<{ uploadedBy: string; }>[]) => void;
	uploadedFiles: Document[];
	onRemoveFile: (file: Document) => void;
	onSubmit: () => void;
	customer?: Customer;
}

export function ClientUploadContent({
	currentStep,
	currentDocument,
	clientData,
	setClientData,
	onFileUpload,
	uploadedFiles,
	onRemoveFile,
	onSubmit,
	customer,
}: ClientUploadContentProps) {
	return (
		<div className="flex w-full md:w-6/12 flex-col p-4 pr-0">
			<header className="mb-4">
				<h2 className="text-lg font-semibold">
					{currentStep === 0
						? "Seus Dados"
						: `Upload - ${currentDocument?.description}`}
				</h2>
			</header>

			<ScrollArea className="flex-grow">
				{currentStep === 0 ? (
					<TutorialContent />
				) : currentStep === 1 ? (
					<ClientForm clientData={clientData} setClientData={setClientData} />
				) : (
					<FileUpload
						onFileUpload={onFileUpload}
						uploadedFiles={uploadedFiles}
						onRemoveFile={onRemoveFile}
						checkItems={currentDocument?.checklist || []}
						clientSide={true}
					/>
				)}
			</ScrollArea>

			<Separator className="my-4" />

			<footer className="flex justify-end space-x-2">
				<Button onClick={onSubmit}>
					{currentStep === (customer?.documents?.length ?? 1) - 1 ? "Finalizar Envio" : "Salvar"}
				</Button>
			</footer>
		</div>
	);
}
