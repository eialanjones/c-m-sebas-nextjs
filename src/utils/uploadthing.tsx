import {
	generateUploadButton,
	generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

const BuildUploadButton = generateUploadButton<OurFileRouter>();
const BuildUploadDropzone = generateUploadDropzone<OurFileRouter>();

type UploadButtonProps = Parameters<typeof BuildUploadButton>[0];
type UploadDropzoneProps = Parameters<typeof BuildUploadDropzone>[0];

export const UploadButton = ({
	onClientUploadComplete,
	onUploadError,
	endpoint,
}: UploadButtonProps) => (
	<BuildUploadButton
		onClientUploadComplete={onClientUploadComplete}
		onUploadError={onUploadError}
		endpoint={endpoint}
		className="ut-button:bg-primary-500 border-none"
		content={{
			button: ({ ready, isUploading }) => {
				if (!ready) return "Preparando...";
				if (isUploading) return "Enviando...";
				return "Enviar arquivo";
			},
			allowedContent: ({ ready, isUploading }) => {
				if (!ready) return "Verificando tipos de arquivo permitidos...";
				if (isUploading) return "Enviando arquivo...";
				return null;
			},
		}}
	/>
);

export const UploadDropzone = ({
	endpoint,
	onClientUploadComplete,
	onUploadError,
}: UploadDropzoneProps) => (
	<BuildUploadDropzone
		endpoint={endpoint}
		onClientUploadComplete={(res) => {
			onClientUploadComplete?.(res);
		}}
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onUploadError={(error: any) => {
			onUploadError?.(error);
		}}
		config={{
			mode: "auto",
		}}
    content={{
			label: () => "Clique ou arraste para fazer upload",
			button: ({ ready, isUploading }) => {
				if (!ready) return "Preparando...";
				if (isUploading) return "Enviando...";
				return "Enviar arquivo";
			},
			allowedContent: ({ ready, isUploading }) => {
				if (!ready) return "Verificando tipos de arquivo permitidos...";
				if (isUploading) return "Enviando arquivo...";
				return null;
			},
		}}
	/>
);
