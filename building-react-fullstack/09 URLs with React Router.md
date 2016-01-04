# URLs with React Router

So far our app consists of a single `App` component but doesn't really do a whole lot other than display some HTML rendered to the screen.  The foundation of any good single-page-application is the ability to render "pages" or sections within the app as well as preserve those sections via unique URLs. This ties back to the birth of the Internet and how its "all supposed to work".  If I goto `yourwebsite.com/path/to/some/page` then I expect to arrive precisely there!

In order to achieve custom URL routing within our React app, we need to rely on the `react-router` module which lets us define URL specific routes as well as any actions to perform when that route is loaded and a component to render.

## Dependencies

The first thing we need to do is include the `react-router` dependency in our project:

```
$ npm install --save react-router history
```

Additionally we included the `history` module so that we can use HTML5 browser history mode with our routes (i.e. real URLs not hash based URLs).

## Router




