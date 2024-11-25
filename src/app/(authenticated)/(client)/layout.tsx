import { AppSidebar } from "@/components/Common/NavBar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider className="flex-col md:flex-row">
			<AppSidebar type="client" />
			{children}
		</SidebarProvider>
	);
}
