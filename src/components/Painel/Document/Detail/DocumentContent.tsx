"use client";

import type { Dispatch, SetStateAction } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ClientForm } from "./ClientForm";
import { DocumentVerification } from "./DocumentVerification";
import type { ClientData, CUSTOMER_DATA_STATUS, Document } from "./DocumentsDetails";
import { DOCUMENT_STATUS } from "../../DocumentTable";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DocumentContentProps {
	currentStep: number;
	documents: Document[];
	clientData: ClientData;
	setClientData: Dispatch<SetStateAction<ClientData>>;
	checkedItems: Record<number, Record<string, boolean>>;
	setCheckedItems: Dispatch<
		SetStateAction<Record<number, Record<string, boolean>>>
	>;
	observations: string[];
	setObservations: Dispatch<SetStateAction<string[]>>;
	onReturnToClient: () => void;
	onConcludeAnalysis: () => void;
	status: DOCUMENT_STATUS | CUSTOMER_DATA_STATUS;
	onStatusChange: (status: DOCUMENT_STATUS | CUSTOMER_DATA_STATUS) => void;
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
	onReturnToClient,
	onConcludeAnalysis,
	status,
	onStatusChange,
}: DocumentContentProps) {
	const handleDownload = () => {
		console.log("Baixando documento:", documents[currentStep]?.name);
	};

	const renderActionButtons = () => {
		const allChecked = Object.values(checkedItems[currentStep] || {}).every(
			(value) => value === true
		);

		switch (status) {
			case DOCUMENT_STATUS.PENDING_DOCUMENTS:
				return (
					<>
						<Button variant="outline" onClick={onReturnToClient}>
							Solicitar Ajustes
						</Button>
						<Button onClick={onConcludeAnalysis}>Analisar</Button>
					</>
				);

			case DOCUMENT_STATUS.PENDING_ANALYSIS:
				return (
					<>
						<Button variant="outline" onClick={onReturnToClient}>
							Solicitar Ajustes
						</Button>
						<Button 
							onClick={onConcludeAnalysis} 
							disabled={!allChecked}
							title={!allChecked ? "Complete todos os itens antes de concluir" : ""}
						>
							Concluir Análise
						</Button>
					</>
				);

			case DOCUMENT_STATUS.PENDING_CORRECTION:
				return (
					<Button variant="outline" onClick={onReturnToClient}>
						Solicitar Ajustes
					</Button>
				);

			case DOCUMENT_STATUS.PENDING_PROTOCOL:
				return (
					<Button onClick={onConcludeAnalysis}>
						Protocolar
					</Button>
				);

			default:
				return null;
		}
	};

	return (
		<div className={`flex ${currentStep === 0 ? 'md:w-6/12' : 'md:w-4/12'} flex-col p-4 pr-0 w-full`}>
			<header className="mb-4">
				<h2 className="text-lg font-semibold">
					Verificar {documents[currentStep]?.name}
				</h2>
			</header>

			<ScrollArea className="flex-grow">
				{currentStep === 0 ? (
					<ClientForm clientData={clientData} setClientData={setClientData} />
					) : (
					<DocumentVerification
						currentDocument={documents[currentStep]}
						checkedItems={checkedItems[currentStep]}
						observation={observations[currentStep]}
						onCheckChange={(item: string, checked: boolean) => {
							setCheckedItems((prev) => ({
								...prev,
								[currentStep]: { ...prev[currentStep], [item]: checked },
							}));
						}}
						onObservationChange={(value: string) => {
							setObservations((prev) => {
								const newObservations = [...prev];
								newObservations[currentStep] = value;
								return newObservations;
							});
						}}
						onDownload={handleDownload}
					/>
				)}
			</ScrollArea>

			<Separator className="my-4" />

			<footer className="flex flex-col items-stretch sm:flex-row sm:justify-between">
				<div className="mb-2 flex-1 sm:mb-0">
					<Select value={status} onValueChange={onStatusChange}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Selecione o status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Documentos Pendentes">Documentos Pendentes</SelectItem>
							<SelectItem value="Pendente de Analise">Pendente de Analise</SelectItem>
							<SelectItem value="Aguardando Correção">Aguardando Correção</SelectItem>
							<SelectItem value="Pendente de Protocolo">Pendente de Protocolo</SelectItem>
							<SelectItem value="Protocolado Deferido">Protocolado Deferido</SelectItem>
							<SelectItem value="Protocolado Indeferido">Protocolado Indeferido</SelectItem>
							<SelectItem value="Protocolado Recursal">Protocolado Recursal</SelectItem>
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
