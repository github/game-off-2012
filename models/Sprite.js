Sprite = Backbone.Model.extend({

  defaults: {
    filename: 'untitled.png',
    frames:[],
    srcX : 0,
    srcY : 0,
    srcW : 0,
    srcH : 0,
    destX : 0,
    destY : 0,
    destW : 0,
    destH : 0
  },

  initialize : function() {
  	this.newImg(this.get('filename'));
  },

  newImg : function(url) {
  	this.img = new Image();
    this.img.src = 'img/' + url;
  },

  render : function(context) {
    if(this.get('frames').length) {
      context.drawImage(
        this.img,
        this.get('srcX'), this.get('srcY'), this.get('srcW'), this.get('srcH'),
        this.get('destX'), this.get('destY'), this.get('destW'), this.get('destH')
      );
    } else {
      context.drawImage(this.img, this.get('srcX'), this.get('srcX'));
    }
  }
});