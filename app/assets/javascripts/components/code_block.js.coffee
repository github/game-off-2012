increase_brightness = (hex, percent) ->
  hex = hex.replace(/^\s*#|\s*$/g, '');
  hex = hex.replace(/(.)/g, '$1$1') if hex.length == 3

  r = parseInt(hex.substr(0, 2), 16)
  g = parseInt(hex.substr(2, 2), 16)
  b = parseInt(hex.substr(4, 2), 16)

  return '#' +
       ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
       ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1)


Crafty.c("CodeBlock", {
  init: ->
    @requires("2D, Canvas")
    @w = 50
    @h = 50
    @rotation = Crafty.math.randomNumber(0, 90)
    @color = "#004400"
    @

  draw: ->
    ctx = Crafty.canvas.context

    ctx.save()
    ctx.translate(@x,@y)
    ctx.rotate(@rotation * (Math.PI/180))

#    These are the nicer origins
#    ox = -1 * @w/2
#    oy = -1 * @h/2

    ox = 0
    oy = 0

    ctx.fillStyle = @color
    ctx.beginPath()
    ctx.moveTo(ox,oy+0)
    ctx.lineTo(ox+@w/2, oy+@h/2)
    ctx.lineTo(ox+0, oy+@h)
    ctx.fill()

    ctx.fillStyle = increase_brightness(@color, 5)
    ctx.beginPath()
    ctx.moveTo(ox+0,oy+@h)
    ctx.lineTo(ox+@w/2, oy+@h/2)
    ctx.lineTo(ox+@w, oy+@h)
    ctx.fill()

    ctx.fillStyle = increase_brightness(@color, 20)
    ctx.beginPath()
    ctx.moveTo(ox+@w,oy+@h)
    ctx.lineTo(ox+@w/2, oy+@h/2)
    ctx.lineTo(ox+@w, oy+0)
    ctx.fill()

    ctx.fillStyle = increase_brightness(@color, 30)
    ctx.beginPath()
    ctx.moveTo(ox+@w, oy+0)
    ctx.lineTo(ox+@w/2, oy+@h/2)
    ctx.lineTo(ox+0, oy+0)
    ctx.fill()

    ctx.restore()
})

Crafty.c "GreenCodeBlock",
  init: ->
    @requires("CodeBlock")
    @color = "#003300"
    random = Crafty.math.randomNumber(0, 20)
    @color = increase_brightness(@color, random)


Crafty.c "RedCodeBlock",
  init: ->
    @requires("CodeBlock")
    @color = "#330000"
    random = Crafty.math.randomNumber(0, 20)
    @color = increase_brightness(@color, random)


Crafty.c "LineOfCode",
  init: ->
    @x = 100
    Crafty.e("2D, Canvas, GreenCodeBlock, Tween").attr(x: @x, y:50, w: 50, h: 50)
    Crafty.e("2D, Canvas, GreenCodeBlock, Tween").attr(x: @x, y:150, w: 50, h: 50)
    Crafty.e("2D, Canvas, GreenCodeBlock, Tween").attr(x: @x, y:250, w: 50, h: 50)