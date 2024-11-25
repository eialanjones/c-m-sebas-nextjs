"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UserDialog } from "@/components/Usuarios/user-dialog";
import { UserTable } from "@/components/Usuarios/user-table";
import { Plus } from "lucide-react";
import type { User } from "@/types/user";

export default function UsersPage() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [filters, setFilters] = useState({
		email: "",
		type: "ALL", // Alterado de "" para "ALL"
	});

	return (
		<div className="p-1 md:p-6 space-y-6 w-full">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Usuários</h1>
				<Button onClick={() => setIsDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Novo Usuário
				</Button>
			</div>

			<div className="flex gap-4">
				<Input
					placeholder="Filtrar por email"
					value={filters.email}
					onChange={(e) => setFilters({ ...filters, email: e.target.value })}
					className="max-w-xs"
				/>
				<Select
					value={filters.type}
					onValueChange={(value) => setFilters({ ...filters, type: value })}
				>
					<SelectTrigger className="max-w-xs">
						<SelectValue placeholder="Filtrar por tipo" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">Todos</SelectItem>
						<SelectItem value="ADMIN">Administrador</SelectItem>
						<SelectItem value="HEALTH_PROMOTION">Promoção de Saúde</SelectItem>
						<SelectItem value="SUS">SUS</SelectItem>
						<SelectItem value="ASSISTANCE">Assistência</SelectItem>
						<SelectItem value="ILPI">ILPI</SelectItem>
						<SelectItem value="CT">CT</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<UserTable
				filters={filters}
				onEdit={(user) => {
					setSelectedUser(user);
					setIsDialogOpen(true);
				}}
			/>

			<UserDialog
				open={isDialogOpen}
				user={selectedUser}
				onOpenChange={(open) => {
					setIsDialogOpen(open);
					if (!open) setSelectedUser(null);
				}}
			/>
		</div>
	);
}
