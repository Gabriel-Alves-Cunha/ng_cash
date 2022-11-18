export function centavos2reais(centavos: number): string {
	const inDecimal = centavos / 1_000;

	return inDecimal.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}
