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
	checklist?: Checklist[];
}

export type Checklist = {
	name: string;
	value: boolean;
	description: string;
}

import { useEffect, useState, type SetStateAction } from "react";
import { DocumentProgress } from "./DocumentProgress";
import { DocumentContent } from "./DocumentContent";
import { PDFViewer } from "./PDFViewer";
import type { Customer } from "@/types/customer";
import type { DOCUMENT_STATUS } from "../../DocumentTable";
import { clientApi } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import type { KeyedMutator } from "swr";

interface DocumentViewerProps {
	customer?: Customer;
	mutate?: KeyedMutator<Customer>;
}

export default function DocumentViewer({ customer, mutate }: DocumentViewerProps) {
	const { toast } = useToast();

	// Move checkedItems state after documents are set
	const [checkedItems, setCheckedItems] = useState<Checklist[]>([]);

	const [currentStep, setCurrentStep] = useState(0);
	const [clientData, setClientData] = useState<ClientData>(customer?.data ?? []);
	const [observationsMap, setObservationsMap] = useState<Record<string, string>>(() => {
		// Initialize with existing observations from customer data
		const initialMap: Record<string, string> = {};
		if (customer?.dataObservation) {
			initialMap.clientData = customer.dataObservation;
		}
		for (const doc of customer?.documents ?? []) {
			if (doc.observation) {
				initialMap[doc.name] = doc.observation;
			}
		}
		return initialMap;
	});

	const [status, setStatus] = useState<DOCUMENT_STATUS | CUSTOMER_DATA_STATUS>(
		(customer?.dataStatus) || 
		CUSTOMER_DATA_STATUS.PENDING_SUBMISSION
	);

	// Add new function to check if current step is complete
	const isCurrentStepComplete = (step: number): boolean => {
		if (step === 0) return true; // First step (client data) is always valid

		const currentDocument = customer?.documents?.[step];
		return (
			currentDocument?.checklist?.every(
				(item) => item.value,
			) || false
		);
	};

	const handleStatusChange = async (status: CUSTOMER_DATA_STATUS | DOCUMENT_STATUS, document?: Document) => {
		setStatus(status);

		if(currentStep === 0) {
			await clientApi.patch(`/customers/${customer?.id}`, {
				dataStatus: status,
				dataObservation: observationsMap.clientData || '',
			});
		} else {
			await clientApi.patch(`/customers/${customer?.id}`, {
				status: status,
				documents: customer?.documents?.map((doc) => {
					if(doc.name === document?.name) {
						return {
							...doc,
							status: status,
							observation: observationsMap[doc.name] || '',
						};
					}
					// Mantém as observações dos outros documentos
					return {
						...doc,
						observation: observationsMap[doc.name] || doc.observation || '',
					};
				}),
			});
		}

		mutate?.();

		toast({
			title: "Sucesso",
			description: "Status alterado com sucesso",
		});
	};

	useEffect(() => {
		if(customer?.dataStatus && currentStep !== 0) {
			setStatus(customer.status as DOCUMENT_STATUS);
			
			setCheckedItems(customer?.documents?.[currentStep]?.checklist?.map((item) => ({
				...item,
				value: item.value,
			})) ?? []);

			// Inicializa o mapa de observações com todas as observações existentes
			const newObservationsMap: Record<string, string> = {};
			
			// Adiciona a observação dos dados do cliente
			if (customer.dataObservation) {
				newObservationsMap.clientData = customer.dataObservation;
			}
			
			// Adiciona as observações de cada documento
			customer.documents?.forEach((doc) => {
				if (doc.observation) {
					newObservationsMap[doc.name] = doc.observation;
				}
			});

			setObservationsMap(newObservationsMap);
		} else {
			setStatus(customer?.dataStatus || CUSTOMER_DATA_STATUS.PENDING_SUBMISSION);
		}
	}, [customer]);

	const handleCheckChange = async (item: Checklist, checked: boolean) => {
		setCheckedItems((prev) => {
			const exists = prev.some(prevItem => prevItem.name === item.name);
			if (exists) {
				return prev.map(prevItem => 
					prevItem.name === item.name ? {...item} : prevItem
				);
			}
			return [...prev, item];
		});
		await clientApi.patch(`/customers/${customer?.id}`, {
			documents: customer?.documents?.map((doc) => {
				if(doc.name === customer?.documents?.[currentStep]?.name) {
					return {
						...doc,
						checklist: doc.checklist?.map((_item) => _item.name === item.name ? { ..._item, value: checked } : _item),
					};
				}
				return doc;
			}),
		});

		mutate?.();

		toast({
			title: "Sucesso",
			description: "Item alterado com sucesso",
		});
	};

	return (
		<div className="flex h-full">
			<DocumentProgress
				documents={customer?.documents ?? []}
				currentStep={currentStep}
				onStepChange={setCurrentStep}
				completedSteps={Array(customer?.documents?.length ?? 0)
					.fill(0)
					.map((_, index) => isCurrentStepComplete(index))}
			/>
			<div className={'flex flex-col w-full flex-col p-4 pr-0 w-full self-start'}>
				<DocumentContent
					currentStep={currentStep}
					documents={customer?.documents ?? []}
					clientData={clientData}
					setClientData={setClientData}
					checkedItems={checkedItems}
					setCheckedItems={handleCheckChange}
					observations={currentStep === 0 ? observationsMap.clientData || '' : observationsMap[customer?.documents?.[currentStep]?.name || ''] || ''}
					setObservations={(value: SetStateAction<string>) => {
						const newValue = typeof value === 'function' ? value('') : value;
						setObservationsMap(prev => ({
							...prev,
							[currentStep === 0 ? 'clientData' : customer?.documents?.[currentStep]?.name || '']: newValue
						}));
					}}
					status={status}
					onStatusChange={handleStatusChange}
					customer={customer}
				/>
				{(currentStep !== 0 && customer?.documents?.[currentStep]?.url) && (
					<div className="flex w-full bg-neutral-700 mt-6 min-h-full">
						<PDFViewer pdfUrl={customer.documents[currentStep].url} />
					</div>
				)}
			</div>
		</div>
	);
}

export enum CUSTOMER_DATA_STATUS {
	PENDING_SUBMISSION = 'PENDING_SUBMISSION',
	PENDING_ANALYSIS = 'PENDING_ANALYSIS',
	PENDING_CORRECTION = 'PENDING_CORRECTION',
	VALIDATED = 'VALIDATED'
  }
  
  export const CUSTOMER_DATA_STATUS_METADATA = {
	[CUSTOMER_DATA_STATUS.PENDING_SUBMISSION]: {
	  description: 'Aguardando Envio',
	  longDescription: 'Dados ainda não foram enviados pelo cliente',
	},
	[CUSTOMER_DATA_STATUS.PENDING_ANALYSIS]: {
	  description: 'Pendente de Análise',
	  longDescription: 'Dados enviados e aguardando análise técnica',
	},
	[CUSTOMER_DATA_STATUS.PENDING_CORRECTION]: {
	  description: 'Aguardando Correção',
	  longDescription: 'Dados analisados e necessitam de correções',
	},
	[CUSTOMER_DATA_STATUS.VALIDATED]: {
	  description: 'Validado',
	  longDescription: 'Dados analisados e validados',
	}
  } as const;