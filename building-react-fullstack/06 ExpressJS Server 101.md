# ExpressJS Server 101

In this chapter we're going to learn about the fantastic Node.js framework ExpressJS that allows us to create an MVC style web server from scratch with ease.

## Web Server Requirements

Before we write our Express web server, we first need to nail down a basic list of requirements:

 * Serve up dynamic HTML pages as well as static assets (js, css, images, et al)
 * Support user sessions
 * Handle normal, common, mundane server type stuff (cookies, form handling/sanitization, JSON parsing, etc.)
 * Handle a custom list of URL routes for our API

Eventually it will also need to:

 * Connect and query a MongoDB server
 * Handle user authentication via Social Networks (Twitter, Facebook, et al)
 * Handle file uploading and storage

OK so that looks like a lot.  Truth is it's not really that bad.  Most of the mundane "every day" web server tasks we're going to rely on tried and true npm modules as middleware.  Otherwise Express will handle the routes and controllers and we'll use Handlebars to process and render our dynamic HTML templates.

## Dependencies

> _Note:_ This chapter assumes you've completed the previous chapters and continue to work in a project directory that you've already setup and configured.

The first, and most important, dependency we need to install is the Express framework itself:

```bash
$ npm install --save express
```

Next we are going to be relying on a bunch of common middleware modules specifically for Express so let's install those now:

```bash
$ npm install --save express-session express-handlebars 
body-parser cookie-parser method-override morgan multer sanitize-html
```

Since we're going to be working with MongoDB as our preferred database solution, let's get some modules we'll need to connect and work with that:

```bash
$ npm install --save mongoose connect-mongo
```

Finally, we want to use the popular Passport modules to support user authentication via popular social networks:

```bash
$ npm install --save passport passport-facebook passport-twitter 
passport-github2 passport-google-oauth
```

Looks like a lot of stuff!  Don't worry  I will review what each module's responsibilities are as we implement throughout the chapter.

> *Note: You may have noticed that we used the `--save` flag instead of `--save-dev`.  This is because these dependencies are required in order for our server to actually run.  The `devDependencies` are required only specifically during development (i.e. only on a development machine not a production server).*

## Your First ExpressJS Server

Let's get the basics out of the way first.  Let's create a simple disposable ExpressJS server so you can see just how powerful it is and how easy it is to get a web server up and running.  Within your project directory create a `server` directory (if it hasn't already been created via the Webpack build process in the previous chapter).

Here we're going to define the project structure for the web server itself.  Within the `/server` directory you should create the following directories:

```
/server
--config/
--controllers/
----api/
--middleware/
--models/
--public/
----css/
----upload/
--views/
----layouts/
----partials/
```

Within the `/server` directory we're going to have a `server.js` file which will act as the kickstart for the server.  This is the main entry point and the file you will instruct the Node runtime to execute when you want to start the server.  Insert the following code:

```javascript
let express = require('express'),
    app = express(),
    router = new express.Router()

router.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/', router)

app.listen('3300', () => {
  console.log(`Server listening at http://localhost:3300`)
})
```

To run the server, execute the following command:

```bash
$ node --use_strict server/server.js
Server listening at http://localhost:3300
```

> *Note: At the time of writing, the `--use_strict` flag is required when running Node.js apps that use ES2015 code.*

Point your browser to `http://localhost:3300` and you should see "Hello World!" appear on screen.  Congratulations, you just wrote and launched your first Node.js Express web server!

Let's break down the code a bit.  The first few lines of code we require the Express module, define a new `app` variable and a new Express `router`.   Using the new router, define a single route rule for `/` as a HTTP `GET`.  Every Express route accepts 2 parameters, a `request` and `response`.  The request parameter contains all of the information from the browser when it made the GET request to the URL path (route).  The response parameter is what you use to configure the response that gets sent back to the browser.  In our case, all we want to do is simply send pure text response of "Hello World!".

Finally we configure our `app` object to actually use the `router` we created.  Then we instruct our `app` to listen to port `3300`.  The `listen` method accepts a callback and in this case when the callback fires all we want to do is console.log a success message stating that the server is up and listening for requests.

If you notice the `router.get` method accepts a callback.  In this simple example we included the callback as an anonymous function but as our router grows this is going to start to become quite a mess.  Lets solve this problem now by breaking out the callbacks to controller modules.

## Controllers

Controllers are nothing more than the brains that power our web server routes.  Every route (URL path) is going to need to fire a function that processes whatever is supposed to happen for that particular route.  As our routes list gets longer and longer, having all of the logic properly organized via controllers is going to make your live much easier.

Create your first controller by creating the file `server/controllers/home.js` and inserting the following code:

```javascript
module.exports = {
  index(req, res) {
    res.send('Hello World!')
  }
}
```

