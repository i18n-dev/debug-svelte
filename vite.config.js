import { defineConfig } from 'vite';
import coffeePreprocessor from "./coffee.js"
import svelteCustomElement from './svelteCustomElement.js'
import merge from "lodash-es/merge.js"
import comJs from './comJs.js'
// import Conf from "@3-/svelte-com"
// const CONF = await Conf(import.meta.dirname)

import { svelte } from '@sveltejs/vite-plugin-svelte';
const CONF = {
  plugins: [
    comJs,
    svelteCustomElement,
    svelte({
      preprocess: [
        coffeePreprocessor, 
        // pug(src), 
        // stylus
      ],
      compilerOptions: {
        customElement: true
      }
    }),
  ],
  build: {
    lib: {
      entry:[
        'src/Captcha.svelte',
        'src/Index.svelte'
      ],
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ["es"],
    },
  }
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
