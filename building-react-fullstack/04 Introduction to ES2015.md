# Introduction to ES2015

## Welcome to the next version of JavaScript

People have been complaining about JavaScript for what seems like forever.  Finally we can all breath a sigh of relief as changes are incoming!  ES2015 (or ES6 depending on who/when you ask) is the next version of JavaScript and has all kinds of goodies that we’re going to take a look at this chapter.

While most evergreen browsers are slowly adding support for more and more ES2015 features every day, it's important to understand that ES2015 is definitely not ready for prime time.  But that's ok, we’re not going to let that stop us because we’re going to use Babel to "transpile" our code into fully functional ES5 code!  What this means is that we can write ES2015 code today, and know it will work in every browser because it's going to be transformed into fully functional JavaScript that everyone (and every browser) is used to.

How this works is basically a tool called [**Babel**](http://babeljs.io) goes through your code and looks for any and all ES2015 code and translates it into the equivalent version that works using ES5.  Here's a simple example:

```javascript
Models.Image.find({}, (err, images) => {
  let myVar = 'testing 1 2 3';
  res.json(images);
})
```

The above ES2015 code will be translated to something you’re maybe a little more familiar with (i.e. ES5):

```javascript
Models.Image.find({}, function(err, images) {
  var myVar = 'testing 1 2 3';
  res.json(images);
})
```

The differences are minor (highlighted), and this is a pretty basic example, but you should get the idea.  Lets take some time to review some important new concepts introduced with ES2015 that we will be using extensively throughout the project.

## Fat Arrows: `() => {}`
Fat arrows is not a new concept, and if you’ve used or seen CoffeeScript before then it should look pretty familiar.  Basically the concept of fat arrows is to replace inline anonymous functions where you need to preserve `this`.  Typically in the past we would have done 2 things to preserve `this` when referring to this within an anonymous or callback function:

```javascript
var that = this;
Models.Image.find({}, function(err, images) {
  var myVar = 'testing 1 2 3';
  that.doSomething(myVar);
  res.json(images);
})
```

The reason we declare a `that` variable is because once we’re inside the callback function, the context or scope of `this` changes so that if we referred to `this.doSomething()` we would get undefined because the callback function does not have a doSomething method.  Another alternative method to this would be to use `bind` or `apply` calls.

Using the new fat arrow introduced with ES2015 however, handles this for you.  So that the above code could now be written as:

```javascript
Models.Image.find({},(err, images) => {
  var myVar = 'testing 1 2 3';
  this.doSomething(myVar);
  res.json(images);
})
```

Notice two things that are different about the above code:  first we don't have to declare `var that = this` outside of our function call.  Secondly we didn't even need to use the word "function" to define our function (because that's assumed since we’re using a fat arrow).  Finally, `this` is what we were hoping it would be inside the callback function!

Additionally, if your callback function is only a single line, you don't even need to include the {}. Furthermore, if you’re only passing a single parameter, you can omit the () as well!

```javascript
myArray.forEach(item => console.log(item));
```

Be careful when using fat arrow functions.  It might seem tempting to say "Great I never have to write the word function again! Fat arrows for the win!"  While this sounds nice, you have to keep in mind that the scope of this is changing, so if that's not what you intended, then using a fat arrow is not the right solution for you in that particular instance.

## `let` and `const` (instead of `var`)
Traditional ES5 JavaScript basically gives us one way to declare a variable using the `var` keyword. When people wanted to declare constants, the general rule was to do so using all uppercase letters.  In addition, a variable declared within any block level scope was always available to the entire root function.

With `let` we can now declare block level scoped variables.  Consider the following example (in ES5):

```javascript
var foo = 'bar';
if (foo) {
  var foo = 'baz';
  console.log(foo);
}
console.log(foo);
```

The output you would see is:

```
> baz
> baz
```

Because both variable declarations are the same, so inside the `if` block, the original foo variable is changed.

Using `let` with ES2015, however, we can now define variables in a block specific level:

```javascript
let foo = 'bar';
if (foo) {
  let foo = 'baz';
  console.log(foo);
}
console.log(foo);
> baz
> bar
```

Additionally, using the keyword `const` allows us to declare a variable that truly is read-only.

## String Templates: `` `Hello ${foo}` ``
String concatenation is a huge part of everyday JavaScript.  Thankfully this just a whole lot easier thanks to ES2015.  Compare traditional ES5 JavaScript string concatenation versus using string templates with ES2015:

```javascript
// ES5:
var world = 'World';
var myString = 'Hello' + world + '!!';

// ES2015:
var world = 'World';
var myString = `Hello ${world}!!`;
```

Notice that we’re using *backticks* instead of single quotes for our strings.  This is intentional and how we differentiate between regular strings and string templates.  Also, any variables that we want to merge into the string we denote using `${varname}`.  Something to note is that whitespace and newline characters are preserved with string templates.

## Destructuring Assignment
ES2015 features a handle shorthand variable assignment method that saves us a few keystrokes (and looks much nicer in my opinion).  Consider the following:

```javascript
var properties = {
  car: "grey",
  favorite: "red",
  money: "green",
  eyes: "blue"
}
var car = properties.car;
```

It's not uncommon that we want to work with a single property in an object and pull that out into its own variable.  In the example above, we just want to work with the car property, so we pull it out to its own `car` variable.  A new shorter way to write the same using ES2015 would be:

```javascript
var properties = {
  car: "grey",
  favorite: "red",
  money: "green",
  eyes: "blue"
}
var { car } = properties;
```

Here the above example shows that our variable `car` is also the same property name.  What if we want them to be different?  Say we want the property car to actually be stored in a variable named `carColor`:

```javascript
var properties = {
  car: "grey",
  favorite: "red",
  money: "green",
  eyes: "blue"
}
var { car:carColor } = properties;
```

This can be combined in some pretty clever and interesting ways:

```javascript
var people = [
	{ "firstName": "Jason", "email": "...", "age": "10" },
	{ "firstName": "Andrea", "email": "...", "age": "11" },
	{ "firstName": "Dustin", "email": "...", "age": "12" },
];
people.forEach(({firstName}) => console.log(firstName));
> Jason
> Andrea
> Dustin
```

## Spread Operator: `...`
The spread operator might seem familiar to some of you with different language backgrounds, but to JavaScript developers this is definitely a "what the heck?!" kind of thing.  The easiest way to think of the spread operator (denoted by `...` before a collection) is that of a built-in forEach as a super convenient shorthand.  Here are some examples of it in use:

```javascript
var myArray = [1, 2, 3];
console.log(myArray);
> [1, 2, 3]
console.log(...myArray);
> 1 2 3
```

With the above sample, you can see that using `console.log` with and without the spread operator results in a slightly different output.  The first logs the actual array object, whereas the second logs each item in the array individually (in a single log message).

```javascript
var moreArray = [4, 5, 6];
myArray.push(moreArray);
console.log(myArray);
> [1, 2, 3, [4, 5, 6]]
```

You can see without the spread operator, when we try to push an array into another array, we actually get what you’d expect - the 2nd array as the 4th item of the first array.  However our desired result was actually that of a concatenation or appending/merging.  With the spread operator this now works as we’d like it to:

```javascript
var moreArray = [4, 5, 6];
myArray.push(...moreArray);
console.log(myArray);
> [1, 2, 3, 4, 5, 6]
```

Finally, if you had a function that accepted 3 arguments, for example, you could use the spread operator to pass in an array as each individual argument:

```javascript
var myFunction = function(a, b, c) {
  console.log(a + b + c);
}
myFunction(...myArray);
> 6
```

## Default parameter values
Functions that have optional parameters/arguments can now provide a default value.  Traditionally in the past you might have done something like this pretty regularly:

```javascript
myFunction(a, b, c) {
  var a = a || 0, b = b || 1, c = c || 0;
}
```

As a way to predefine default values for undefined parameters.  Now you can use default values for parameters which makes things much neater:

```javascript
myFunction(a = 0, b = 1, c = 0) { }
```

## Rest
You can use the spread operator when defining the parameters for a function, which will act as a special version of the original `arguments` array.  Consider "rest" to be "the rest of the parameters".

```javascript
var anotherFunction = function(a, b, ...remaining) {
  console.log(a, b, remaining);
}
anotherFunction(1, 2, 3, 4, 5, 6, 7);
> 1 2 [3, 4, 5, 6, 7]
```

## Enhanced Object Literals
Object literals are a JavaScript developer's best friend!  Well they’ve received some upgrades as well with ES2015!  A few things that are different:

 * properties and methods can be written in shorthand now
 * computed properties

```javascript
// ES5 way:
var color = "red";
var speed = 10;

var car = {
    color: color,
    speed: speed,
    go: function() {
        console.log("vroom!");
    }
}

// ES2015 way:
var color = "red";
var speed = 10;
var faster = "gooo";

var car = {
    color,
    speed,
    go() {
        console.log("vroom!");
    },
    // new: can define computed properties/methods:
    [faster]() {
        console.log("boosting!");
    }
}

car.gooo()
> boosting!
```

## Classes
Wait what?! JavaScript has classes now?!  Well sort of.  Classes are still pretty much object literals, but now you can inherit from a base class which makes reusability so much nicer!  Additionally classes support `supers` and both instance and static methods and constructors.  Classes are a big part of using React.js as we are always going to be extending React’s base `Component` class.

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  speak(msg) {
    console.log(`${this.name} says: ${msg}`);
  }
}

class Child extends Person {
  yell(msg) {
    console.log(`${this.name} screams: ${msg}!!!`);
  }
}

var dustin = new Child('Dustin');
dustin.speak('Hello.');
dustin.yell('BOO');

> Dustin says: Hello.
> Dustin screams: BOO!!!
```

## Conclusion
We pretty much only scratched the surface of what ES2015 has to offer.  You’re going to see a lot of these new concepts throughout the code as we go through the remaining chapters.  My recommendation is to head on over to the **Babeljs.io** website and take a quick read through the *Learning ES2015* section.  

Additionally, check out the *Try it out* section which offers a real-time editor and shows you via a split screen what your transpiled code will turn into when going from ES2015 to ES5.  Some of the tricks Babel pulls off in order to do this stuff is pretty clever and will definitely give you a better understanding of how JavaScript works in general (plus it's generally a good idea to know what the transpiler is doing anyway).

Next up we’ll take a look at the build process and getting started using Gulp to build the frontend application for delivery to the end user!
