import type { FastifyInstance } from "fastify";

import {
	cashOutInformationFromBody,
	filterByFromQuery,
} from "#validation/transaction";
import { authenticate } from "#plugins/authenticate";
import { prisma } from "../prisma";
import { log } from "../utils";

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

			const { amount_to_cash_out, username_to_cash_in_to } =
				cashOutInformationFromBody.parse(req.body);

			// Can't send a transaction to yourself:
			if (req.user.username === username_to_cash_in_to)
				return {
					message: "You cannot send a transaction to yourself.",
					success: false,
				};

			try {
				const senderAccount = await prisma.$transaction(async transaction => {
					const sender = await transaction.user
						.findUniqueOrThrow({
							where: { id: req.user.sub },
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
								Account: { include: { cash_in: true, cash_out: true } },
								accountId: true,
							},
						})
						.catch(err => {
							throw new Error("Error updating receiver: " + err);
						});

					log({ receiverUpdated });

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
							include: { cash_in: true, cash_out: true },
						})
						.catch(err => {
							throw new Error("Error updating sender's account: " + err);
						});

					log({ senderAccountUpdated });

					// 3. Verify that the sender's balance didn't go below zero.
					if (senderAccountUpdated.balance < 0)
						throw new Error(
							`${req.user.username} doesn't have enough to send ${amount_to_cash_out} centavos.`
						);

					return senderAccountUpdated;
				});

				return { success: true, balance: senderAccount.balance };
			} catch (error) {
				console.error("Error cashing out:", error);

				return { success: false, message: error };
			}
		}
	);

	fastify.get("/api/transactions", { onRequest: [authenticate] }, async req => {
		/** Todo usuário logado (ou seja, que apresente um token válido)
		 * deverá ser capaz de visualizar as transações financeiras
		 * (cash-out e cash-in) que participou. Caso o usuário não
		 * tenha participado de uma determinada transação, ele nunca
		 * poderá ter acesso à ela.
		 */

		try {
			// Get all Transactions
			const allTransactions = await prisma.account
				.findMany({
					where: {
						User: { every: { id: req.user.sub } },
					},
					select: { cash_in: true, cash_out: true },
				})
				.catch(err => {
					throw new Error(
						"Error finding all accounts with all transactions: " + err
					);
				});

			log({
				"Transactions by account": allTransactions,
			});

			return {
				cash_out: allTransactions[0]!.cash_out,
				cash_in: allTransactions[0]!.cash_in,
			};
		} catch (error) {
			console.error(
				"Error getting transactions at '/api/transactions':",
				error
			);

			return { message: error };
		}
	});

	fastify.get(
		"/api/transactions-filtered",
		{
			onRequest: [authenticate],
			schema: {
				querystring: {
					additional_filter: { type: "string" },
					filter_by: { type: "string" },
					order_by: { type: "string" },
				},
			},
		},
		async req => {
			/** Todo usuário logado (ou seja, que apresente um token válido)
			 * deverá ser capaz de filtrar as transações financeiras que
			 * participou por:
			 * * Data de realização da transação e/ou
			 * * cash_out
			 * * cash_in
			 */

			const { filter_by, order_by, additional_filter } =
				filterByFromQuery.parse(req.query);

			try {
				// Get all Transactions with filter
				const allTransactions = await prisma.account
					.findMany({
						where: {
							User: { every: { id: req.user.sub } },
						},
						select: {
							cash_in:
								additional_filter === "cash_in" ||
								filter_by === "cash_in" ||
								filter_by === "date"
									? { orderBy: { createdAt: order_by ?? "asc" } }
									: false,

							cash_out:
								additional_filter === "cash_out" ||
								filter_by === "cash_out" ||
								filter_by === "date"
									? { orderBy: { createdAt: order_by ?? "asc" } }
									: false,
						},
					})
					.catch(err => {
						throw new Error(
							"Error finding all accounts with all transactions: " + err
						);
					});

				log({
					"Transactions by account": allTransactions,
				});

				return {
					cash_out: allTransactions[0]!.cash_out,
					cash_in: allTransactions[0]!.cash_in,
				};
			} catch (error) {
				console.error(
					"Error getting transactions at '/api/transactions':",
					error
				);

				return { message: error };
			}
		}
	);
}