This code should look familiar.  Now lets adjust the `server.js` file to use the new Home controller instead:

```javascript
let express = require('express'),
    app = express(),
    router = new express.Router(),
    // the following line is new:
    HomeController = require('./controllers/home')

// this line has changed:
router.get('/', HomeController.index)

app.use('/', router)

app.listen('3300', () => {
  console.log(`Server listening at http://localhost:3300`)
})
```

With those changes in place run the server again (`node --use_strict server/server.js`) and you should get the same output as before.

> *While we're at it, that command to execute the node server is getting annoying to type out.  Lets edit the `package.json` file and within the `scripts` block include a new line:*

```json
"scripts": {
  "start": "node --use_strict server/server.js"
}
```

*Now whenever you want to launch the server, simply execute `npm start`.*

## Configuring the Server

Next let's tweak our server files so we can make configuration a little bit cleaner.  Start by creating and editing a `server/configure.js` file and including the following code:

```javascript
// configure.js:
let path = require('path'),
    express = require('express'),
    router = new express.Router(),
    HomeController = require('./controllers/home')

module.exports = function(app, config) {
  if (config === null) { config = {} }

  // configure middleware here:

  app.set('config', config)

  router.get('/', HomeController.index)
  app.use('/', router)

  return app
}
```

You might notice that some of this stuff looks the same from the `server.js` file we already created.  You are correct - lets go ahead and cleanup our `server.js` file now to remove that duplicate code and introduce our `configure` module:

```javascript
// server.js:
let express = require('express'),
    app = express(),
    router = new express.Router(),
    configure = require('./configure')

app = configure(app)

app.listen('3300', () => {
  console.log(`Server listening at http://localhost:3300`)
})
```

The changes we made include removing the controllers references as well as anything having to do with the `router` (since thats all been moved to our `configure` module).  Give it another spin and all should be working the same as before.

Since we're going to have many controllers, not just one for the Home, I think now is a good time to use an index module for our controllers to make things a little easier in the future.  Create and edit the `server/controllers/index.js` file and include the following code:

```javascript
// controllers/index.js:
module.exports = {
  home: require('./home')
}
```

So far so good, but I think we could refactor a tiny bit more to make things a little better organized once the server starts growing in the near future.  Lets take the `router` stuff and pull it out to its own module as well.  Create and edit the `server/routes.js` file and include the following:

```javascript
// routes.js:
let controllers = require('./controllers')

module.exports.initialize = function(app, router) {

  router.get('/', controllers.home.index)

  app.use('/', router)
}
```

In addition, we need to refactor the `configure.js` file to support these new changes:

```javascript
// configure.js:
let path = require('path'),
    express = require('express'),
    routes = require('./routes')

module.exports = function(app, config) {
  if (config === null) { config = {} }

  // configure middleware here:

  app.set('config', config)

  routes.initialize(app, new express.Router())

  return app
}
```

At this point the server is starting to come together.  Let's continue by introducing some middleware and taking care of some general housekeeping configuration.

## Middleware

Middleware serves a very important role in our web server. We rely on middleware to do most of the heavy lifting and grunt-work we just don't want to even think about.  Its called middleware, surprisingly enough, because it sort of lives in the middle layer of your server - between the kick starting of the server itself and the response handling.  We want our server to do things like handle cookies, parse JSON requests and responses, handle form submissions, etc.  We don't want to have to think about or worry about how this stuff works - we just want it to work!

Shockingly enough we're going to configure all of our middleware within the `configure.js` module.

First lets create a middleware index module that will keep things a little more organized.  Create and edit the `server/middleware/index.js` file and include the following code:

```javascript
// server/middleware/index.js:
module.exports = {
  bodyParser:     require('body-parser'),
  cookieParser:   require('cookie-parser'),
  exphbs:         require('express-handlebars'),
  methodOverride: require('method-override'),
  morgan:         require('morgan'),
  multer:         require('multer'),
  session:        require('express-session')
}
```

All we've done here is include all of the npm module dependencies we installed earlier at the beginning of the chapter.  Each will be explained shortly.

Next lets edit `configure.js` and start including and setting up some of these middleware.  

> _Remember to `require` the new middleware module at the top of `configure.js` using `middleware = require('./middleware')`_

Each of the following snippets of code will be included after the `// configure middleware here:` line.

### express-session

We want our users to be able to have sessions - i.e. remember who they are from screen to screen as they use our app.  With this we rely on the `express-session` middleware module.  For now its configured with some basic settings.  Sessions will be lost every time the server is restarted since we're not persisting session information anywhere.  Once we configure MongoDB in the next chapter this problem will be solved.

```javascript
// configure middleware here:
app.use(middleware.session({
  secret: 'SECRETHERE',
  resave: false,
  saveUninitialized: false
}))
```

### express-handlebars

