import { z } from "zod";

export const maxUsernameLenght = 100,
	maxPasswordLenght = 30,
	minPasswordLenght = 8,
	minUsernameLenght = 3;
const numbers = /[0-9]/g;

export const userFromBody = z.object({
	/** Deve-se garantir que cada username seja único
	 * e composto por, pelo menos, 3 caracteres.
	 */
	username: z
		.string()
		.min(
			minUsernameLenght,
			`Nome de usuário deve ter pelo menos ${minUsernameLenght} caracteres.`
		)
		.max(
			maxUsernameLenght,
			`Nome de usuário deve ter no máximo ${maxUsernameLenght} caracteres.`
		),
	/** Deve-se garantir que a password seja composta por
	 * pelo menos 8 caracteres, um número e uma letra
	 * maiúscula. Lembre-se que ela deverá ser hashada
	 * ao ser armazenada no banco.
	 */
	plainTextPassword: z
		.string()
		.min(
			minPasswordLenght,
			`Senha deve ter pelo menos ${minPasswordLenght} caracteres.`
		)
		.max(
			maxPasswordLenght,
			`Senha deve ter no máximo ${maxPasswordLenght} caracteres.`
		)
		.refine(str => {
			let isAtLeastOneCharUppercase = false;

			for (const char of str)
				if (char === char.toUpperCase() && !char.match(numbers)) {
					isAtLeastOneCharUppercase = true;
					break;
				}

			return isAtLeastOneCharUppercase;
		}, "Senha deve conter pelo menos uma letra maiúscula.")
		.refine(str => {
			const isAtLeastOneCharANumber = (str.match(numbers) ?? []).length > 0;

			return isAtLeastOneCharANumber;
		}, "Senha deve conter pelo menos um número."),
});
