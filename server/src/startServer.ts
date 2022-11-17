import { setupServerInstance } from "./setupServerInstance";
import { port } from "./env";

export const server = await setupServerInstance();

if (import.meta.env.PROD)
	server.listen({ port, host: "localhost" }, err => {
		if (err) server.log.error(err);

		server.log.info("🚀 Server started");
	});
