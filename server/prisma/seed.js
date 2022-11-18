import { genSalt, hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";

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
	try {
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

		// Make transactions for debugging purposes:
		await cashOut(user_2.username, user_1, 50_000);
		await cashOut(user_2.username, user_1, 10_000);

		await cashOut(user_1.username, user_2, 50_000);
		await cashOut(user_1.username, user_2, 50_000);

		console.log("user_1:", user_1, "\n\nuser_2:", user_2);
	} catch (error) {
		console.error("Error seeding database:", error);
	}
}

main().catch(e => {
	console.error("Error creating seed data on prisma:", e);

	process.exit(1);
});

async function cashOut(username_to_cash_in_to, senderUser, amount_to_cash_out) {
	await prisma.$transaction(async transaction => {
		const sender = await transaction.user
			.findUniqueOrThrow({
				where: { id: senderUser.id },
				select: { accountId: true },
			})
			.catch(err => {
				throw new Error("Could not find sender: " + err);
			});

		// 1. Increment the recipient's balance by amount:
		const receiverUpdated = await transaction.user
			.update({
				where: { username: username_to_cash_in_to },
				data: {
					Account: {
						update: {
							balance: {
								increment: amount_to_cash_out,
							},
							cash_in: {
								create: {
									creditedAccountId: sender.accountId,
									value: amount_to_cash_out,
								},
							},
						},
					},
				},
				select: {
					Account: {
						// Only getting these for debugging purposes:
						select: { cash_in: true, cash_out: true },
					},
				},
			})
			.catch(err => {
				throw new Error("Error updating receiver: " + err);
			});

		// 1. Decrement amount from sender:
		const senderAccountUpdated = await transaction.account
			.update({
				where: { id: sender.accountId },
				data: {
					balance: {
						decrement: amount_to_cash_out,
					},
					// This below is not needed cause the creditedAccountId is
					// this account, so prisma ends up creating a cash_out Transaction
					// by itself automatically!!
					// cash_out: {
					// 	create: {
					// 		debitedAccountId: receiverUpdated.accountId,
					// 		value: amount_to_cash_out,
					// 	},
					// },
				},
				// Only getting these for debugging purposes, except `balance`:
				select: { cash_in: true, cash_out: true, balance: true },
			})
			.catch(err => {
				throw new Error("Error updating sender's account: " + err);
			});


		// 3. Verify that the sender's balance didn't go below zero.
		if (senderAccountUpdated.balance < 0)
			throw new Error(
				`${senderUser.username} doesn't have enough to send ${amount_to_cash_out} centavos.`
			);

		return senderAccountUpdated;
	});
}
