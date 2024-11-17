"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { data: session, status } = useSession()

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		const result = await signIn("credentials", {
			email: formData.get("email"),
			password: formData.get("password"),
			redirect: false,
		});

		setIsLoading(false);

		if (result?.error) {
			setError("Credenciais inválidas");
			return;
		}
	}

	useEffect(() => {
		if (session?.user) {

			localStorage.setItem("access_token", session.user.access_token);
			
			if(session.user.userType === "ADMIN") {
				router.push("/painel");
				router.refresh();
			} else {
				router.push("/documentos");
			}
		}
	}, [session, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" 
			style={{ backgroundImage: 'url("/images/background-login.webp")' }}>
			<div className="max-w-md w-full space-y-8 p-8 bg-white backdrop-blur-sm rounded-lg shadow-lg">
				<div>
					<h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
						Cordeiro e Moura: CEBAS
					</h2>
					<p className="text-center text-sm text-gray-500">
						Entre com suas credenciais para acessar
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						<div>
							<label htmlFor="email" className="sr-only">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Email"
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Senha
							</label>
							<input
								id="password"
								name="password"
								type="password"
								required
								className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Senha"
							/>
						</div>
					</div>

					{error && (
						<div className="text-red-500 text-sm text-center">{error}</div>
					)}

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Entrando..." : "Entrar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
