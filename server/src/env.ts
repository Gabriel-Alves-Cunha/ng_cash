// Get enviroment variables and varify they exist:
// @ts-ignore => This can only be accessed through dot notation:
export const jwtSecret = process.env.JWT_SECRET as string;
// @ts-ignore => This can only be accessed through dot notation:
export const port = Number(process.env.PORT);

if (!jwtSecret) {
	console.error("JWT_SECRET is not defined on .env!");
	process.exit(1);
}

if (!port) {
	console.error("Port is not defined on .env!");
	process.exit(1);
}
