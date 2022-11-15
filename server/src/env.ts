// Get enviroment variables and varify they exist:
export const jwtSecret = process.env.JWT_SECRET as string;
export const port = Number(process.env.PORT);

if (!jwtSecret) {
	console.error("JWT_SECRET is not defined");
	process.exit(1);
}

if (!port) {
	console.error("Port is not defined");
	process.exit(1);
}
