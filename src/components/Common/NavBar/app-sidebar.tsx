"use client";

import type * as React from "react";
import { useSession } from "next-auth/react";
import {
	AudioWaveform,
	Command,
	File,
	GalleryVerticalEnd,
	LayoutDashboard,
	ListCheck,
	User,
} from "lucide-react";

import { NavMain } from "@/components/Common/NavBar/nav-main";
import { NavUser } from "@/components/Common/NavBar/nav-user";
import { TeamSwitcher } from "@/components/Common/NavBar/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NavProjects } from "./nav-projects";

// This is sample data.
const data = {
	navMainClient: [
		{
			name: "Meus Documentos",
			url: "/documentos",
			icon: ListCheck,
			isActive: true,
		},
	],
	navMain: [
		{
			title: "Visão Geral",
			url: "/",
			icon: LayoutDashboard,
			isActive: true,
			items: [
				{
					title: "Painel",
					url: "/painel",
				},
			],
		},
		{
			title: "Usuários",
			url: "/usuarios",
			icon: User,
			isActive: true,
			items: [
				{
					title: "Usuários Cadastrados",
					url: "/usuarios",
				}
			],
		},
	],
};

export function AppSidebar({
	type = "system",
	...props
}: React.ComponentProps<typeof Sidebar> & { type: "client" | "system" }) {
	const { data: session } = useSession();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher />
			</SidebarHeader>
			<SidebarContent>
				{type === "system" && (
					<NavMain title="Administrativo" items={data.navMain} />
				)}
				{type === "client" && <NavProjects projects={data.navMainClient} />}
			</SidebarContent>
			<SidebarFooter>
				{session?.user && <NavUser user={session.user} />}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
