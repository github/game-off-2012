/**
* This file contains the Phil character.
*  
* Author: Fork It, We'll do it live!
*/

Crafty.c("Phil", {
    init: function() {
        this.requires("SpriteAnimation")
            .animate("walk_left", 0, 3, 3)
            .animate("walk_right", 0, 1, 3)
            .animate("walk_up", 0, 0, 3)
            .animate("walk_down", 0, 2, 3)
            .animate("grab_left", 0, 7, 3)
            .animate("grab_right", 0, 5, 3)
            .animate("grab_up", 0, 4, 3)
            .animate("grab_down", 0, 6, 3)
            .bind("NewDirection", function (direction) {
                if (direction[0] < 0) {
                    if (!this.isPlaying("walk_left"))
                        this.stop().animate("walk_left", gameBoard.standardAnimationLength, -1);
                    }
                    if (direction[0] > 0) {
                        if (!this.isPlaying("walk_right"))
                            this.stop().animate("walk_right", gameBoard.standardAnimationLength, -1);
                    }
                    if (direction[1] < 0) {
                        if (!this.isPlaying("walk_up"))
                            this.stop().animate("walk_up", gameBoard.standardAnimationLength, -1);
                    }
                    if (direction[1] > 0) {
                        if (!this.isPlaying("walk_down"))
                            this.stop().animate("walk_down", gameBoard.standardAnimationLength, -1);
                    }
                    if(!direction[0] && !direction[1]) {
                        this.stop();
                    }
                })
            .bind("GrabDirection", function (direction) {
                if (direction[0] < 0) {
                    if (!this.isPlaying("grab_left"))
                        this.stop().animate("grab_left", gameBoard.standardAnimationLength, -1);
                    }
                    if (direction[0] > 0) {
                        if (!this.isPlaying("grab_right"))
                            this.stop().animate("grab_right", gameBoard.standardAnimationLength, -1);
                    }
                    if (direction[1] < 0) {
                        if (!this.isPlaying("grab_up"))
                            this.stop().animate("grab_up", gameBoard.standardAnimationLength, -1);
                    }
                    if (direction[1] > 0) {
                        if (!this.isPlaying("grab_down"))
                            this.stop().animate("grab_down", gameBoard.standardAnimationLength, -1);
                    }
                    if(!direction[0] && !direction[1]) {
                        this.stop();
                    }
                })
                // Check for finish tile
                .bind("CheckForFinish", function(location) {
                    var collisionDetector = Crafty.e("2D, Collision").attr({ x: location[0], y: location[1], w: 1, h: 1 });
                    if(collisionDetector.hit("FinishableBox")) {
                        collisionDetector.destroy();
                        Crafty.scene(gameBoard.getMap()); //when everything is loaded, run the main scene
                    }
                    collisionDetector.destroy();
                });
        
        return this;
    }
});
