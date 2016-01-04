# Writing Your First React Components

With our Express web server in a pretty good state we're ready to move on to writing our first React components for the front-end portion.

## Dependencies

Before we can even start to write any React code, we need to first include it as a dependency for the project.

```bash
$ npm install --save react react-dom
```

Obviously the most important dependency we need is `react` but along with that we also need `react-dom` (which was introduced with React version 0.14).

## App Component

Typically the first component for pretty much any front-end application is going to be your `App` and acts as a sort of root level container/shell to wrap off the entire application.

Let's go ahead and create our first React component now and then break it down line by line and make sure we really understand what's going on.  

Create and edit the file `client/js/components/App.js`:

```javascript
import React, { Component } from 'react'

class App extends Component {
  render() {
    let myvar = this.props.place
    
    return (
      <div>
        <h1>My First React Component</h1>
        
        <div className="body">
          <p>Hello {myvar}!</p>
        </div>
      </div>
    )
  }
}

export default App
```

The first and most important thing is to `import` React and React.Component (using ES2015's destructuring syntax) as variables we can then use in our code.  Next we create our own `App` class that extends the React.Component core class.

The only function we included in our definition of our `App` class is the `render` function.  This function returns JSX which contains our HTML.  If you notice in our HTML, we use React JSX syntax to "merge" in our dynamic variable of `myvar`.  This is very similar to how Handlebars works.

Notice that we include a variable declaration `let myvar` that references `this.props.place`.  `this.props` is how you reference the HTML properties/attributes of a React component. When you use the `App` component, you could do so using `<App place="this" something="that" />` and the properties `place` and `something` would be under the `this.props` collection.

Finally, because we want to be able to `import` this component elsewhere in our code, we need to be sure to `export` it.

> #### What is JSX?
> JSX is React's version of a hybrid JavaScript/HTML combo.  You can use most general JavaScript within your HTML markup (or HTML markup in your Javascript).  This includes variables, loops (for, etc), etc.  One thing you can't do is use normal `if` statements.  For this you need to use tertiary statements (`{myvar ? 'show this if true' : 'else this if false}`).

### Mounting to the DOM

With our App component created, it's not going to be able to do much until we actually mount it to the DOM.  This is where `react-dom` comes in.  We need a way to "inject" our App component into the DOM of the page somehow.  For this let's create and edit `client/js/main.js` and insert the following code:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

const body = document.getElementsByTagName('body')[0]

ReactDOM.render(<App place="World"/>, body)
```

With this basic snippet of code, we import the React and ReactDOM modules and execute `ReactDOM.render` passing in first a reference to our App component and second the DOM element we want to inject our rendered HTML into (in this case, the `body` tag).  If you recall from the earlier chapter we created the `server/public/mrw/index.html` file.

Its important to note that the first parameter of `ReactDOM.render` is JSX so it accepts actual HTML.  In this case we're using HTML (JSX) to reference our `App` component and also including the property `place` which our component will use when rendering the text "Hello World".

### Update Webpack Entry File

Before we can give our new component a spin, we need to adjust our `webpack.config.js` file to point to the `main.js` file instead of the original `sample.js` file from chapter 5:

```javascript
module.exports = {
  entry: './client/js/main.js',
```

With the above change in place, go ahead and run the `webpack` command again to rebuild the app.  Once built, open the `server/public/mrw/index.html` file in your browser and you should see the rendered HTML successfully.

> #### Webpack in watch mode
> If you want to run webpack in continuous watch mode, simply include the `-w` flag when you execute it: `$ webpack -w`
> This will execute the initial build, and then sit and wait for any changes to occur to any files affected in the chain starting with the entry file.  If you make any changes and save the file, webpack will instantly rebuild!

## Header Component

Let's build our first child component which we will use within the `App` component.  Start by creating and editing `client/components/layout/Header.js` and inserting the following code:

```javascript
import React, { Component, PropTypes } from 'react'

class Header extends Component {
  static propTypes = {
    title: PropTypes.string
  }
  
  render() {
    return <h1>{this.props.title}</h1>
  }
}

export default Header
```

A few new things are in this `Header` component.  First we included a reference to `React.PropTypes` because React typically expects all props that are expected to be predefined.  We define them via a `static` property on our component class.  We didn't include this in the `App` component even though it's technically required, and you might have noticed a warning in the webpack output when you ran the build.

Our render function looks similar, although since we're returning pretty simple JSX we could do so in a single line without the need to wrap with `( )`.  

Let's now use this new `Header` component within our `App` component.  Edit `client/js/components/App.js` and change it to look like the following:

```javascript
import React, { Component } from 'react'
import Header from './layouts/Header'  // <- new!

class App extends Component {
  static propTypes = {  // <- new!
    place: React.PropTypes.string
  }

  render() {
    let myvar = this.props.place

    return (
      <div>
        // the following line is new: 
        <Header title="My First React Component" />

        <div className="body">
          <p>Hello {myvar}!</p>
        </div>
      </div>
    )
  }
}

export default App
```

The first thing we changed was the inclusion of the `import` statment for our new `Header` component.  Next we used the `Header` component by replacing the original `<h1>...</h1>` line with a `<Header title="..." />` tag.

## Component Events

Let's adjust the Header component to include an `onClick` event to demonstrate events with React.  What we'd like to do is have it so that if you click the `H1` tag anywhere, a simple `console.log` will fire.  The first step is to define a function within our component class that will execute when the `onClick` occurs.  Then we reference that function in the `onClick` property for the `H1` tag.  Edit `client/js/components/layout/Header.js` and make the following changes:

```javascript
class Header extends Component {
  constructor() {
    super()
    this.clickLogger = this.clickLogger.bind(this)
  }
  
  static propTypes = {
    title: PropTypes.string
  }
  
  clickLogger() {
    console.log(this.props.title)
  }
  
  render() {
    return <h1 onClick={this.clickLogger}>{this.props.title}</h1>
  }
}

export default Header
```

A few new tricks have been introduced with these changes. First we relied on the `constructor` function of our component class.  Since we're declaring a new custom function on our class, we need to ensure that the function is properly bound to `this` (it won't be by default) since its extending a `React.Component` class that has no knowledge of `clickLogger()`.  The way we do this is by executing a `.bind(this)` on the function and reassigning itself.  Then we can safely refer to `this` within the function (to get access to `this.props.title` for example).

Additionally, we included `onClick={this.clickLogger}` directly on the `H1` tag.

What if we wanted the `onClick` of the `H1` to execute a function that belongs to a parent component?  We can pass in functions with the component props just like we can simple string values.  Let's adjust this example to see this in action.

First add a function that you want the `Header` component to be able to receive and call from the `App` component.  Edit `App.js` and include the following:

```javascript
megaLogger(message) {
  console.log(message)
}
```

Additionally, within `App.js` change the `<Header .../>` tag to include a reference to that function:

```javascript
<Header title="My First React Component" logger={this.megaLogger}/>
```

Now within the `Header` component, it will receive an additional prop of `logger`.  Lets make sure we're expecting that within our `static propTypes` definition as well as actually use it within our existing `clickLogger`:

```javascript
// client/js/components/layout/Header.js:

  static propTypes = {
    title: PropTypes.string,
    logger: PropTypes.func    // <- this is new
  }

  clickLogger() {
    this.props.logger(this.props.title)  // <- this was changed
  }
```

This small yet powerful example should give you a pretty good idea of just how flexible React components can be.

> #### ES2016 Autobinding Class Functions with Property Initializers
> One thing I'd like to point out is that pesky `.bind()` call within the `constructor` of our component class.  This is a necessary evil to ensure that any custom functions we attach to our class are properly bound to `this`.  There is, however, a shortcut we can use that's actually a part of ES2016.  Basically using the fat arrow `=>` syntax to define the class function like so:
>
> ```javascript
> clickLogger = () => {
>   this.props.logger(this.props.title)
> }
> ```
> With the above change in place, we can completely eliminate the need for `this.clickLogger = this.clickLogger.bind(this)` within the constructor as the fat arrow is effectively doing the same thing!

## Component State

In addition to events, you're inevitiably going to want to manage some kind of state for your component.  This could be something as simple as a toggle state for a checkbox or show/hide state for an accordion etc.  To manage state simply use a component's `this.state` object and define your own key/value pairs.

Let's ajust the `clickLogger` within `Header` to count the number of times a message was logged and display that counter in our rendered `H1` tag:

```javascript
// client/js/components/layout/Header.js:

  constructor() {
    super()
    this.clickLogger = this.clickLogger.bind(this)
    this.state = { clickCounter: 0 }  // <- new!
  }
  
  clickLogger() {
    // the following line is new:
    this.setState({ clickCounter: this.state.clickCounter + 1 })
    this.props.logger(this.props.title)
  }
  
  render() {
    return (
      <h1 onClick={this.clickLogger}>
        {this.props.title}: {this.state.clickCounter} // <- new!
      </h1>
    )
  }
```

Two things: first we initialize a state object with a single key/value for `clickCounter` to `0` within our `constructor`.  Next we executed `this.setState` and passed in a **new** object to represent the updated/changed state.  It's very important to understand that the state within a component should never just change, but instead always be replaced with a changed version using `setState` (component state is considered Immutable).  This is what will cause `render` to refire (when React notices that a components state has changed).

## Component Lifecycle

One important thing to take note with the state example above, once we used `setState` to change our component's state, the `render` function was automatically fired.  At first glance when viewing the live demo, this might appear as 2-way databinding similar to Angular or other frameworks.  It is not.  Every React component has a specific lifecycle and fires certain events based on certain criteria.  The example above caused the `render` function to fire because its state was changed.

Here is a core list of lifecycle methods that exist for a React component:

Function  | Description
------------- | -------------
**`componentWillMount`** | Before `render`. Best used for initialization
**`render`** | Render JSX to pure HTML
**`componentDidMount`** | Successfully injected HTML into the DOM.  Best time to wire up jQuery plugins etc (as DOM nodes are available)
`componentWillUpdate` | Called right before additional `render` calls as a result of state change etc.
`shouldComponentUpdate` | Return `false` if you determine that no update is necessary (i.e. skip firing `render`)
`componentWillReceiveProps` | Before render, fired if a component receives any new  `props` (i.e. via changes to its parent component etc.)
`componentDidUpdate` | Fired immediately after subsequent `render`s that were the result of updates
`componentWillUnmount` | Cleanup.  Fires when a component is destroyed.  Good time to kill listeners.

I highlighted the first 3 as I feel they are the most important and likely the ones you will use most often. This list is "sort of" in the order that the events occur as well.

## Final Code

I'm going to slightly tweak our `Header` and `App` components to be closer to what we're going to want in our final application.  It's going to implement some minor changes, but nothing we haven't reviewed already in this chapter.  Edit the `client/js/components/layout/Header.js` file and replace it with the following code:

```javascript
// client/js/components/layout/Header.js:

import React, { Component, PropTypes } from 'react'

class Header extends Component {
  tagSearch = () => {
    console.log(`tag search for: ${this.refs.tag.value}`)
    this.refs.tag.value = ''
  }

  addImage = () => {
    console.log('goto: /image/add')
  }

  inputEnter = (event) => {
    if (event.key === 'Enter') {
      this.tagSearch()
    }
  }

  render() {
    return (
      <div className="header">
        <h1>
          <a href="#">MRW.lol</a>
        </h1>

        <div className="main-search">
          <div className="input-group">
            <input type="text" 
                   className="input" 
                   ref="tag" 
                   placeholder="Search..." 
                   onKeyPress={this.inputEnter} />
            <button type="button" 
                    className="button" 
                    onClick={this.tagSearch}>
              <i className="fa fa-search"></i>
            </button>
          </div>
          <button type="button" 
                  onClick={this.addImage} 
                  className="button add-button">
            <i className="fa fa-plus"></i> Add Image
          </button>
        </div>

        <a href="#">Login | Register</a>
      </div>
    )
  }
}

export default Header
```

> #### `this.refs`
> One thing to note with the new version of the Header component, is the use of the `this.refs` collection.  The component's `refs` collection is a custom collection of DOM elements that you define by simply including a `ref=""` property to any HTML tag within the `render` function.  You can see we included a text input field and gave it a `ref` of `tag`.  This way, within our component functions we can simply refer to `this.refs.tag` to get a "reference" to that element.  Then we can use `this.refs.tag.value` to get the text field's value string.

The `tagSearch` and `addImage` functions are both just placeholders for now that we will update in upcoming chapters.

Since we removed some of the sample functionality in this new `Header` component, go ahead and update `App.js` and change the existing `<Header ... />` reference to just simply `<Header />`:

```javascript
// client/js/components/App.js:

import React, { Component } from 'react'
import Header from './layout/Header'

class App extends Component {
  static propTypes = { }

  render() {
    return (
      <div>
        <Header />

        <div className="body">

        </div>
      </div>
    )
  }
}

export default App
```

Once last piece of housekeeping left - you may have noticed in your browser's console that React was throwing warnings:

> Warning: render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.

They're right!  For the sake of simplicity and sample demonstration code I had you do that.  Let's change that for the better.  First edit `server/public/mrw/index.html` and include a new `div` following directly after the `body` tag:

```html
// server/public/mrw/index.html:

<body>
  <div id="app"></div>   <!-- new! -->
  <script src="app.js"></script>
</body>
```

Next edit `client/js/main.js` and change the `ReactDOM.render()` to the following:

```javascript
// client/js/main.js:

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

ReactDOM.render(<App />, document.getElementById('app'))
```

## Styles

If you run your app again, you might notice that it doesn't look great.  As a matter of fact it looks awful!  Let's address that by including a few stylesheets.

First edit `client/js/components/App.js` and import the base stylesheet as follows:

```javascript
import 'stylesheet/base`
```

Since the `App` component acts as our shell or container component, we'll want to include any "global" styles within the `base.sass` file.

Next edit the `Header` component file `client/js/components/layout/Header.js` and include the following import statement:

```javascript
import 'stylesheets/components/layout/header`
```

Since we haven't yet created that file, go ahead and create `client/stylesheets/components/layout/header.sass`.  Include any styles you want here to visually clean up the `Header` component.  Refer to the source code for this chapter if you want to use the stylesheets I defined.
> *Note: For the sake of brevity, the stylesheets are not included as text in this chapter.*

Note that I try to keep the organization of my `components` folders identical between `client/js` and `client/stylesheets` since I want my components and their stylesheets to have a 1:1 relationship.

> #### FontAwesome.io
> You might have noticed that I had a few odd classNames in my Header component. That's because I'm relying on FontAwesome which is a font icon library.  You can include a reference to FontAwesome by visiting it's website and downloading the CSS file.  Alternatively you can use a CDN hosted file by heading over to [BootstrapCDN.com/fontawesome](http://BootstrapCDN.com/fontawesome)

## Conclusion

We covered a lot of ground this chapter so let's take a step back and review:

 * You created your first React components with `App` and `Header`!
 * You learned about React's `Component` class, a component's `this.props` and `this.state` and how to work with each.
 * You learned about the lifecycle of React components.
 * You created and included component specific stylesheets.
 * You created and established the base for the front-end portion of the application.

In the next chapter we will iterate a bit more and introduce React Router so that we can load a specific component for each URL in our app.
