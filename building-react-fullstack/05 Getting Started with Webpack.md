# Getting Started with Webpack

In my opinion, the "gold-rush" of front-end development started around the same time as popular build tools became mainstream.  I would argue that it was the success of Grunt.js that paved the way for modern front-end development that we know today.  Prior to Grunt.js, I would guess that most front-end devs weren't concerned with bundling, minification, css transpilers, TDD, ES2015, etc.  Because Grunt.js ushered in such an easy to use process of automating tasks that would have been too time consuming previously, it allowed us to get much more creative in our creation and utilization of frameworks.

Fast forward a few years and it seems theres a new build tool released every other month. Grunt.js was the leader for quite a while but recently Gulp and Webpack have taken the lead. (Webpack specifically within the React community.)

We're going to be focused on using Webpack for this project.

## Tasks

For our React app, Webpack is going to be primarily responsible for the following tasks:

 * Allow us to use ES2015 by relying on Babel to transpile our code into working ES5
 * Allow us to use SASS so that we can have nice neat dynamic CSS
 * Allow us to `import` our SASS files as "modules" in our Components (just like we `import` any other ES2015 modules)
 * ESLint our code to ensure clean syntax and no bugs/errors
 * Bundling and Minification (for production releases)
 * Hot reloading via a basic dev server

The first step is to ensure that we have the global Webpack CLI installed:

```bash
$ npm install -g webpack
$ webpack --version
webpack 1.12.9
```

Next up we're going to install a big batch of dependencies that we're going to want to use with Webpack.  Let me warn you in advance, we're about to dump a ton of dependencies into the project.  I've broken them down into 3 different steps so its a bit easier to read and digest.

> _Note:_ if you havent yet already, be sure to `npm init` within your project directory so that you have a standard `package.json` file for your project.

## Dependencies

First let's start with everything we're going to need in order to properly work with ES2015 code.  This includes Babel and each of its related dependencies:

```bash
$ npm install --save-dev babel-core babel-preset-es2015 babel-preset-stage-1 babel-preset-react babel-loader webpack
```

When Babel jumped to version 6.0.0 it introduced a pretty significant change in its paradigm.  Basically because the project was growing, it decided to break down into multiple components or plugins.  The most important is still `babel-core` but now we have the choice of just how far down the rabbit hole we want to go with regard to ES2015 support as well as anything "experimental". In our case, I included `babel-core` and of course `babel-preset-es2015` which gets us the barebones support for ES2015.  However we also need to include `babel-preset-react` so that our JSX code is recognized by Babel.  In order for us to use some slightly advanced and experimental ES2016 features, we included `babel-preset-stage1`.  Finally we include the Webpack specific `babel-loader` and `webpack` itself for the actual project.

Next up let's install the dependencies that are going to be specifically related to SASS and our use of modular css within our components:

```bash
$ npm install --save-dev autoprefixer css-loader extract-text-webpack-plugin node-sass postcss-loader sass-loader style-loader
```

`autoprefixer` is an npm module that allows us to write basic CSS and not worry about browser vendor specific prefixes (i.e. `-webkit-` etc).  `node-sass` is the module we use specifically to compile any SASS code.  The remaining dependencies are Webpack specific loaders that we will rely on to do some pretty cool stuff like dynamic module based CSS `imports` (i.e. Component specific stylesheets).

Finally install the dependencies specifically for ESLint:

```bash
$ npm install --save-dev eslint eslint-loader eslint-plugin-react babel-eslint
```

Webpack also features a handy development server that is really good at hot reloading, or keeping your build files stored in memory versus the file system.  What this allows is super fast real-time loading of your updated code in the browser without requiring a refresh constantly.  Lets install the Webpack dev server now:

```bash
$ npm install -g webpack-dev-server
```

More on this later!

## Basic Project Scaffold

Before we can actually start using Webpack, we need some files to actually be bundled and processed.  Lets create the basic skeletal structure of our app and add some really simple example code to prove our Webpack configuration will work properly:

```bash
$ mkdir -p client/js
$ mkdir -p client/stylesheets
```

Now create and edit the file `client/js/sample.js` and insert the following code:

```javascript
let collection = [1,2,3,4,5];
collection.forEach(item => console.log(item));
```

