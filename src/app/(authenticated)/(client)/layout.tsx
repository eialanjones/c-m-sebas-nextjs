import { AppSidebar } from "@/components/Common/NavBar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar type="client" />
			{children}
		</SidebarProvider>
	);
}
