const assert = require('assert');
const { promisify } = require('util');
const viewEngine = require('..');
const viewOptions = {
  settings: {
    env: 'development',
    views: __dirname,
  },
};

async function testComponent(path) {
  const render = promisify(viewEngine.createEngine());
  const source = await render(path, viewOptions);
  assert.equal(
    source,
    '<!DOCTYPE html><div><h1></h1><p>Welcome to </p><p>I can count to 10:1, 2, 3, 4, 5, 6, 7, 8, 9, 10</p></div>',
    `Rendering ${path}: generated expected content`
  );
}

testComponent(__dirname + '/es6-component.jsx').then(
  () => {
    console.log('All tests pass!');
    process.exit(0);
  }
);
