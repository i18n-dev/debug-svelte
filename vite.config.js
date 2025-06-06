import { defineConfig } from 'vite';
import stylus from "./stylus.js"
import coffeePreprocessor from "./coffee.js"
import svelteCustomElement from './svelteCustomElement.js'
import merge from "lodash-es/merge.js"
import pug from './pug.js'
import comJs from './comJs.js'
// import Conf from "@3-/svelte-com"
// const CONF = await Conf(import.meta.dirname)

import { svelte } from '@sveltejs/vite-plugin-svelte';
const IGNORE_WARN = new Set([
  'a11y-click-events-have-key-events',
  'a11y_consider_explicit_label',
  'a11y-missing-content'
])
const CONF = {
  plugins: [
    comJs,
    svelteCustomElement,
    svelte({
      onwarn: ({code, message})=>{
        if(code == 'a11y-missing-attribute'){
          return !message.includes('<a>')
        }
        return !IGNORE_WARN.has(code)
      },
      preprocess: [
        coffeePreprocessor, 
        pug(import.meta.dirname), 
        stylus
      ],
      compilerOptions: {
        customElement: true,
        cssHash: ({ hash, css, name, filename }) => {
          return '_-_'
        }
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
    cssMinify: false,
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
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
