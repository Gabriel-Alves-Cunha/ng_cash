// Get enviroment variables and verify they exist:
// @ts-ignore => This can only be accessed through dot notation:
export const jwtSecret = import.meta.env.VITE_JWT_SECRET;
// @ts-ignore => This can only be accessed through dot notation:
export const port = Number(import.meta.env.VITE_PORT);

if (!jwtSecret) {
	console.error("JWT_SECRET is not defined on .env!");
	process.exit(1);
}

if (!port) {
	console.error("Port is not defined on .env!");
	process.exit(1);
}
