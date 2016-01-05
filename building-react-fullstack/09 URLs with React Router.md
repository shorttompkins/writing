# URLs with React Router

So far our app consists of the `App` and `Header` components but doesn't really do a whole lot other than display some HTML rendered to the screen.  The foundation of any good single-page-application is the ability to render "pages" or sections within the app as well as preserve those sections via unique URLs. This ties back to the birth of the Internet and how its "all supposed to work".  If I goto `yourwebsite.com/path/to/some/page` then I expect to arrive precisely there!

In order to achieve custom URL routing within our React app, we need to rely on the `react-router` module which lets us define URL specific routes as well as any actions to perform when that route is loaded and a component to render.

## Dependencies

The first thing we need to do is include the `react-router` dependency in our project:

```
$ npm install --save react-router
```

## Router

The way the router will work in our app is that any time a matching URL is loaded from the browser, our router will check and see which component we want to render.  That component will get rendered inside our `App` module as the primary child.  This way we can consider each "screen" or page in our app to correspond directly to a specific component we define.

Start by first defining a router and the first route.  Edit the `client/js/main.js` file and replace it with the following code:

```javascript
// client/js/main.js: 

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import App from './components/App'

ReactDOM.render((
  <Router>
    <Route path="/" component={App}>
        // define routes list here...
    </Route>
  </Router>
), document.getElementById('app'))

```

First we included a new `import` statement that incudes `Router`, `Route`, and  `IndexRoute`.  Next we completely changed the first parameter of the `ReactDOM.render()` function call and included some JSX with a `Router` component.

The `Router` will act as a gateway, and constantly monitor the URL of the browser with regard to our web application.  Whenever it detects changes to the URL path its going to lookup against its known list of `Routes` and if there is a match, it will respond accordingly.

The `Router` component has a *child* `Route` component that has a root path defined (the root URL path for our homepage) as well as what component we want loaded when that path is matched.  For every unique URL we want to define in our application, we need to include a child `Route` component with the corresponding `path` and `component` values set. 

Since we want our `App` component to act as a global container/shell for our application, we can nest `Routes`.  In this instance, we're going to only have a single `Route` defined for `path="/"` that will always load our `App` component, and then every subsequent URL path we define will be a child of the `App` component route.

## IndexRoute

With the `App` component `Route` defined for `/` let's now include a child `IndexRoute` that will be the actual page component that gets loaded when the URL matches the path of its parent.  Include the following line of code replacing `// define routes list here...`:

```javascript
// client/js/main.js:

ReactDOM.render((
  <Router>
    <Route path="/" component={App}>
        <IndexRoute component={ImagesList} />
    </Route>
  </Router>
), document.getElementById('app'))
```

We need to make sure to import the `ImagesList` component inside the `main.js` file:

```javascript
import ImagesList from './components/images/ImageList'
```

Let's also create a quick placeholder for the `ImageList` component.  Create and edit the `client/js/components/images/ImagesList.js` file with the following code:

```javascript
// client/js/components/images/ImagesList.js:

import React, { Component, PropTypes } from 'react'

class ImagesList extends Component {
  render() {
    return (
      <div>
        <div className="images">
          List of Images will appear here...
        </div>
      </div>
    )
  }
}

export default ImagesList
```