This is just some basic JavaScript that uses ES2015.  We need to ensure that our Webpack config will use Babel to transpile that code into functional ES5.

## Configure Webpack

Let's start by creating a `webpack.config.js` file Webpack will use to know how to build the project:

```bash
$ touch webpack.config.js
```

Because Webpack is just JavaScript (and more specifically Node.js) the code should look pretty familiar.  First we need to start with a simple `module.exports`:

```javascript
module.exports = {

}
```

Our Webpack config is just going to export a large (complex) JavaScript object, so within the object braces lets start out by simply defining the `entry` file, or the "first" file our app starts with:

```javascript
module.exports = {
  entry: './client/js/sample.js'
}
```

Next we need to define the output of the file, when Webpack takes our entry file(s) and does its magic, its going to spit out a new file somewhere:

```javascript
module.exports = {
  entry: './client/js/sample.js',
  output: {
    path: './server/public/mrw/',
    filename: 'app.js'
  }
}
```

With that out of the way, we need to define a "loader". Think of loaders in Webpack as plugins or tasks, we define what we want to happen to our files as they are loaded.  You can configure as many loaders as you want (as you will shortly see) but for now we will just start with a single loader for Babel:

```javascript
module.exports = {
  entry: './client/js/sample.js',
  output: {
    path: './server/public/mrw/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-1', 'react']
        }
      }
    ]
  }
}
```

Finally we need to define a `resolve` section where we declare which file extensions our `import` statements can resolve to when Webpack is doing its lookup:

```javascript
module.exports = {
  entry: './client/js/sample.js',
  output: {
    path: './server/public/mrw/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-1', 'react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['client', 'node_modules']
  }
}
```

So far all we've done is setup the most basic `webpack.config.js` file with a single loader for Babel, some basic configuration for the entry point and output file, and a small Babel specific setting (`resolve`).  Lets give it a test run:

```
$ webpack
Hash: 7fda0f6910c7e38a6402
Version: webpack 1.12.9
Time: 438ms
 Asset     Size  Chunks             Chunk Names
app.js  1.51 kB       0  [emitted]  main
    + 1 hidden modules
```

Awesome no errors!  If you take a look at the directory listing for your project you should now see the `server` directory exists.  Following the path we defined in our `output` section, we can see that `server/public/mrw/app.js` does in fact exist as well!  Take a look at that new file that was generated by Webpack and you should see the following:

```javascript
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
// ...
// ... lots more stuff like this...
// ...
// ...
/***/ function(module, exports) {

	"use strict";

	var collection = [1, 2, 3, 4, 5];
	collection.forEach(function (item) {
	  return console.log(item);
	});

/***/ }
/******/ ]);
```

You can see that Webpack includes its boilerplate module loader code, but then at the very bottom is our transformed JavaScript in nice clean ES5 syntax!

## SASS Stylesheets

Now that Babel is configured and working properly we can focus on getting SASS working as well as the ability to `import` stylesheets right from our modules!

We're going to add another loader, but before we can do that we're going to do a tiny bit of prepwork specifically for our stylesheet support.  At the very top of the `webpack.config.js` file include the following `require` statements:

```javascript
const autoprefixer = require('autoprefixer'),
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      path = require('path')
```

Here we're just defining and including a few `require` modules from our dependencies we installed earlier (with the exception of `path` which is just a standard Node.js module).

Next we need to define an array of loaders we want to use with the `ExtractTextPlugin` module:

```javascript
const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './client')
]
```

The inclusion of `css-loader` allows us to use `import` statements with regular .css files in our React code.  `postcss-loader` will allow us to rely on `autoprefixer` a little later.  Finally the `sass-loader` will let us use .sass files in our `imports` as well.

Now let's setup the actual loader within the `loaders: []` section of our `module.exports` object (add this after the existing object within the array, don't forget the comma!):

```javascript
{
  test: /\.sass$/,
  loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
}
```

Because we're using the ExtractTextPlugin here, we need to configure that separately as well.  After the `resolve` object, we need to define a new `plugins` array:

```javascript
plugins: [
  new ExtractTextPlugin('[name].css')
]
```

Additionally, we should setup a configuration section for `postcss`, specifically indicating that we want `autoprefixer` to run.  Add the following array right below the `plugins` array you just added:

```javascript
postcss: [
  autoprefixer({
    browsers: ['last 2 versions']
  })
]
```

