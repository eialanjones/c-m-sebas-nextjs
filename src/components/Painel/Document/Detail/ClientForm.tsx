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
	const handleChange = (field: string, value: string) => {
		if (field.includes(".")) {
			const [parent, child] = field.split(".");
			setClientData((prev) => {
				const parentKey = parent as keyof ClientData;
				return {
					...prev,
					[parent]: { ...(prev[parentKey] as Record<string, string>), [child]: value }
				};
			});
		} else {
			setClientData((prev) => ({ ...prev, [field]: value }));
		}
	};

	return (
		<div className="my-4 space-y-4 pr-0">
			<div className="space-y-2">
				<Label htmlFor="nomeCliente">NOME CLIENTE</Label>
				<Input
					id="nomeCliente"
					value={clientData.nomeCliente}
					onChange={(e) => handleChange("nomeCliente", e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="cnpj">CNPJ (Cnae SAÚDE)</Label>
				<Input
					id="cnpj"
					value={clientData.cnpj}
					onChange={(e) => handleChange("cnpj", e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">EMAIL</Label>
				<Input
					id="email"
					type="email"
					value={clientData.email}
					onChange={(e) => handleChange("email", e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="responsavel">RESPONSÁVEL</Label>
				<Input
					id="responsavel"
					value={clientData.responsavel}
					onChange={(e) => handleChange("responsavel", e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="siscebas-login">SISCEBAS (login)</Label>
				<Input
					id="siscebas-login"
					value={clientData.siscebas.login}
					onChange={(e) => handleChange("siscebas.login", e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="siscebas-senha">SISCEBAS (senha)</Label>
				<Input
					id="siscebas-senha"
					type="password"
					value={clientData.siscebas.senha}
					onChange={(e) => handleChange("siscebas.senha", e.target.value)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="numeroCNES">NÚMERO DO CNES</Label>
				<Input
					id="numeroCNES"
					value={clientData.numeroCNES}
					onChange={(e) => handleChange("numeroCNES", e.target.value)}
				/>
			</div>
		</div>
	);
}
