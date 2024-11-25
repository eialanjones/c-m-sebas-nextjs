"use client";

import DocumentViewer from "@/components/Painel/Document/Detail/DocumentsDetails";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { useCustomer } from "@/hooks/useCustomer";

export default function DocumentPage() {
	const { id } = useParams();
	const customerId = Array.isArray(id) ? id[0] : id;
	const { customer, isLoading, mutate } = useCustomer({customerId: customerId??''});

	if (isLoading) {
		return (
			<SidebarInset>
				<div className="flex h-screen items-center justify-center">
					<p className="text-muted-foreground">Carregando processo...</p>
				</div>
			</SidebarInset>
		);
	}

	return (
		<SidebarInset className="w-full">
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="/painel">Painel</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Processo</BreadcrumbPage>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>{customer?.data?.find(field => field.name === 'nomeCliente')?.value || id}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className="flex flex-1 flex-col gap-4 md:p-4 p-2">
				<DocumentViewer customer={customer} mutate={mutate}/>
			</div>
		</SidebarInset>
	);
}