Finally, since we're going to be using `imports` with references to stylesheets, we need to include the appropriate file extensions support within the existing `resolve` section:

```javascript
resolve: {
  extensions: ['', '.js', '.sass', '.css'],
  modulesDirectories: ['client', 'node_modules']
}
```

> _Note:_ I included `.css` as well as `.sass` so that I could include references to regular ol' CSS files as well.  This isn't necessary if you're going to be only using .sass files exclusively.

OK let's take another look at the complete `webpack.config.js` file up to this point:

```javascript
const autoprefixer = require('autoprefixer'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path')

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './client')
]

module.exports = {
  entry: './client/js/sample.js',
  output: {
    path: path.join(__dirname, './server/public/mrw/'),
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-1', 'react']
        }
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  resolve: {
    extensions: ['', '.js', '.sass', '.css'],
    modulesDirectories: ['client', 'node_modules']
  }
}
```

In order to test this new found power let's give it a shot by using an `import` statement referencing a stylesheet right in our existing JavaScript code.  Edit the `client/js/sample.js` file and insert the following:

```javascript
import 'stylesheets/base.sass'
```

Go ahead and create and edit that file and add the following basic SASS code:

```css
body { background-color: #c0c0c0; }
```

With the `sample.js` file now referencing a stylesheet .sass file via an `import` statement, and the `base.sass` file existing within our `client/stylesheets` directory, lets run another build and see if we have success:

```bash
$ webpack
Hash: 9bb18e7dc41bd183469f
Version: webpack 1.12.9
Time: 857ms
   Asset      Size  Chunks             Chunk Names
  app.js   1.69 kB       0  [emitted]  main
main.css  38 bytes       0  [emitted]  main
    + 5 hidden modules
Child extract-text-webpack-plugin:
        + 2 hidden modules
```

Success!  Now, not only is Webpack building our client JavaScript files, but its parsing our files using Babel so that we can use all of the fancy ES2015 code today.  Additionally, we can also use SASS to build our stylesheets and import them in a modular style directly within our JavaScript modules.

You will see just how powerful this method of loading our stylesheets per module is as we start to build out the actual application.

## webpack-dev-server

The `webpack-dev-server` is an optional super basic ExpressJS web server that can serve up your local application files but do so in a way that supports hot reloading.  What this means is that the `webpack-dev-server` will actually store your bundled app files in memory instead of writing to the file system.  Because of this, it can easily swap out the code in the browser in almost real-time as you make changes.

The first thing we need to do before we can use our `webpack-dev-server` is create a simple `index.html` file that will serve up our sample app.  Create and edit the file `server/public/mrw/index.html` and insert the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link href="main.css" rel="stylesheet" type="text/css" />
</head>
<body>
  <script src="app.js"></script>
</body>
</html>
```

When we launch the `webpack-dev-server` we need to instruct it to start at the `server/public/mrw/` path by default (otherwise it will launch from the root of your project):

```bash
$ webpack-dev-server --content-base server/public/mrw/
http://localhost:8080/webpack-dev-server/
webpack result is served from /
content is served from /Users/jasonkrol/git/webpack-demo/server/public/mrw
Hash: c1d795617297c1ff094f
Version: webpack 1.12.9
Time: 685ms
   Asset      Size  Chunks             Chunk Names
  app.js   1.66 kB       0  [emitted]  main
main.css  34 bytes       0  [emitted]  main
chunk    {0} app.js, main.css (main) 205 bytes [rendered]
    [0] ./client/js/sample.js 164 bytes {0} [built]
    [1] ./client/stylesheets/base.sass 41 bytes {0} [built]
Child extract-text-webpack-plugin:
    chunk    {0} extract-text-webpack-plugin-output-filename 1.7 kB [rendered]
        [0] ./~/css-loader!./~/postcss-loader!./~/sass-loader?includePaths[]=/Users/jasonkrol/git/webpack-demo/client!./client/stylesheets/base.sass 195 bytes {0} [built]
        [1] ./~/css-loader/lib/css-base.js 1.51 kB {0} [built]
webpack: bundle is now VALID.
```

Once the dev server launches and is running, point a browser to `http://localhost:8080/webpack-dev-server/`.  You should see a slightly grey screen with a notification across the top with "App ready".  Open the console debugger in your browser and you should see the 5x `console.log` statements that our `sample.js` file had.

