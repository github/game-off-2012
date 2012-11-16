class Screen
  constructor:(@id,@spritesheet)->
    @canvas = document.createElement("canvas")
    @canvas.width = 640/3
    @canvas.height = 480/3
    @ctx = @canvas.getContext("2d")
  #Would be the method for entities
  render:(x, y, tile) ->
    @spritesheet.drawTile(@ctx,x/3, y/3,tile)
  
  draw:->
    @canvas
  
  clear:->
    @ctx.clearRect(0, 0, 640, 480)

class Text
  
  chooseColor = "#FF00FF"
  color = "#FFF"
  
  constructor:(@value, @x, @y, @actual)->
    
  draw:(ctx)->
    ctx.fillStyle = if @actual then chooseColor else color
    ctx.fillText(@value, @x, @y)

class Map
  constructor:(@id,@game,@inputHandler)->
    console.log("INIT Map")
    
    @actualText = 0
    @do = 0
    
    @texts =[ 
      new Text("Level 1", 16*4, (16*4)-4, true),
      new Text("Level 2", 6*8*4, (8*13*4)+4, false),
      new Text("Level 3", 11*8*4, (8*2*4)-4, false),
      new Text("Final", 15*8*4, (12*8*4)-4, false)
    ]
    
    @canvas = document.getElementById(@id)
    @canvas.width = WIDTH
    @canvas.height = HEIGHT
    @ctx = @canvas.getContext("2d")
    
    @ctx.webkitImageSmoothingEnabled = false
    @ctx.mozImageSmoothingEnabled= false
    
    @ctx.font="normal 36px Arial";
    @ctx.fillStyle="#FFF"
    
    @mapgen = new MapGenerator(STORAGE.getRessource("map"), STORAGE.getRessource("spritesheet"))
    
  tick:->
    if @inputHandler.RIGHT.isPressed()
      if @actualText < 3
        @do = 1
    else
      if @do is 1
        @texts[@actualText].actual = false
        @actualText += @do
        @texts[@actualText].actual = true
        @do = 0
      
    if @inputHandler.LEFT.isPressed()
      if @actualText > 0
        @do = -1
    else
      if @do is -1
        @texts[@actualText].actual = false
        @actualText += @do
        @texts[@actualText].actual = true
        @do = 0
        
    if @inputHandler.ENTER.isPressed()
      @game.loadLevel(@actualText)
  
  draw:->
    @ctx.drawImage(@mapgen.background, 0, 0, 640, 480)
    for text in @texts
      text.draw(@ctx)
    
class MapGenerator
  constructor:(@data, @img)->
    console.log("INIT MapGenerator")
    @spritesheet = new SpriteSheet(@img, 8)
    @load()
  
  load:()->
    layer = @data.layers[0]
    props = layer.properties

    @background = document.createElement("canvas")
    
    @background.width = @data.width*8
    @background.height = @data.height*8
    
    @ctx = @background.getContext("2d") 
    
    tiles = layer.data
    
    for y in [0..15-1]
      for x in [0..20-1]
        @spritesheet.drawTile(@ctx, x*8, y*8, tiles[x+y*@data.width]-1)    

    
class Level
  constructor:(@id, world, json, sheet)->
    console.log("INIT Level")
    @canvas = document.getElementById(@id)
    @ctx = @canvas.getContext("2d")
    @ctx.canvas.width = WIDTH
    @ctx.canvas.height = HEIGHT
    
    @ctx.webkitImageSmoothingEnabled = false
    @ctx.mozImageSmoothingEnabled= false
    
    @level = new LevelGenerator(json, sheet, world)
  
  
  draw:(xOffset, yOffset)->
    @ctx.clearRect(0, 0, WIDTH, HEIGHT)
    @ctx.drawImage(@level.background,xOffset, yOffset, 128, 128, 0, 0, 640, 480)
