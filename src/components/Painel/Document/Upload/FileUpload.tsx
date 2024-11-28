"use client";

import { Dot, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/utils/uploadthing";
import type { ClientUploadedFileData } from "uploadthing/types";
import { PDFViewer } from "../Detail/PDFViewer";
import type { Document } from "../Detail/DocumentsDetails";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
	onFileUpload: (files: ClientUploadedFileData<{ uploadedBy: string; }>[]) => void;
	uploadedFiles: Document[];
	checkItems: {name: string, value: boolean, description: string}[];
	onRemoveFile: (file: Document) => void;
	clientSide?: boolean;
}

export function FileUpload({
	onRemoveFile,
	uploadedFiles,
	onFileUpload,
	checkItems,
	clientSide = false,
}: FileUploadProps) {
	const pendingCorrections = checkItems.filter(item => !item.value);
	const hasCorrections = uploadedFiles?.[0]?.observation?.length > 0;

	return (
		<div className="space-y-4 overflow-auto">
			{hasCorrections && clientSide && (
				<div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
					<h3 className="font-medium text-red-800 mb-2">Correções necessárias:</h3>
					{uploadedFiles?.[0]?.observation && (
						<p className="text-sm text-red-600 mb-2">
							{uploadedFiles[0].observation}
						</p>
					)}
					{pendingCorrections.length > 0 && (
						<ul className="list-disc list-inside space-y-1">
							{pendingCorrections.map((item) => (
								<li key={item.name} className="text-sm text-red-600">
									{item.description}
								</li>
							))}
						</ul>
					)}
				</div>
			)}

			{!uploadedFiles?.[0]?.url && <UploadDropzone 
				endpoint="imageUploader"
				onClientUploadComplete={onFileUpload}
				/>}

			{uploadedFiles?.[0]?.url && (
				<div className="space-y-4">
					<div className="flex items-center justify-between rounded">
						<Button
							variant="destructive"
							size="sm"
							onClick={() => onRemoveFile(uploadedFiles[0])}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							<span className="text-sm">Remover arquivo</span>
						</Button>
					</div>

					<div className="h-[500px] bg-neutral-700 rounded-lg">
						<PDFViewer pdfUrl={uploadedFiles[0].url} />
					</div>
				</div>
			)}
		</div>
	);
}
