const test = require('ava');
const devnull = require('dev-null');
const app = require('../src/app')({ logStream: devnull() });
const getPort = require('get-server-port');
const http = require('http');
const got = require('got');
const nock = require('nock');

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';

test.beforeEach((t) => {
  t.context.server = http.createServer(app.start());
});

function performGet(t, input) {
  return new Promise((resolve) => {
    t.context.server.listen(() => {
      const port = getPort(t.context.server);
      resolve(got.get(`http://localhost:${port}${input}`));
    });
  });
}

test('/ping should return pong with 200', t => performGet(t, '/ping').then((res) => {
  t.is(res.body, 'pong');
  t.is(res.statusCode, 200);
}));

test('garbage url should return 404', t => performGet(t, '/broken-url').catch((err) => {
  t.is(err.response.body, 'Page not found.');
  t.is(err.response.statusCode, 404);
}));

test('/health should return npm stats when healthy', async (t) => {
  const sampleNpmResponse = '{"db_name":"registry","doc_count":606177,"doc_del_count":348,"update_seq":637' +
  '2412,"purge_seq":0,"compact_running":false,"disk_size":3241078915,"data_size":2727263827,"instance_start_time":"14' +
  '98521950115511","disk_format_version":6,"committed_update_seq":6372412}';

  nock(NPM_REGISTRY_URL).get('/').reply(200, JSON.parse(sampleNpmResponse));

  const res = await performGet(t, '/health');

  t.is(res.statusCode, 200);
  t.deepEqual(res.body, sampleNpmResponse);
});

test('/health should return a 500 when npm is not healthy', async (t) => {
  nock(NPM_REGISTRY_URL).get('/').reply(500);

  const error = await t.throws(performGet(t, '/health'));
  t.is(error.response.statusCode, 500);
});

test.todo('/package/@domain-group/fe-button should return 200 with proper data');
test.todo('/package/express should return 200 with proper data');
test.todo('/package/some-invalid-package should return 400');
test.todo('/package/@some-invalid-scope/some-invalid-package should return 400');
