"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types/user";
import { Card } from "../ui/card";
import { useUsers } from "@/hooks/useUsers";
import { useState } from "react";
import { DeleteUserDialog } from "./delete-user-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";
import { ActivateUserDialog } from "./activate-user-dialog";

interface UserTableProps {
	filters: {
		email: string;
		type: string;
	};
	onEdit: (user: User) => void;
}

export function UserTable({ filters, onEdit }: UserTableProps) {
	const { users, isLoading, updateUser, mutate } = useUsers();
	const { toast } = useToast();
	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [userToActivate, setUserToActivate] = useState<User | null>(null);

	const filteredUsers = users?.filter((user) => {
		const emailMatch = user.email
			.toLowerCase()
			.includes(filters.email.toLowerCase());
		const typeMatch = filters.type === "ALL" || user.userType === filters.type;
		return emailMatch && typeMatch;
	}) ?? [];

	const handleDelete = async () => {
		if (!userToDelete) return;

		try {
			await updateUser(userToDelete.id, { active: false });
			await mutate(undefined, { revalidate: true });
			toast({
				title: "Usuário excluído",
				description: "O usuário foi excluído com sucesso.",
			});
		} catch (error) {
			toast({
				title: "Erro",
				description: "Ocorreu um erro ao excluir o usuário.",
				variant: "destructive",
			});
			console.error(error);
		} finally {
			setUserToDelete(null);
		}
	};

	const handleActivate = async () => {
		if (!userToActivate) return;

		try {
			await updateUser(userToActivate.id, { active: true });
			await mutate(undefined, { revalidate: true });
			toast({
				title: "Usuário ativado",
				description: "O usuário foi ativado com sucesso.",
			});
		} catch (error) {
			toast({
				title: "Erro",
				description: "Ocorreu um erro ao ativar o usuário.",
				variant: "destructive",
			});
			console.error(error);
		} finally {
			setUserToActivate(null);
		}
	};

	if (isLoading) {
		return (
			<Card className="min-h-[500px]">
				<div className="flex items-center justify-center h-[500px]">
					<p className="text-muted-foreground">Carregando usuários...</p>
				</div>
			</Card>
		);
	}

	return (
		<Card className="min-h-[500px]">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Email</TableHead>
						<TableHead>Tipo</TableHead>
						<TableHead>Data de Criação</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredUsers.length === 0 ? (
						<TableRow>
							<TableCell colSpan={4} className="h-[400px] text-center">
								<div className="flex flex-col items-center justify-center space-y-2">
									<p className="text-muted-foreground text-lg">
										Nenhum usuário encontrado
									</p>
									<p className="text-sm text-muted-foreground">
										{!users?.length
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
								<TableCell>{user.userType}</TableCell>
								<TableCell>{formatDate(user.createdAt)}</TableCell>
								<TableCell>
									<Badge variant={user.active ? "default" : "destructive"}>
										{user.active ? "Ativo" : "Inativo"}
									</Badge>
								</TableCell>
								<TableCell className="space-x-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onEdit(user)}
									>
										<Edit2 className="h-4 w-4" />
									</Button>
									{user.active ? (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setUserToDelete(user)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									) : (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setUserToActivate(user)}
										>
											<RefreshCw className="h-4 w-4" />
										</Button>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
			<DeleteUserDialog
				open={!!userToDelete}
				onOpenChange={(open) => !open && setUserToDelete(null)}
				onConfirm={handleDelete}
				userEmail={userToDelete?.email ?? ""}
			/>
			<ActivateUserDialog
				open={!!userToActivate}
				onOpenChange={(open) => !open && setUserToActivate(null)}
				onConfirm={handleActivate}
				userEmail={userToActivate?.email ?? ""}
			/>
		</Card>
	);
}
