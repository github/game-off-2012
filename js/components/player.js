/**
* This file contains the Phil character.
*  
* Author: Fork It, We'll do it live!
*/

Crafty.c("Phil", {
    init: function() {
        this.requires("SpriteAnimation")
            .animate("walk_left", 0, 3, 0)
            .animate("walk_right", 0, 1, 0)
            .animate("walk_up", 0, 0, 0)
            .animate("walk_down", 0, 2, 0)
            .animate("grab_left", 0, 7, 0)
            .animate("grab_right", 0, 5, 0)
            .animate("grab_up", 0, 4, 0)
            .animate("grab_down", 0, 6, 0)
            .bind("NewDirection", function (direction) {
                if (direction[0] < 0) {
                    if (!this.isPlaying("walk_left"))
                        this.stop().animate("walk_left", 10, -1);
                    }
                    if (direction[0] > 0) {
                        if (!this.isPlaying("walk_right"))
                            this.stop().animate("walk_right", 10, -1);
                    }
                    if (direction[1] < 0) {
                        if (!this.isPlaying("walk_up"))
                            this.stop().animate("walk_up", 10, -1);
                    }
                    if (direction[1] > 0) {
                        if (!this.isPlaying("walk_down"))
                            this.stop().animate("walk_down", 10, -1);
                    }
                    if(!direction[0] && !direction[1]) {
                        this.stop();
                    }
                })
            .bind("GrabDirection", function (direction) {
                if (direction[0] < 0) {
                    if (!this.isPlaying("grab_left"))
                        this.stop().animate("grab_left", 10, -1);
                    }
                    if (direction[0] > 0) {
                        if (!this.isPlaying("grab_right"))
                            this.stop().animate("grab_right", 10, -1);
                    }
                    if (direction[1] < 0) {
                        if (!this.isPlaying("grab_up"))
                            this.stop().animate("grab_up", 10, -1);
                    }
                    if (direction[1] > 0) {
                        if (!this.isPlaying("grab_down"))
                            this.stop().animate("grab_down", 10, -1);
                    }
                    if(!direction[0] && !direction[1]) {
                        this.stop();
                    }
                });
        
        return this;
    }
});