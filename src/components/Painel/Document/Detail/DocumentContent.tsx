"use client";

import type { Dispatch, SetStateAction } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ClientForm } from "./ClientForm";
import { DocumentVerification } from "./DocumentVerification";
import {
	type Checklist,
	type ClientData,
	CUSTOMER_DATA_STATUS,
	type Document,
} from "./DocumentsDetails";
import { DOCUMENT_STATUS } from "../../DocumentTable";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Customer } from "@/types/customer";

interface DocumentContentProps {
	currentStep: number;
	documents: Document[];
	customer?: Customer;
	clientData: ClientData;
	setClientData: Dispatch<SetStateAction<ClientData>>;
	checkedItems: Checklist[];
	setCheckedItems: (item: Checklist, checked: boolean) => Promise<void>;
	observations: string;
	setObservations: Dispatch<SetStateAction<string>>;
	status: DOCUMENT_STATUS | CUSTOMER_DATA_STATUS;
	onStatusChange: (status: DOCUMENT_STATUS | CUSTOMER_DATA_STATUS, document?: Document) => void;
}

export function DocumentContent({
	currentStep,
	documents,
	clientData,
	setClientData,
	checkedItems,
	setCheckedItems,
	observations,
	setObservations,
	status,
	onStatusChange,
	customer,
}: DocumentContentProps) {
	const handleDownload = async () => {
		const documento = documents[currentStep];
		if (documento?.url) {
			try {
				// Fetch the file
				const response = await fetch(documento.url);
				const blob = await response.blob();
				
				// Create a blob URL
				const blobUrl = window.URL.createObjectURL(blob);
				
				// Create and trigger download
				const link = document.createElement('a');
				link.href = blobUrl;
				link.download = documento.name || 'document';
				document.body.appendChild(link);
				link.click();
				
				// Cleanup
				document.body.removeChild(link);
				window.URL.revokeObjectURL(blobUrl);
			} catch (error) {
				console.error('Error downloading file:', error);
			}
		} else {
			console.warn('Document URL not available for:', documento?.name);
		}
	};

	const renderActionButtons = () => {
		const allChecked = Object.values(checkedItems[currentStep] || {}).every(
			(value) => value === true,
		);

		switch (status) {
			case DOCUMENT_STATUS.PENDING_DOCUMENTS:
				return (
					<>
						<Button variant="outline" onClick={() => onStatusChange(DOCUMENT_STATUS.PENDING_CORRECTION, documents[currentStep])}>
							Solicitar Ajustes
						</Button>
						<Button onClick={() => onStatusChange(DOCUMENT_STATUS.PENDING_ANALYSIS, documents[currentStep])}>Analisar</Button>
					</>
				);

			case DOCUMENT_STATUS.PENDING_ANALYSIS:
				return (
					<>
						<Button variant="outline" onClick={() => onStatusChange(DOCUMENT_STATUS.PENDING_CORRECTION, documents[currentStep])}>
							Solicitar Ajustes
						</Button>
						<Button
							onClick={() => onStatusChange(DOCUMENT_STATUS.PENDING_PROTOCOL, documents[currentStep])}
							disabled={!allChecked}
							title={
								!allChecked ? "Complete todos os itens antes de concluir" : ""
							}
						>
							Concluir Análise
						</Button>
					</>
				);

			case DOCUMENT_STATUS.PENDING_CORRECTION:
			case CUSTOMER_DATA_STATUS.VALIDATED:
				return (
					<Button variant="outline" onClick={() => onStatusChange(DOCUMENT_STATUS.PENDING_CORRECTION, documents[currentStep])}>
						Solicitar Ajustes
					</Button>
				);

			case DOCUMENT_STATUS.PENDING_PROTOCOL:
				return <Button onClick={() => onStatusChange(DOCUMENT_STATUS.PROTOCOLED_PENDING, documents[currentStep])}>Protocolar</Button>;

			case DOCUMENT_STATUS.PROTOCOLED_PENDING:
			case DOCUMENT_STATUS.PROTOCOLED_APPROVED:
			case DOCUMENT_STATUS.PROTOCOLED_REJECTED:
			case DOCUMENT_STATUS.PROTOCOLED_APPEAL:
				return null;

			case CUSTOMER_DATA_STATUS.PENDING_SUBMISSION:
				return (
					<Button onClick={() => onStatusChange(DOCUMENT_STATUS.PENDING_ANALYSIS, documents[currentStep])}>Analisar</Button>
				);

			case CUSTOMER_DATA_STATUS.PENDING_ANALYSIS:
			case CUSTOMER_DATA_STATUS.PENDING_CORRECTION:
				return (
					<>
						<Button variant="outline" onClick={() => onStatusChange(DOCUMENT_STATUS.PENDING_CORRECTION, documents[currentStep])}>
							Solicitar Ajustes
						</Button>
						<Button onClick={() => onStatusChange(CUSTOMER_DATA_STATUS.VALIDATED, documents[currentStep])}>Validar</Button>
					</>
				);
			
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col w-full h-full">
			<header className="mb-4">
				<h2 className="text-lg font-semibold">
					Verificar {documents[currentStep]?.name}
				</h2>
			</header>

			<ScrollArea className="flex-1 min-h-0">
				{currentStep === 0 ? (
					<ClientForm clientData={clientData} setClientData={setClientData} customer={customer} onObservationChange={(value: string) => {
						setObservations(value);
					}} />
				) : (
					<DocumentVerification
						currentDocument={documents[currentStep]}
						checkedItems={checkedItems}
						observation={observations}
						onCheckChange={(item: Checklist, checked: boolean) => {
							setCheckedItems(item, checked);
						}}
						onObservationChange={(value: string) => {
							setObservations(value);
						}}
						onDownload={handleDownload}
					/>
				)}
			</ScrollArea>
			<Separator className="my-4" />
			
			<footer className="flex flex-col items-stretch sm:flex-row sm:justify-between mt-auto">
				<div className="mb-2 flex-1 sm:mb-0">
					<Select value={status} onValueChange={(value) => onStatusChange(value as DOCUMENT_STATUS | CUSTOMER_DATA_STATUS, documents[currentStep])}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Selecione o status" />
						</SelectTrigger>
						<SelectContent>
							{currentStep === 0 && (
								<>
									<SelectItem value={CUSTOMER_DATA_STATUS.PENDING_SUBMISSION}>
										Aguardando Envio
									</SelectItem>
									<SelectItem value={CUSTOMER_DATA_STATUS.PENDING_ANALYSIS}>
										Pendente de Análise
									</SelectItem>
									<SelectItem value={CUSTOMER_DATA_STATUS.PENDING_CORRECTION}>
										Aguardando Correção
									</SelectItem>
									<SelectItem value={CUSTOMER_DATA_STATUS.VALIDATED}>
										Validado
									</SelectItem>
								</>
							)}
							{currentStep !== 0 && <>
							<SelectItem value={DOCUMENT_STATUS.PENDING_DOCUMENTS}>
								Documentos Pendentes
							</SelectItem>
							<SelectItem value={DOCUMENT_STATUS.PENDING_ANALYSIS}>
								Pendente de Análise
							</SelectItem>
							<SelectItem value={DOCUMENT_STATUS.PENDING_CORRECTION}>
								Aguardando Correção
							</SelectItem>
							<SelectItem value={DOCUMENT_STATUS.PENDING_PROTOCOL}>
								Pendente de Protocolo
							</SelectItem>
							<SelectItem value={DOCUMENT_STATUS.PROTOCOLED_PENDING}>
								Protocolado Aguardando
							</SelectItem>
							<SelectItem value={DOCUMENT_STATUS.PROTOCOLED_APPROVED}>
								Protocolado Deferido
							</SelectItem>
							<SelectItem value={DOCUMENT_STATUS.PROTOCOLED_REJECTED}>
								Protocolado Indeferido
							</SelectItem>
							<SelectItem value={DOCUMENT_STATUS.PROTOCOLED_APPEAL}>
								Protocolado Recursal
							</SelectItem></>}
						</SelectContent>
					</Select>
				</div>
				<div className="flex justify-end space-x-2">
					{renderActionButtons()}
				</div>
			</footer>
		</div>
	);
}
