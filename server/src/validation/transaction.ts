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
