"use client";

import { File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/utils/uploadthing";

interface FileUploadProps {
	documentId: number;
	onFileUpload: (files: FileList | null, documentId: number) => void;
	uploadedFiles: File[];
	checkItems: string[];
}

export function FileUpload({
	documentId,
	onFileUpload,
	uploadedFiles,
	checkItems,
}: FileUploadProps) {
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onFileUpload(e.target.files, documentId);
	};

	const removeFile = (fileName: string) => {
		const newFiles = uploadedFiles.filter((file) => file.name !== fileName);
		const dataTransfer = new DataTransfer();
		newFiles.forEach((file) => dataTransfer.items.add(file));
		onFileUpload(dataTransfer.files, documentId);
	};

	return (
		<div className="space-y-4">
			{checkItems.length > 0 && (
				<div className="mb-4">
					<h3 className="font-medium mb-2">Requisitos do documento:</h3>
					<ul className="list-disc list-inside space-y-1">
						{checkItems.map((item) => (
							<li key={item} className="text-sm text-gray-600">
								{item}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
				<input
					type="file"
					id={`file-upload-${documentId}`}
					className="hidden"
					multiple
					onChange={handleFileChange}
				/>
				<Label
					htmlFor={`file-upload-${documentId}`}
					className="cursor-pointer flex flex-col items-center"
				>
					<Upload className="h-12 w-12 text-gray-400" />
					<span className="mt-2 text-sm text-gray-600">
						Clique para fazer upload ou arraste seus arquivos
					</span>
				</Label>
			</div> */}
			<UploadDropzone 
				endpoint="imageUploader"
			/>

			{uploadedFiles.length > 0 && (
				<div className="mt-4 space-y-2">
					{uploadedFiles.map((file) => (
						<div
							key={file.name}
							className="flex items-center justify-between p-2 bg-gray-50 rounded"
						>
							<div className="flex items-center">
								<File className="h-4 w-4 mr-2" />
								<span className="text-sm">{file.name}</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => removeFile(file.name)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
