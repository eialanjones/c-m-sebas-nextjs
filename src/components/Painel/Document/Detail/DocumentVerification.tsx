"use client";

import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Document } from "./DocumentsDetails";

interface DocumentVerificationProps {
	currentDocument: Document;
	checkedItems: Record<string, boolean>;
	observation: string;
	onCheckChange: (item: string, checked: boolean) => void;
	onObservationChange: (value: string) => void;
	onDownload: () => void;
}

export function DocumentVerification({
	currentDocument,
	checkedItems,
	observation,
	onCheckChange,
	onObservationChange,
	onDownload,
}: DocumentVerificationProps) {
	return (
		<div className="my-4 space-y-4 pr-4">
			<FileText className="mb-2 h-12 w-12" />

			<Button variant="outline" onClick={onDownload} className="mb-4">
				<Download className="mr-2 h-4 w-4" />
				Baixar Documento
			</Button>

			<p>Por favor, verifique se o documento está válido:</p>

			{currentDocument.checkItems.map((item) => (
				<div key={item} className="mb-2 flex items-center space-x-2">
					<Checkbox
						id={item}
						checked={checkedItems[item] || false}
						onCheckedChange={(checked) =>
							onCheckChange(item, checked as boolean)
						}
					/>
					<Label htmlFor={item}>{item}</Label>
				</div>
			))}

			<div className="mt-4 space-y-2">
				<Label htmlFor="observations">Observações</Label>
				<Textarea
					id="observations"
					value={observation}
					onChange={(e) => onObservationChange(e.target.value)}
					placeholder="Insira suas observações aqui..."
				/>
			</div>
		</div>
	);
}
