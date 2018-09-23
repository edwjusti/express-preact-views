const { h } = require('preact');
const renderToString = require('preact-render-to-string');
const beautifyHTML = require('js-beautify').html;
const _escaperegexp = require('lodash.escaperegexp');

const DEFAULT_OPTIONS = {
  doctype: '<!DOCTYPE html>',
  beautify: false,
  transformViews: true,
  babel: {
    presets: [
      'preact',
      [
        'env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
  },
};

function createEngine(engineOptions) {
  let registered = false;
  let moduleDetectRegEx;

  engineOptions = Object.assign({}, DEFAULT_OPTIONS, engineOptions || {});

  function renderFile(filename, options, cb) {
    // Defer babel registration until the first request so we can grab the view path.
    if (!moduleDetectRegEx) {
      // Path could contain regexp characters so escape it first.
      // options.settings.views could be a single string or an array
      moduleDetectRegEx = new RegExp(
        []
          .concat(options.settings.views)
          .map(viewPath => '^' + _escaperegexp(viewPath))
          .join('|')
      );
    }

    if (engineOptions.transformViews && !registered) {
      // Passing a RegExp to Babel results in an issue on Windows so we'll just
      // pass the view path.
      require('babel-register')(
        Object.assign({ only: options.settings.views }, engineOptions.babel)
      );
      registered = true;
    }

    let markup;

    try {
      markup = engineOptions.doctype;
      let component = require(filename);
      // Transpiled ES6 may export components as { default: Component }
      component = component.default || component;
      markup += renderToString(h(component, options));
    } catch (e) {
      return cb(e);
    } finally {
      if (options.settings.env === 'development') {
        // Remove all files from the module cache that are in the view folder.
        Object.keys(require.cache).forEach(module => {
          if (moduleDetectRegEx.test(require.cache[module].filename)) {
            delete require.cache[module];
          }
        });
      }
    }

    if (engineOptions.beautify) {
      // NOTE: This will screw up some things where whitespace is important, and be
      // subtly different than prod.
      markup = beautifyHTML(markup);
    }

    cb(null, markup);
  }

  return renderFile;
}

exports.createEngine = createEngine;
