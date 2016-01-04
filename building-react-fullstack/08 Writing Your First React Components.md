# Writing Your First React Components

With our Express web server in a pretty solid state we're ready to move on to writing our first React components for the front-end application.

## Dependencies

Before we can even start to write any React code, we need to first include it as a dependency for the project.

```bash
$ npm install --save react react-dom react-router
```

...

## App Component

Typically the first component for pretty much any front-end application is going to be your `App` and acts as a sort of root level container/shell to kick off the entire application.

Let's go ahead and create our first React component now and then break it down line by line and make sure we really understand what's going on.  

Create and edit the file `client/js/components/App.js`:

```javascript
import React, { Component } from 'react'

class App extends Component {
  render() {
    return (
      <div>
        <h1>MRW.lol</h1>
        
        <div className="body">
          <p>Hello World!</p>
        </div>
      </div>
    )
  }
}

export default App
```

Explain the above component...

### Mounting to the DOM

With App component created, it's not going to be able to do much until we actually mount it to the DOM.  This is where ...

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(<App />, document.getElementById('app'))
```


### Update Webpack Entry File

Before we can give new component a spin, we need to adjust our `webpack.config.js` file to point to our `main.js` file instead of the original `sample.js` file from chapter 5:

```javascript
module.exports = {
  entry: './client/js/components/main.js',
```


