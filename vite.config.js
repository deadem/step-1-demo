import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import rewritePlugin from './http-rewrite/vite-rewrite-plugin';

// eslint-disable-next-line no-undef
const dirname = __dirname;

export default defineConfig({
  plugins: [
    rewritePlugin(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: `eslint --cache --cache-location=${dirname}/.cache/ "src/**/*.{js,ts}"`,
      },
      stylelint: {
        lintCommand: `stylelint --cache --cache-location=${dirname}/.cache/stylelint-cache src/**/*.{css,scss}`,
      },
    })
  ],
});
