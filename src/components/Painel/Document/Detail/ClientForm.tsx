"use client";

import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClientData } from "./DocumentsDetails";
import { Textarea } from "@/components/ui/textarea";
import type { Customer } from "@/types/customer";

interface ClientFormProps {
	clientData: ClientData;
	setClientData: Dispatch<SetStateAction<ClientData>>;
	customer?: Customer;
	onObservationChange: (value: string) => void;
}

export function ClientForm({ clientData, setClientData, customer, onObservationChange }: ClientFormProps) {
	const handleChange = (fieldName: string, value: string) => {
		setClientData((prev) => prev.map((field) =>
			field.name === fieldName ? { ...field, value } : field
		));
	};

	return (
		<div id="client-form" className="my-4 space-y-4 pr-0">
			{clientData?.map((field) => (
				<div key={field.name} className="space-y-2">
					<Label htmlFor={field.name}>{field.description}</Label>
					<Input
						id={field.name}
						value={field.value}
						type={field.name.includes("senha") ? "password" : "text"}
						onChange={(e) => handleChange(field.name, e.target.value)}
					/>
				</div>
			))}
			<div className="mt-4 space-y-2">
				<Label htmlFor="observations">Observações</Label>
				<Textarea
					id="observations"
					value={customer?.dataObservation}
					onChange={(e) => onObservationChange(e.target.value)}
					placeholder="Insira suas observações aqui..."
				/>
			</div>
		</div>
	);
}
