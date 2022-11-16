import { setupServerInstance } from "./setupServerInstance";
import { port } from "./env";

export const server = await setupServerInstance();

console.log("import.meta.env.PROD =", import.meta.env.PROD);

if (import.meta.env.PROD)
	server.listen({ port, host: "localhost" }, err => {
		if (err) server.log.error(err);

		server.log.info("🚀 Server started");
	});
