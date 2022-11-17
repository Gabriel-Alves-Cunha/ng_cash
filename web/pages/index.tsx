import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

import { Button } from "components/Button";
import { api } from "lib/axios";

import bgHome from "../public/bg-home.png";
import logo from "../public/logo.svg";

// Test users from server/prisma/seed.js
const user1_info = {
		plainTextPassword: "A2345678",
		username: "Fulano Alves",
	},
	user2_info = {
		plainTextPassword: "B2345678",
		username: "Sicrano Cunha",
	};

/** Página para realizar o cadastro ou login na NG informando username e password. */
export default function Home() {
	const [apiToCall, setApiToCall] = useState<"create-user" | "login">("login");
	const router = useRouter();

	async function loginOrSubscribe(e: React.FormEvent): Promise<void> {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const formEntries = {
			plainTextPassword: formData.get("plainTextPassword") as string,
			username: formData.get("username") as string,
		};
		const url = "/api/auth/" + apiToCall;

		try {
			const { data } = await api.post<LoginOrCreateUserResponse>(
				url,
				formEntries
			);

			if (data.message) throw new Error(data.message);
			if (!data.token)
				throw new Error("Token not present! This should never happen!");

			api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

			await router.push("/user");
		} catch (error) {
			console.error("Error fetching " + url, error);

			alert("There was an error!");
		}
	}

	// Design from figma: "https://www.figma.com/file/4FgYu4Bdfhz9XyJadiOqdj/Login-View-(Community)?t=VRhzlhdKKvmX04gw-6".

	return (
		<main className="flex h-screen w-screen">
			<div className="w-1/2 h-full">
				<Image
					alt="A mountain with an orange and blue sky."
					className="h-full"
					placeholder="blur"
					src={bgHome}
				/>
			</div>

			<div className="relative w-1/2 h-full flex flex-col justify-center items-center">
				<Image
					className="bg-black box-content p-3 w-24 h-16 rounded-xl"
					alt="NG.Cash's logo, it's name with a risc below it."
					src={logo}
				/>

				<form
					className="flex flex-col w-[50%] mt-8"
					onSubmit={loginOrSubscribe}
					id="form"
				>
					<p className="font-bold text-2xl leading-9 text-primary">
						{apiToCall === "login" ? "Faça login abaixo" : "Cadastre-se abaixo"}
					</p>

					<label className="flex flex-col text-secondary font-normal leading-5 mt-6">
						Nome de usuário
						<input
							className="mt-3 h-12 border-lightgray rounded-[5px] border-solid border-[1px] px-5 py-2"
							placeholder="Fulano da Silva"
							name="username"
							type="text"
							max={100}
							required
							min={3}
						/>
					</label>

					<label className="flex flex-col text-secondary font-normal leading-5 mt-6">
						Senha
						<input
							className="mt-3 h-12 border-lightgray rounded-[5px] border-solid border-[1px] px-5 py-2"
							name="plainTextPassword"
							type="password"
							required
							max={30}
							min={8}
						/>
					</label>

					{apiToCall === "login" ? (
						<Button
							className="mt-16"
							variant="primary"
							title="Entrar"
							type="submit"
						/>
					) : (
						<Button
							variant="secondary"
							title="Cadastrar"
							className="mt-16"
							type="submit"
						/>
					)}

					<button
						onClick={() =>
							setApiToCall(apiToCall === "login" ? "create-user" : "login")
						}
						className="w-fit mt-5 underline text-primary text-sm"
						type="button"
					>
						{apiToCall === "login" ? "Cadastre-se" : "Login"}
					</button>
				</form>
			</div>
		</main>
	);
}

type LoginOrCreateUserResponse = { token?: string; message?: string };