#The  momentary LevelLoader 
class LevelGenerator
  constructor:(@data,@img,@world)->
    @sprites = new SpriteSheet(@img, 8)
    @load()  
  
  load:->
    @background = document.createElement("canvas")
    @ctx = @background.getContext("2d")
    
    #Get graphical-context
    console.log(@data)
    for i in [0..@data.layers.length-1]
      name = @data.layers[i].name
      if name == 'scene'
        @createScene(@data, @data.layers[i])
        
      if name == 'static'
        @createModel(@world, @data.layers[i])
        
      if name == 'sensors'
        @createModel(@world, @data.layers[i])
        
   #Method creates Scene out of SceneLayer
      #LoadS the spites
   createScene:(data, layer)->
    #RawTileData
    tiles = layer.data
     
    tileheight = data.tileheight
    tilewidth =  data.tilewidth
     
    @background.width = data.width*tilewidth
    @background.height = data.height*tileheight
     
    #iterate through data(tiles)
    for y in [0..data.height-1]
      for x in [0..data.width-1]
        @sprites.drawTile(@ctx, x*8, y*8, tiles[x+y*data.width]-1)

   createModel:(world, layer)->
    objects = layer.objects
    
    #The ratio is how much tiles are in one window
    ratio = (8*16)
    
    scalew = 640/ratio
    scaleh = 480/ratio
    
    for i in [0..objects.length-1]
      obj = objects[i]
      console.log(obj)
      b2PolygonShape shape = new b2PolygonShape
      #Transform right
      for x in [0..obj.polygon.length-1]
        obj.polygon[x] = {x:obj.polygon[x].x/30*scalew,y:obj.polygon[x].y/30*scaleh}
      shape.SetAsArray(obj.polygon)
      #Could be red out of map-->addlater
      fixDef = new b2FixtureDef

      if obj.properties?
        p = obj.properties
        if p.density?
          fixDef.density = p.density
        else
          fixDef.density = 1
          
        if p.friction?
          fixDef.friction = p.friction
        else
          fixDef.friction = 1
          
        if p.restitution?
          fixDef.restitution = p.restitution
          console.log(p.restitution)
        else
          fixDef.restitution = 0
        
        if p.sensor?
          fixDef.isSensor = p.sensor
        
      fixDef.shape = shape
      
      bodyDef = new b2BodyDef
      
      type = 0
      
      if obj.type? and obj.type is 'static'
        type = b2Body.b2_staticBody
      else
        type = b2Body.b2_dynamicBody
      
      bodyDef.type = type
      bodyDef.position.x = obj.x/30*scalew
      bodyDef.position.y = obj.y/30*scaleh
      
      @world.CreateBody(bodyDef).CreateFixture(fixDef)
         
class Camera
  constructor:(@world,@scale,@screenscale,@inputHandler)->
    @xOffset = 0
    @modelScale = @scale/@screenscale
    
  getXoffset: ->
    @xOffset
    
  setXoffset:(xOffset) ->
    @processEntities xOffset
    @xOffset = xOffset
    
  tick:=>
    xNow = 0
    
    if @inputHandler.RIGHT.isPressed() is true
      if @xOffset != 128
        xNow = 1
        
    if @inputHandler.LEFT.isPressed() is true
      if @xOffset != 0
        xNow = -1

    #Some performance-thing
    if xNow != 0
      body = @world.GetBodyList()
      @setBodyPosition(body, xNow, 0)
      while (body = body.GetNext()) != null
        @setBodyPosition(body, xNow, 0)
      
      @xOffset += xNow
  
  #Set Body-Position easily
  setBodyPosition:(body,xOffset, yOffset)->
    newx = body.GetPosition().x - (xOffset/@modelScale)
    newy = body.GetPosition().y - (yOffset/@modelScale)
    body.SetPosition(new b2Vec2(newx, newy), 0)

#SpriteSheet-Class for accessing sprites by a atlas-index
class SpriteSheet
  constructor:(@image, @tilesize)->
    console.log("CREATED SpriteSheet")
  
  drawTile:(ctx,posx, posy,index)->
    for y in [0..7]
      for x in [0..7]
        if (x+y*@tilesize) is index
          ctx.drawImage(@image, x*@tilesize, y*@tilesize, @tilesize, @tilesize, posx, posy, @tilesize, @tilesize)