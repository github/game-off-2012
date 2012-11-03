### Instructions

To run the project: 

* Install
  * node.js
  * npm
  * coffeescript
  * git-svn
  * python
  * java

Run:

    git clone git://github.com/LPMC-Game-Off-2012/game-off-2012.git
    cd game-off-2012
    git submodule init
    git submodule update
    cd lib/limejs
    bin/lime.py init
    cd ../../gameOff
    coffee -c gameOff.coffee

Now you can open gameOff/gameOff.html with a browser and play the game. (hopefully)
