export function centavos2reais(centavos: number): string {
	const inDecimal = centavos / 1_000;

	return inDecimal.toLocaleString("pt-BR", {
		minimumSignificantDigits: 1,
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
		style: "currency",
		currency: "BRL",
	});
}

export function reais2centavos(reais: number): number {
	return reais * 1000;
}
