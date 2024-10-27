"use client";

import ClientDocumentUpload from "@/components/Painel/Document/Upload/ClientDocumentUpload";
import { SidebarInset } from "@/components/ui/sidebar";

export default function ClientProcessPage() {
	return (
		<SidebarInset>
			<div className="flex flex-1 flex-col gap-4 p-4">
				<ClientDocumentUpload />
			</div>
		</SidebarInset>
	);
}
