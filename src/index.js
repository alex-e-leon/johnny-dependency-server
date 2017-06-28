const merry = require('merry');

const app = merry();

app.route('GET', '/', (req, res, ctx) => {
  ctx.log.info('oh hey, a request here');
  ctx.send(200, { cute: 'butts' });
});

app.route('GET', '/favicon.ico', (req, res, ctx) => {
  ctx.send(404, ' ', { 'Content-Type': 'text/plain' });
});

app.route('default', (req, res, ctx) => {
  ctx.log.info('Route doesnt exist');
  ctx.send(404, 'Page not found.', { 'Content-Type': 'text/plain' });
});

app.listen(3000);
