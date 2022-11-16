import type { FastifyInstance } from "fastify";
import { log } from "src/utils";
import { z } from "zod";

import { authenticate } from "../plugins/authenticate";
import { prisma } from "../prisma";

export async function transactionRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/api/transactions/cash-out",
		{ onRequest: [authenticate] },
		async req => {
			/** Todo usuário logado (ou seja, que apresente um token válido)
			 * deverá ser capaz de realizar um cash-out informando o username
			 * do usuário que sofrerá o cash-in), caso apresente balance
			 * suficiente para isso. Atente-se ao fato de que um usuário
			 * não deverá ter a possibilidade de realizar uma transferênci
			 *  para si mesmo.
			 */

			const {} = cashInInfoFromBody.parse(req.body);
		}
	);

	fastify.get("/api/transactions", { onRequest: [authenticate] }, async req => {
		try {
			const user = await prisma.user.findUniqueOrThrow({
				where: { id: req.user.sub },
				select: { accountId: true },
			});

			// Get all Transactions
			const allTransactions = await prisma.account.findMany({
				where: {
					User: { every: { id: req.user.sub } },
					// cash_in: {
					// 	every: {
					// 		creditedAccountId: user.accountId,
					// 		debitedAccountId: user.accountId,
					// 	},
					// },
				},
			});

			const t = await prisma.transaction.findMany({
				where: {
					creditedAccountId: user.accountId,
					debitedAccountId: user.accountId,
				},
			});

			log(
				"Transactions by account =",
				allTransactions,
				"\n\n\nTransactions by transaction =",
				t
			);
		} catch (error) {
			console.error(
				"Error getting transactions at '/api/transactions':",
				error
			);

			return { error: "Error getting transactions!" };
		}
	});
}

const cashInInfoFromBody = z.object({
	username_to_cash_in_to: z.string(),
	amount_to_cash_out: z.number(),
});
