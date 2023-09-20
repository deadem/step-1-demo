/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const history = require('connect-history-api-fallback');

module.exports = history({
  index: '/error-page-404',
  rewrites: [
    { from: /^\/(sign-up|settings|messenger)$/, to: '/' },
  ],
});