Since we're going to want to render something a little more impressive than "Hello World" to the browser when our server responds, we need to configure HTML rendering support. For this we rely on the popular Handlebars view rendering engine:

```javascript
app.set('views', __dirname + '/views')
var hbs = middleware.exphbs.create({
  extname: '.html',
  defaultLayout: 'layout',
  layoutsDir: app.get('views') + '/layouts',
  partialsDir: [app.get('views') + '/partials']
})
app.engine('html', hbs.engine)
app.set('view engine', 'html')
```

We configure the Handlebars middlware by defining the default layout file, layouts and partials directory paths, etc.  Finally we set the `view engine` property for our app to support `html` files.

### morgan

Morgan is a simple logging utility middleware that allows our server to render nice activity log statements as requests come in.

```javascript
app.use(middleware.morgan('dev'))
```

### body-parser

The body-parser module allows for easy parsing of submissions to our server.  Any time a form, querystring, or json payload is included with a request, it will be made available because of this module.

```javascript
app.use(middleware.bodyParser.urlencoded({ extended: false }))
app.use(middleware.bodyParser.json())
```

### method-override

This module is for some older browser support which lets us rely on HTTP verbs like PUT and UPDATE where they might not be supported otherwise.

```javascript
app.use(middleware.methodOverride())
```

### cookie-parser

The cookie-parser module does exactly what it sounds like, lets us receive and parse cookies from the browser in an easy to use way that makes our lives easier.

```javascript
app.use(middleware.cookieParser('SECRETHERE'))
```

### express.static

Express has a builtin method that supports serving up static asset files like css, javascript, images, plain text, html files, etc.  Besides the dynamic HTML page templates that we want to render, and our JSON API responses, we do need our server to be able to just "serve" plain ol files whenever we need them. In our case, we're going to server all generic asset files from a root `public/` path.  What this means is that any file stored witnin `server/public/**/*.*` will get served to the browser as-is - no need to predefine specific routes, or worry about anything.

```javascript
app.use('/public/', express['static'](path.join(__dirname, './public')))
```

With all of the middleware configured and out of the way, relaunching your server should continue to function exactly as it did before.  Once tiny exception you might notice is that when you refresh the page in your browser, your server is now logging HTTML requests as they occur (thanks to `morgan`):

```bash
$ npm start

> node --use_strict server/server.js

Server listening at http://localhost:3300
GET / 304 5.339 ms - -
GET / 304 1.051 ms - -
GET / 304 0.796 ms - -
```

## HTML View Rendering

Now that configuration and middleware is out of the way, let's focus on rendering actual HTML content.  So far we've only been sending a pure text response of "Hello World". Create and edit a simple HTML file `server/views/home.html` that we will return for the homepage:

```html
<!DOCTYPE HTML>
<html lang="en">
  <head>
    <title>My First Website</title>
    <link href="/public/css/main.css" rel='stylesheet' type='text/css' />
  </head>
  <body>
    <h1>Hello {{place}}!</h1>
  </body>
</html>
```

The first thing you should notice is the inclusion of `{{place}}` which is how we render dynamic content using Handlebars.  In this case place is going to be a simple variable with a value that we will define via our "view model".

Next edit `server/controllers/home.js` and change the `index` method to the following:

```javascript
// server/controllers/home.js:
module.exports = {
  index(req, res) {
    let viewModel = {
      layout: false,
      place: 'Earth'
    }
    res.render('home', viewModel)
  }
}
```

A few things to note here.  First we declare a simple JavaScript object that will act as the model for our homepage view.  This model has to key/values: `layout: false` which just indicates that the HTML file being rendered doesn't require the global layout file to be wrapped around it.  Second we define our own custom name for `place` with a value of `Earth`.  The `place` key in the model object will map 1:1 with the `{{place}}` in our actual HTML template file.

We also changed `res.send` to `res.render` that includes to Express that we're rendering an HTML file and that it should use the view rendering engine defined in our `configure` module when the app is kick started.  The first parameter to `render` is the filename (without the `.html` extension since we defined this in our configuration so its not necessary here). The second parameter is the view model itself.

> _Note: Your view model can be as complex as you want, and rightfully so if you plan to render a very dynamic HTML page!_

With these changes in place, relaunch your server and open the url in a browser and you should now see a nice fancy HTML page with "Hello Earth!" rendered in large H1 bold glory!

## Conclusion

At this point your server is fully operational.  We've organized and refactored the code in such a way that we can continue to expand our controllers, routes, and configuration and not worry about any of the code getting too bloated.  We've got all of the necessary middleware configured and doing their thing. We're rendering dynamic HTML pages via Handlebars and well on our way!

Next up we will focus on getting our server working with MongoDB and not only connecting to the database server but querying and returning data responses with our HTML pages and JSON endpoints.