The last thing we need to do to wireup our new router is instruct the `App` component to render any children components it receives (as our router will always include the child route component every time a new route is rendered.  Edit the `client/js/components/App.js` file and update the `render` function with this slightly newer version:

```javascript
static propTypes = {
  children: React.PropTypes.node
}

render() {
  return (
    <div>
      <Header />

      <div className="body">
        {this.props.children}
      </div>
    </div>
  )
}
```

The only thing we included was a direct rendering of `{this.props.children}`.  The `component` property we define for each `Route` within our router will actually be passed to the `App` component as a `children` prop collection.

With our new `ImagesList` component created, a route defined in our Router for `/`, our `App` component including any children components, and everything wired up - lets run another webpack build and open the `index.html` file in a browser.

If everything was successful, you should see the same site you've successfully been running from the previous chapter, but this time with "List of Images will appear here..." as well.

## Additional Routes

Let's create another route and test multiple URLs. First create a copy of the `ImagesList` component and name it `Image.js` and use the following code:

```javascript
// client/js/components/images/Image.js

import React, { Component, PropTypes } from 'react'

class Image extends Component {
  render() {
    return (
      <div>
        <div className="image">
          Image details will appear here...
        </div>
      </div>
    )
  }
}

export default Image
```

Now let's include a new URL route within `main.js` for the path of `/image/:id`:

```javascript
// client/js/main.js:

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import App from './components/App'
import ImagesList from './components/images/ImagesList'
import Image from './components/images/Image'      // <- new!

ReactDOM.render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={ImagesList} />
      <Route path="image/:id" component={Image} /> // <- new!
    </Route>
  </Router>
), document.getElementById('app'))
```

Here we defined an additional `Route` child component.  What this means is that our `App` component will load every time because every route within our app will start with `/`.  Additionally, if the route path also matches the path we defined via `image/:id` then we will also load the `Image` component and pass that to the `App` component via its `props.children` collection.

## Link Component

The `react-router` module includes a number of new components, one of which is the `Link` component.  We can use the `Link` component to easily create anchor tags that create links to our URL routes.

Let's edit the `ImagesList` component and create a link to the image details screen (our `Image` component).  Edit `client/js/components/images/ImagesList.js` and update the `render` function as follows:

```javascript
// client/js/components/images/ImagesList.js:

render() {
  let imageId = '123abc456def'
  return (
    <div>
      <div className="images">
        List of Images will appear here...<br/>
        <Link to={`/image/${imageId}`}>View image details</Link>
      </div>
    </div>
  )
}
```

Now when you build the app and open it in the browser, the `ImagesList` that renders on the homepage should have a link to the details URL.  Click that link and your new `Image` component should be loaded (i.e. "Image details will appear here..." should appear.).  The back button in your browser should work as normal.

> *Note:  You can reload the page when you're on a specific route (URL path) and the app should load directly to that screen as expected.  Like I said earlier in the chapter - it's "all supposed to work"!  That means the URL should behave the way we've come to expect regardless that our app is a single-page-application.*

## Remaining Routes and Placeholders

With our router fully functional, lets go ahead and setup the remaining routes for our app as well as placeholder components for each route.  Most of this will all be boilerplate code that will be incrementally replaced and iterated on throughout the remaining chapters.

First let's define the remaining routes within the router.  Edit `client/js/main.js` and include the following `Routes` after the main `IndexRoute`:

```javascript
<Route path="users/:userid" component={ImagesList} />
<Route path="images/:tag" component={ImagesList} />
<Route path="users/:userid/:tag" component={ImagesList} />
<Route path="image/add" component={AddImage} />
<Route path="image/add/:id" component={AddImage} />
```

Savy readers will notice that the first three routes all use the same component.  This is because we will be passing different sets of filtered data to our `ImagesList` component but always rendering a "list of images".  Keep it DRY right!  Since we refer to an `AddImage` component, we need to make sure to create that component as well as import it our `main.js` file.

Create and edit `client/js/component/images/AddImage.js` and include the following boilerplate placeholder code:

```javascript
// client/js/components/images/AddImage.js:

import React, { Component, PropTypes } from 'react'

class AddImage extends Component {
  render() {
    return (
      <div>
        <div className="image">
          Add a new image here...
        </div>
      </div>
    )
  }
}

export default AddImage
```

## Conclusion

Now that we have a solid understanding of the `react-router` module and how it benefits the navigation and organization of our app, its time to take a minor detour.  Eventually our app will need to grow beyond simple DOM components and extremely basic events.  We're going to need to make AJAX calls to our web server API, process async responses and promises, and deal with dynamic JSON data. Its time to learn all about the React inspired pattern called Flux and how it will benefit our app and usher in a new paradigm in single-page-application development.
