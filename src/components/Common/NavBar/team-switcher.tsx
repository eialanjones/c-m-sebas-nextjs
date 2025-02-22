"use client";

import * as React from "react";
import { Command } from "lucide-react";

export function TeamSwitcher() {
	return (
		<div className="flex items-center gap-2">
			<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
				<Command className="size-4" />
			</div>
			<div className="grid flex-1 text-left text-sm leading-tight">
				<span className="truncate font-semibold">CEBAS</span>
				<span className="truncate text-xs">Empresa</span>
			</div>
		</div>
	);
}
