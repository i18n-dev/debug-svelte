import { defineConfig } from 'vite';
import merge from "lodash-es/merge.js"
import { svelte } from '@sveltejs/vite-plugin-svelte';
import Conf from "@3-/svelte-com"

const CONF = await Conf(import.meta.dirname)

export default defineConfig(
	merge(CONF, {
		define: {
			// __SRV__: JSON.stringify(process.env.__SRV__),
		},
		build: {
			rollupOptions: {
				external: [/^-\/.+/],
			},
		},
	}),
);
