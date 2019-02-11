game-lab
===============

This is a "code battle" app built with [React](https://reactjs.org/), [babel/ES6](https://babeljs.io/), [material-ui](https://material-ui.com/), [unstated](https://github.com/jamiebuilds/unstated),
[boardgame.io](https://boardgame.io/#/) and some other special sauce. It aims to provide accessible programming
for children, generally targeted for ages 8 and up, but adults shouldn't feel bad either.

The goal is to program an AI that can play against other AIs or humans at a variety
of simple games. Multiplayer functionality is included so that you can play against other
people currently using the site. There is currently no database storage so your code is simply stored
in browser local storage and if the server goes down you lose any in-progress games.

* [Nim](https://en.wikipedia.org/wiki/Nim) - There are a number of piles of balls. You can pick up to a maximum number of
balls from a single pile, but you must pick at least one. The player forced to pick
the last ball loses. Code for this one is simple and doesn't require to many loops
or collection work, so it's a decent starter game.

* [Tic-Tac-Toe](https://en.wikipedia.org/wiki/Tic-tac-toe) - I can't possibly need to explain this game, but it does include a
minimax based AI that is unbeatable. I think. You need to understand arrays to make
a halfway decent AI.

* [Connect Four](https://en.wikipedia.org/wiki/Connect_Four)

* [Carribbean Dominos](https://www.pagat.com/tile/wdom/caribbean.html) - a 4 player game using double six dominos and teams of 2. A proper AI in this one is fairly complex and I am still working on better ones. Random strategies are harder to beat than I expected, mostly because there's a great deal of chance in the game and you do need a smart and like-minded partner. That, and the human game has oodles of cheating in it.

* There is also a console playground that lets you write simple games like the guessing game and just generally lets you experiment with Javascript.

You can try them all at the [Advent Game Lab Demo Site](https://advent-game-lab.herokuapp.com).

This site was built with love for an after school program at the [Advent School](https://adventschool.org). Please [consider a donation](https://adventschool.org/support/) if you would like to support work like this.

Development
===========

In case you're not familiar with node projects, first [install nodejs](https://nodejs.org/en/), then clone this project:

```
git clone https://github.com/djmax/game-lab
cd game-lab
npm i
```

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

That should open a browser to http://localhost:3000 that has the game.

File GitHub issues if you have any trouble.