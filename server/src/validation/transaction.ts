import { z } from "zod";

import { maxUsernameLenght, minUsernameLenght } from "./user";

export const cashOutInformationFromBody = z.object({
	username_to_cash_in_to: z
		.string()
		.min(
			minUsernameLenght,
			`Nome de usuário deve ter pelo menos ${minUsernameLenght} caracteres.`
		)
		.max(
			maxUsernameLenght,
			`Nome de usuário deve ter no máximo ${maxUsernameLenght} caracteres.`
		),
	amount_to_cash_out: z.number().min(1 /* centavo */).positive(),
});

const availableFilters = ["cash_out", "cash_in", "date"] as const;
const additionalFilters = ["cash_out", "cash_in"] as const;
const availableOrders = ["asc", "desc"] as const;

export const filterByFromQuery = z.object({
	additional_filter: z.enum(additionalFilters).optional(),
	order_by: z.enum(availableOrders).optional(),
	filter_by: z.enum(availableFilters),
});


