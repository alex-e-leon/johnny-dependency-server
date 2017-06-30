const merry = require('merry');
const got = require('got');
const bankai = require('bankai');
const npa = require('npm-package-arg');
const johnny = require('johnny-dependency');
const lru = require('lru-cache');
const {URL} = require('url');

module.exports = options => {
  const app = merry(options);
  const cache = lru({max: 50000});
  const assets = bankai('./src/components/index.js', {
    debug: true,
    watch: true,
    css: {
      use: ['sheetify-postcss']
    }
  });

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

  app.route('GET', '/api/package/*', async (req, res, ctx) => {
    const referer = new URL(req.headers.referer);
    const filter = referer.searchParams.get('filter');

    function filterChildren(accumulator, child) {
      if (child.name.includes(filter)) {
        accumulator.push(child);

        if (child.children) {
          child.children = child.children.reduce(filterChildren, []);
        }
      }

      return accumulator;
    }

    try {
      const pkg = npa(ctx.params.wildcard);
      const npmName = `${pkg.name}@${pkg.fetchSpec}`;

      ctx.log.debug(`Fetching deps for ${npmName}.`);

      let deps = cache.get(npmName);

      if (deps) {
        ctx.log.debug(`Found ${npmName} in memory cache.`);
      } else {
        ctx.log.debug(`Fetching ${npmName} from npm.`);
        deps = await johnny({
          name: pkg.name,
          version: pkg.fetchSpec
        }, {
          auth: {
            token: process.env.NPM_AUTH_TOKEN
          }
        });

        cache.set(npmName, deps);
      }

      if (filter) {
        deps.children = deps.children.reduce(filterChildren, []);
      }

      ctx.send(200, deps);
    } catch (err) {
      ctx.log.error(err);
      ctx.send(500, 'Something went wrong with the request.');
    }
  });

  app.route('GET', '/package/*', async (req, res) => {
    return assets.html().pipe(res);
  });

  app.route('default', (req, res, ctx) => {
    ctx.log.info('Route doesnt exist');
    ctx.send(404, 'Page not found.', {'Content-Type': 'text/plain'});
  });

  return app;
};
