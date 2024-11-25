"use client";

import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClientData } from "./DocumentsDetails";

interface ClientFormProps {
	clientData: ClientData;
	setClientData: Dispatch<SetStateAction<ClientData>>;
}

export function ClientForm({ clientData, setClientData }: ClientFormProps) {
	const handleChange = (fieldName: string, value: string) => {
		setClientData((prev) => prev.map((field) =>
			field.name === fieldName ? { ...field, value } : field
		));
	};

	return (
		<div id="client-form" className="my-4 space-y-4 pr-0">
			{clientData.map((field) => (
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
		</div>
	);
}
