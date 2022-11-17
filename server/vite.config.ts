import { configDefaults } from "vitest/config";
import { VitePluginNode } from "vite-plugin-node";
import { builtinModules } from "node:module";
import { defineConfig } from "vite";
import { resolve } from "node:path";

const builtinModulesWithNode = builtinModules.map(mod => `node:${mod}`);
const allBuiltinModules = builtinModulesWithNode.concat(builtinModules);

export default defineConfig({
	server: {
		port: 3456, // Same as .env    For some unknown reason I can't get it from .env :[
	},

	plugins: [
		...VitePluginNode({
			// Nodejs native Request adapter
			// currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
			// you can also pass a function if you are using other frameworks, see Custom Adapter section
			adapter: "fastify",

			// tell the plugin where is your project entry
			appPath: "src/startServer.ts",

			// Optional, default: 'viteNodeApp'
			// the name of named export of you app from the appPath file
			exportName: "server",
		}),
	],

	build: {
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: [...allBuiltinModules, "mock-aws-s3", "aws-sdk", "nock"],
			input: resolve(__dirname, "src/startServer.ts"),
			preserveEntrySignatures: "strict",
			strictDeprecations: true,

			// https://rollupjs.org/guide/en/#big-list-of-options
			output: {
				generatedCode: {
					objectShorthand: true,
					constBindings: true,
					preset: "es2015",
				},
				minifyInternalExports: false,
				sourcemap: false,
				dir: "./build",
				format: "esm",
			},
		},

		chunkSizeWarningLimit: 1_000,
		reportCompressedSize: false,
		emptyOutDir: false,
		sourcemap: false,
		target: "esnext",
		minify: false,
	},

	esbuild: {
		minifyIdentifiers: false,
		minifyWhitespace: false,
		minifySyntax: false,
		treeShaking: true,
		sourcemap: false,
		target: "esnext",
		platform: "node",
		logLevel: "info",
		charset: "utf8",
		format: "esm",
		logLimit: 10,
		color: true,
	},

	optimizeDeps: {
		exclude: [...allBuiltinModules, "mock-aws-s3", "aws-sdk", "nock"],
	},

	test: {
		setupFiles: "./tests/setupTestServer.ts",
		logHeapUsage: true,
		threads: false,
		dir: "tests",
		coverage: {
			// reporter: ["html", "text"],
			reporter: ["text"],
			// all: true,
		},
		exclude: [
			...configDefaults.exclude,
			"**/seeLeakedVariables.ts",
			"**/.eslintrc.{js,cjs}",
			"**/styles.ts",
			"**/global.ts",
			"coverage/**",
			"**/*.d.ts",
		],
	},

	resolve: {
		alias: [
			{ find: "#validation", replacement: resolve("src/validation/") },
			{ find: "#plugins", replacement: resolve("src/plugins/") },
			{ find: "#routes", replacement: resolve("src/routes/") },
			{ find: "#tests", replacement: resolve("tests/") },
			{ find: "#src", replacement: resolve("src/") },
		],
	},
});

function log(...args: unknown[]): void {
	console.dir(...args, {
		maxStringLength: 1_000,
		maxArrayLength: 100,
		compact: false,
		sorted: false,
		colors: true,
		depth: 10,
	});
}
