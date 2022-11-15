import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const user_1 = await prisma.user.create({
		data: {
			username: "Fulano Alves",
			password: "A2345678",

			Account: {
				create: {
					balance: 100_000, // R$ 100,00 em centavos.
				},
			},
		},
	});

	const user_2 = await prisma.user.create({
		data: {
			username: "Sicrano Cunha",
			password: "B2345678",

			Account: {
				create: {
					balance: 100_000, // R$ 100,00 em centavos.
				},
			},
		},
	});
}

main().catch(e => {
	console.error("Error creating seed data on prisma:", e);

	process.exit(1);
});
