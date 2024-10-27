"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types/user";
import { Card } from "../ui/card";

interface UserTableProps {
	filters: {
		email: string;
		type: string;
	};
	onEdit: (user: User) => void;
}

export function UserTable({ filters, onEdit }: UserTableProps) {
	const [users, setUsers] = useState<User[]>([]); // Aqui você deve integrar com sua API

	const filteredUsers = users.filter((user) => {
		const emailMatch = user.email
			.toLowerCase()
			.includes(filters.email.toLowerCase());
		const typeMatch = !filters.type || user.type === filters.type;
		return emailMatch && typeMatch;
	});

	return (
		<Card className="min-h-[500px]">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Email</TableHead>
						<TableHead>Tipo</TableHead>
						<TableHead>Data de Criação</TableHead>
						<TableHead>Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredUsers.length === 0 ? (
						<TableRow>
							<TableCell colSpan={4} className="h-[400px] text-center">
								<div className="flex flex-col items-center justify-center space-y-2">
									<p className="text-muted-foreground text-lg">Nenhum usuário encontrado</p>
									<p className="text-sm text-muted-foreground">
										{users.length === 0 
											? "Não há usuários cadastrados no sistema"
											: "Nenhum usuário corresponde aos filtros aplicados"}
									</p>
								</div>
							</TableCell>
						</TableRow>
					) : (
						filteredUsers.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.type}</TableCell>
								<TableCell>{formatDate(user.createdAt)}</TableCell>
								<TableCell className="space-x-2">
									<Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
										<Edit2 className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											// Implementar lógica de exclusão
										}}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</Card>
	);
}
