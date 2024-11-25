"use client";

import { Dot, File, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/utils/uploadthing";
import type { ClientUploadedFileData } from "uploadthing/types";
import { PDFViewer } from "../Detail/PDFViewer";
import type { Document } from "../Detail/DocumentsDetails";

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

	return (
		<div className="space-y-4 overflow-auto">
			{(checkItems.length > 0 && !clientSide) && (
				<div className="mb-4">
					<h3 className="font-medium mb-2">Requisitos do documento:</h3>
					<ul className="list-disc list-inside space-y-1">
						{checkItems.map((item) => (
							<li key={item.name} className="text-sm text-gray-600">
								{item.description}
							</li>
						))}
					</ul>
				</div>
			)}

			{uploadedFiles?.[0]?.observation?.length > 0 && (
				<div className="flex justify-start h-full mb-4">
					<p className="text-sm text-red-600 flex items-center">
						<Dot className="mr-2" color="red" /> {uploadedFiles?.[0]?.observation}
					</p>
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
