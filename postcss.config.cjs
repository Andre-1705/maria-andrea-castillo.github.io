/* PostCSS config (CommonJS) — use the new @tailwindcss/postcss plugin per Tailwind guidance */
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
};
