export function log(...args: unknown[]): void {
	console.dir(...args, {
		maxStringLength: 1_000,
		maxArrayLength: 100,
		compact: false,
		sorted: false,
		colors: true,
		depth: 10,
	});
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export function makePassword() {
	const charactersLength = characters.length;
	let result = "";

	for (let i = 0; i < 15; ++i)
		result += characters.charAt(Math.floor(Math.random() * charactersLength));

	return result;
}
