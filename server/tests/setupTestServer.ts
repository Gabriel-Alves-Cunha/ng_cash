import { afterAll } from "vitest";
import supertest from "supertest";

import { setupServerInstance } from "../src/setupServerInstance";

const server = await setupServerInstance();

export const testServer = supertest(server.server);

afterAll(async () => {
	await server.close();
});
