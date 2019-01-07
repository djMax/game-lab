message-passing
===============

This is a simple React app that uses Socket.io to create a message passing
system on the web. It is meant to be deployed to Heroku.

Development
===========

In development, to get the benefits of live editing of the React side, you need
to run two things:

To run the Socket server:
```
npm run start
```

To run the React development server (which handles re-"compiling" your React app),
run this in another shell.
```
npm run start-react-dev
```