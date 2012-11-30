Sprite = Backbone.Model.extend({

  defaults: {
    filename: 'untitled.png',
    frames:[],
    srcX : 0,
    srcY : 0,
    destX : 0,
    destY : 0,
    continuous : false,
    duration : 1000,
    current_frame : 0
  },

  initialize : function() {
  	this.newImg(this.get('filename'));
    if(this.get('continuous')){
      var timer = setInterval(_.bind(function(){
        if(this.get('current_frame') === (this.get('frames').length -1)){
          this.set('current_frame',0);
        }else{
          this.set('current_frame', this.get('current_frame') + 1);
        }
      }, this), this.get('duration')/this.get('frames').length)
    }
  },

  newImg : function(url) {
  	this.img = new Image();
    this.img.src = 'img/' + url;
  },

  render : function(context) {
    if(this.get('frames').length) {
      var f = this.get('frames')[this.get('current_frame')];
  	  context.drawImage(
    		this.img,
    		f[0], f[1], f[2], f[3],
    		this.get('destX'), this.get('destY'), f[2], f[3]
  	  );
    } else {
      context.drawImage(this.img, this.get('destX'), this.get('destY'));
    }
  }
});