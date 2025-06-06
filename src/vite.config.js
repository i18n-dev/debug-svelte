import { defineConfig } from 'vite';
import merge from "lodash-es/merge.js"
// import Conf from "@3-/svelte-com"
// const CONF = await Conf(import.meta.dirname)

import { svelte } from '@sveltejs/vite-plugin-svelte';
const CONF = {
  svelte({
    preprocess: [
      // coffeePreprocessor, 
      // pug(src), 
      // stylus
    ],
    compilerOptions: {
      customElement: true
    }
  }),
}

export default defineConfig(
	merge(CONF, {
		define: {
			// __SRV__: JSON.stringify(process.env.__SRV__),
		},
		build: {
			rollupOptions: {
        external: [/^-\/.+/, /^virtual:.+/],
			},
		},
	}),
);
