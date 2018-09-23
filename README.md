# express-preact-views

This is an [Express][express] view engine forked from [express-react-views](https://github.com/reactjs/express-react-views) which renders [Preact][preact] components on server.

This is intended to be used as a replacement for existing server-side view solutions, like [jade][jade], [ejs][ejs], or [handlebars][hbs].


## Usage

```sh
npm install express-preact-views preact
```

### Add it to your app.

```js
// app.js

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-preact-views').createEngine());
```

### Options
option | values | default
-------|--------|--------
`doctype` | any string that can be used as [a doctype](http://en.wikipedia.org/wiki/Document_type_declaration), this will be prepended to your document | `"<!DOCTYPE html>"`
`beautify` | `true`: beautify markup before outputting (note, this can affect rendering due to additional whitespace) | `false`
`transformViews` | `true`: use `babel` to apply JSX, ESNext transforms to views.<br>**Note:** if already using `babel-register` in your project, you should set this to `false` | `true`
`babel` | any object containing valid Babel options<br>**Note:** does not merge with defaults | `{presets: ['preact', [ 'env', {'targets': {'node': 'current'}}]]}`

The defaults are sane, but just in case you want to change something, here's how it would look:

```js
const options = { beautify: true };
app.engine('jsx', require('express-preact-views').createEngine(options));
```


### Views

Under the hood, [Babel][babel] is used to compile your views to code compatible with your current node version, using the [preact][babel-preset-preact] and [env][babel-preset-env] presets by default. Only the files in your `views` directory (i.e. `app.set('views', __dirname + '/views')`) will be compiled.

Your views should be node modules that export a preact component. Let's assume you have this file in `views/index.jsx`:

```js
import { h, Component } from 'preact';

class HelloMessage extends Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

export default HelloMessage;
```

### Routes

Your routes would look identical to the default routes Express gives you out of the box.

```js
// app.js
import index from './routes';

app.get('/', index);
```

```js
// routes/index.js

export default function(req, res){
  res.render('index', { name: 'John' });
};
```

**That's it!** Layouts follow really naturally from the idea of composition.

### Layouts

Simply pass the relevant props to a layout component.

`views/layouts/default.jsx`:
```js
import { h, Component } from 'preact';

class DefaultLayout extends Component {
  render() {
    return (
      <html>
        <head><title>{this.props.title}</title></head>
        <body>{this.props.children}</body>
      </html>
    );
  }
}

export default DefaultLayout;
```

`views/index.jsx`:
```js
import { h, Component } from 'preact';
import DefaultLayout from './layouts/default';

class HelloMessage extends Component {
  render() {
    return (
      <DefaultLayout title={this.props.title}>
        <div>Hello {this.props.name}</div>
      </DefaultLayout>
    );
  }
}

export default HelloMessage;
```

[express]: http://expressjs.com/
[preact]: https://preactjs.com
[jade]: http://jade-lang.com/
[ejs]: http://embeddedjs.com/
[hbs]: https://github.com/barc/express-hbs
[babel]: https://babeljs.io/
[babel-preset-preact]: https://github.com/developit/babel-preset-preact
[babel-preset-env]: https://babeljs.io/docs/plugins/preset-env/