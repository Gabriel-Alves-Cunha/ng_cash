import { setupServerInstance } from "./setupServerInstance";
import { port } from "./env";

export const server = await setupServerInstance();

if (import.meta.env.PROD)
	server.listen(
		{
			host: "0.0.0.0", // This is needed for Docker... it took me a while...
			port,
		},
		err => {
			if (err) server.log.error(err);

			server.log.info("🚀 Server started");
		}
	);
