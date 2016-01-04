# Introduction

## I'm learning React.js so you can too!

I like to write about what I'm learning. I do this because it helps me generally understand what it is I'm trying to learn and also because I enjoy writing. A big part of it is also that it's one way that I can give back to the community that I appreciate so much! That being said, it's also a ton of work. I hope you enjoy this work in progress and get as much out of it as I put into it.

## Introducing *My Reaction When* (aka mrw.lol)

I'm certain you've been the recipient of a perfectly placed or timed animated gif that someone has posted in reaction to something. Personally I find this hilarious especially when its the perfect gif.  I use the chat program Slack regularly and have always found the `/giphy` plugin to be a total fail.  As a result I just have my own collection of gifs in a folder that I paste into the channel when appropriate.

I needed an idea for a basic app that I could write both as a way for me to learn React.js along the way, but also as a site that I could personally get some use out of.  In addition, I wanted the site to feature all of the standards of a typical web application so that users learning to build it will immediately see value.  MRW.lol was born! My Reaction When (from the standard abbreviation found in **reddit.com/r/reactiongifs**).

*My Reaction When* (or mrw for short) is basically a copy of **giphy.com** - a repository of animated gifs organized by "reaction" tags.  The primary features of the site include:

 * Search by tag
 * Login/Register using standard social networking sites
 * Upload your own images
 * Add existing images to your collection
 * Filter yours or any other user's image collection by tag
 * Randomly select an image by tag

## The Tech Stack

The basic premise of this series of tutorials is that you will go from zero to hero in full stack JavaScript web application development.  The application's tech stack itself consists of:

 * 100% JavaScript ES2015 (i.e. ES6 - transpiled using Babel 6)
 * React.js with Flux powering the front-end single page application
 * Node.js with Express powering the web server
 * MongoDB with Mongoose powering the datastore
 * Handlebars for server side HTML templates
 * Gulp (soon to be Webpack) powering the automated build process
 * Docker for the deployment & infrastructure

Along the way we'll break down and digest every part of the application in extremely fine detail.  While the project covers the entire stack from soup to nuts the real emphasis will be on React.js development!

The larger goal of this series of posts is that eventually it will be compiled together into an eBook/Screencast bundle.  I'm posting every "chapter" along the way for your benefit and review!

## What to Expect

Here's a breakdown of what to expect roughly every other week for the foreseeable future. Consider these to be chapters in the final book:

 * Introduction/Demo (what you're currently reading)
 * Up and Running
 * Tour of the App and Codebase
 * Introduction to ES2015 (i.e. ES6)
 * Getting Started with Webpack
 * Express Server 101
 * MongoDB and Mongoose Models
 * Writing Your First React Components
 * URLs with React Router
 * Using Flux with React.js (states, dispatchers, actions, etc.)
 * User Authentication Component
 * User Authentication API Endpoints
 * Image Upload Component
 * Image Upload API Endpoint
 * Image List Components
 * Image List API Endpoints
 * Image Search Component
 * Image Search API Endpoints
 * Deploying using Docker and Digital Ocean
 * Unit Testing React.js Components
 * Unit Testing Node.js Modules

Check out one of my previous massive posts (BENM Boilerplate) to get a pretty good understanding of what you're in for.

In addition to writing every post, I also plan to have an accompanying screencast with each!

I also don't plan to stop once the last of the above list is complete.  I consider this project to be on-going and hope to continue to add to it as time goes by.  Some ideas I have off the top of my head for the future are:

 * Isomorphic (Buzzword alert!) - render React.js screens on the server first
 * AWS S3 file storage
 * React.js Native to create a native app version
 * Electron to create a cross platform desktop companion app
 * Public API
 * Slack integration
 * CI configuration (Travis/CircleCI et al)
 * New Relic
 * Continued features and refactoring of the app itself

## Open Source

An important part of this project is that the entire project codebase is and will remain open source.  You can access the full source code for the project by heading over to its GitHub repo:

> **http://github.com/shorttompkins/mrw.lol**

Feel free to fork your own copy and start experimenting with it right away.  If you find any problems or bugs with the project throughout this series, please feel free to open an issue in the repo and I will try to take care of it as quickly as possible.  Better yet, if you feel you can easily fix the bug, why not take a stab and fixing it yourself and submitting a pull request?!
