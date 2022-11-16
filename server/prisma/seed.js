import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

const prisma = new PrismaClient();

/**
 * @param {string} plaintextPassword
 */
async function hashPassword(plaintextPassword) {
	return await hash(plaintextPassword, await genSalt());
}

const user1_info = {
		plainTextPassword: "A2345678",
		username: "Fulano Alves",
	},
	user2_info = {
		plainTextPassword: "B2345678",
		username: "Sicrano Cunha",
	};

async function main() {
	const user_1 = await prisma.user.create({
		data: {
			hashedPassword: await hashPassword(user1_info.plainTextPassword),
			username: user1_info.username,

			Account: {
				create: {
					balance: 100_000, // R$ 100,00 em centavos.
				},
			},
		},
	});

	const user_2 = await prisma.user.create({
		data: {
			hashedPassword: await hashPassword(user2_info.plainTextPassword),
			username: user2_info.username,

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
