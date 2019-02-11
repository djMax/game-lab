import React from 'react';
import ReactMD from 'react-markdown';
import { withStyles } from '@material-ui/core';

const styles = {
  md: {
    maxWidth: 700,
    margin: 'auto',
  },
};

function Intro({ classes }) {
  return (
    <ReactMD className={classes.md} source={`
game-lab
========

This is a "code battle" app built with [React](https://reactjs.org/), [babel/ES6](https://babeljs.io/), [material-ui](https://material-ui.com/), [unstated](https://github.com/jamiebuilds/unstated),
[boardgame.io](https://boardgame.io/#/) and some other special sauce. It aims to provide accessible programming
for children, generally targeted for ages 8 and up, but adults shouldn't feel bad either.

The goal is to program an AI that can play against other AIs or humans at a variety
of simple games. Multiplayer functionality is included so that you can play against other
people currently using the site. There is currently no database storage so your code is simply stored
in browser local storage and if the server goes down you lose any in-progress games.

* [Nim](/nim) - There are a number of piles of balls. You can pick up to a maximum number of
balls from a single pile, but you must pick at least one. The player forced to pick
the last ball loses. Code for this one is simple and doesn't require to many loops
or collection work, so it's a decent starter game.

* [Tic-Tac-Toe](/tic-tac-toe) - I can't possibly need to explain this game, but it does include a
minimax based AI that is unbeatable. I think. You need to understand arrays to make
a halfway decent AI.

* [Connect Four](/connect-four)

* [Carribbean Dominos](/dominos) - a 4 player game using double six dominos and teams of 2. A proper AI in this one is fairly complex and I am still working on better ones. Random strategies are harder to beat than I expected, mostly because there's a great deal of chance in the game and you do need a smart and like-minded partner. That, and the human game has oodles of cheating in it.

* A [console playground](/playground) that lets you write simple games like the guessing game and just generally lets you experiment with Javascript.

This site was built with love for an after school program at the [Advent School](https://adventschool.org). Please [consider a donation](https://adventschool.org/support/) if you would like to support work like this.

Future Enhancement
------------------

Currently, I'm working on getting [scratch-blocks](https://github.com/LLK/scratch-blocks)+[scratch-vm](https://github.com/LLK/scratch-vm)
as an option in the code editor, and a step debugger on the JS side.
Neither are easy, and I'd love help or pointers.
`} />
  );
}

export default withStyles(styles)(Intro);