With the dev server up and running, you can now make changes to your javascript to your hearts content and the browser will constantly refresh and update based on your changes.

> _Note:_ With our sample.js file since we never directly manipulate the DOM you're probably not going to see any changes directly using this example. This is going to be much more obvious once we start working with actual React.js components!

In the next chapter when we setup our Express web server, I will show you how to tweak the `webpack-dev-server` so that it can run side by side with our own Express server.

## ESLint Preloader

The last step we want to take care of is to configure a "preloader" in Webpack. In our case, we want to run ESLint to ensure that all of our JavaScript code is clean, legit, and free of any syntax errors.  We want this to run first because if there are any errors, we don't want Webpack to even bother with the rest of the processing (i.e. Babel etc).

Edit the `webpack.config.js` file and before the `loaders` section lets add a new section for `preLoaders` with the following snippet of code:

```javascript
preLoaders: [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'eslint-loader'
  }
],
```

ESLint typically relies on a project specific `.eslintrc` file that contains all of the rules unique to your project.  We should configure Webpack so it knows to use our custom `.eslintrc` file.  Insert the following snippet anywhere within the root level of the main configuration object (ideally after the `plugins`, `postcss`, or `resolve` sections):

```javascript
eslint: {
  configFile: '.eslintrc'
}
```

Last but not least, lets include our actual `.eslintrc` file.  Create and edit that file now and insert the following code:

```json
{
  "parser": "babel-eslint",
  "rules": {
    "indent": [2,2, {"VariableDeclarator": 2, "SwitchCase": 1}],
    "quotes": [
      2,
      "single"
    ],
    "linebreak-style": [
      2,
      "unix"
    ],
    "semi": [
      2,
      "never"
    ],
    "react/prop-types": 1,
    "react/no-multi-comp": 1,
    "no-unused-vars": [2, {"args": "after-used", "varsIgnorePattern": "^React"}]
  },
  "env": {
    "es6": true,
    "browser": true,
    "commonjs": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "ecmaFeatures": {
    "modules": true,
    "jsx": true,
    "experimentalObjectRestSpread": true
  },
  "plugins": [
    "react"
  ]
}
```

> _Note:_ These are my specific rules and your opinion and mileage may vary.  However this is a good starting point. Feel free to look into the ESLint documentation on the seemingly unlimited options available to customize your own.

With our ESLint preLoader all setup, lets purposefully include a few errors in our `sample.js` file and make sure Webpack is properly catching them during processing. Edit `sample.js` now and include the following additional code:

```javascript
let a = 1,
b = 2;

let str = "no doubles?!";
```

With those few additional lines, we're going to get a whole bunch of "errors/warnings" now when we ESLint our code:

```bash
$ webpack
// ...

ERROR in ./client/js/sample.js

/Users/jasonkrol/git/webpack-demo/client/js/sample.js
  3:29  error  Extra semicolon                                         semi
  4:28  error  Unexpected console statement                            no-console
  4:46  error  Extra semicolon                                         semi
  6:5   error  "a" is defined but never used                           no-unused-vars
  7:1   error  Expected indentation of 4 space characters but found 0  indent
  7:1   error  "b" is defined but never used                           no-unused-vars
  7:6   error  Extra semicolon                                         semi
  9:5   error  "str" is defined but never used                         no-unused-vars
  9:11  error  Strings must use singlequote                            quotes
  9:25  error  Extra semicolon                                         semi

✖ 10 problems (10 errors, 0 warnings)
```

Based on the rules defined within the `.eslintrc` file for the project, the 10 errors above were found in the simple `sample.js` file.  

> _Note:_ Semicolons - love em or hate em.  Theres an ongoing debate in the JavaScript community on wether or not semicolons should be required.  For my `.eslintrc` file I decided to experiment and build the entire app without them.   I have to say I've kind of fallen in love!  Your mileage may vary however, so use that rule at your own risk/peril ;)

## Conclusion

In this chapter we successfully configured Webpack for our project from scratch.  We created a few sample files to get us started and more importantly proved that it all works. We added support for ES2015 by relying on Babel as well as dynamic CSS using SASS.  This chapter was crucial for the upcoming chapters where we will start to build the actual front-end React.js application.
