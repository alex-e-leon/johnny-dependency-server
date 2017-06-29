const merry = require('merry');
const got = require('got');
const bankai = require('bankai');
const npa = require('npm-package-arg');
const johnny = require('johnny-dependency');

module.exports = options => {
  const app = merry(options);
  const assets = bankai('./src/components/index.js', {debug: true, watch: true});

  assets.on('js-bundle', function () {
    app.log.info('bundle:js');
  });

  assets.on('css-bundle', function () {
    app.log.info('bundle:css');
  });

  app.route('GET', '/', (req, res) => {
    assets.html().pipe(res);
  });

  app.route('GET', '/bundle.css', (req, res) => {
    assets.css(req, res).pipe(res);
  });

  app.route('GET', '/bundle.js', (req, res) => {
    assets.js(req, res).pipe(res);
  });

  app.route('GET', '/static/*', (req, res) => {
    assets.static(req, res).pipe(res);
  });

  app.route('GET', '/favicon.ico', (req, res, ctx) => {
    ctx.send(404, ' ', {'Content-Type': 'text/plain'});
  });

  app.route('GET', '/ping', (req, res, ctx) => {
    ctx.send(200, 'pong', {'Content-Type': 'text/plain'});
  });

  app.route('GET', '/health', (req, res, ctx) => {
    got.stream.get('https://registry.npmjs.org/').on('error', error => ctx.send(500, error)).pipe(res);
  });

  app.route('GET', '/package/*', (req, res, ctx) => {
    try {
      const pkg = npa(ctx.params.wildcard);
      ctx.log.debug(`Fetching deps for ${pkg.name}@${pkg.fetchSpec}.`);

      johnny({
        name: pkg.name,
        version: pkg.fetchSpec
      }, {
        auth: {
          token: process.env.NPM_AUTH_TOKEN
        }
      }).then(deps => {
        ctx.send(200, deps);
      });
    } catch (err) {
      ctx.log.error(err);
      ctx.send(500, 'Something went wrong with the request.');
    }
  });

  app.route('default', (req, res, ctx) => {
    ctx.log.info('Route doesnt exist');
    ctx.send(404, 'Page not found.', {'Content-Type': 'text/plain'});
  });

  return app;
};
