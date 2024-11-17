"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { User } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
	email: z.string().email("Email inválido"),
	password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
	type: z.enum(["ADMIN", "HEALTH_PROMOTION", "SUS", "ASSISTANCE", "ILPI", "CT"]),
});

interface UserDialogProps {
	user?: User | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function UserDialog({ user, open, onOpenChange }: UserDialogProps) {
	const { createUser, updateUser } = useUsers()
	const { toast } = useToast()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: user?.email ?? "",
			password: "",
			type: user?.userType ?? "ADMIN",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			if (user) {
				await updateUser(user.id, {
					email: values.email,
					password: values.password || undefined, // Only send if password was changed
					userType: values.type
				})
				toast({
					title: "Usuário atualizado",
					description: "O usuário foi atualizado com sucesso.",
				})
			} else {
				await createUser({
					email: values.email,
					password: values.password,
					userType: values.type
				})
				toast({
					title: "Usuário criado",
					description: "O usuário foi criado com sucesso.",
				})
			}
			onOpenChange(false)
		} catch (error) {
			toast({
				title: "Erro",
				description: "Ocorreu um erro ao salvar o usuário.",
				variant: "destructive",
			})
			console.error(error)
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{user ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} type="email" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Senha</FormLabel>
									<FormControl>
										<Input {...field} type="password" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tipo</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Selecione um tipo" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="ADMIN">Administrador</SelectItem>
											<SelectItem value="HEALTH_PROMOTION">Promoção de Saúde</SelectItem>
											<SelectItem value="SUS">SUS</SelectItem>
											<SelectItem value="ASSISTANCE">Assistência</SelectItem>
											<SelectItem value="ILPI">ILPI</SelectItem>
											<SelectItem value="CT">CT</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancelar
							</Button>
							<Button type="submit">{user ? "Salvar" : "Criar"}</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
