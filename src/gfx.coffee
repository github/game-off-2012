class Screen
  constructor:(@id,img)->
    @context = document.getElementById(@id).getContext("2d")
    @canvas = document.createElement("canvas")
    @canvas.width = 640/3
    @canvas.height = 480/3
    @ctx = @canvas.getContext("2d")
    @spritesheet = new SpriteSheet(img, 8)
  #Would be the method for entities
  render:(x, y, tile) ->
    @spritesheet.drawTile(@ctx,x/3, y/3,tile)
    
  draw:->
    @context.drawImage(@canvas, 0, 0, 640, 480)
  
  clear:->
    @ctx.clearRect(0, 0, 640, 480)
    
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

#The  momentary LevelLoader
class LevelGenerator
  constructor:(@data,@img,@world)->
    @sprites = new SpriteSheet(@img, 8)
    @bodies = new List()
    @load()
  
  load:->
    @background = document.createElement("canvas")
    @ctx = @background.getContext("2d")
    
    for i in [0..@data.layers.length-1]
      name = @data.layers[i].name
      if name == 'scene'
        @createScene(@data, @data.layers[i])
        
      if name == 'static'
        @createModel(@world, @data.layers[i])
        
      if name == 'sensors'
        @createModel(@world, @data.layers[i])
   #Method creates Scene out of SceneLayer
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
      #Set Mask if used
      if obj.name == 'tower'
        fixDef.filter.categoryBits = 0x08
        fixDef.filter.maskBits = 0x01
      
      type = 0
      
      if obj.type? and obj.type is 'static'
        type = b2Body.b2_staticBody
      else
        type = b2Body.b2_dynamicBody
      
      bodyDef.type = type
      bodyDef.position.x = obj.x/30*scalew
      bodyDef.position.y = obj.y/30*scaleh
      
      @bodies.add({bd: bodyDef, fd:fixDef})
      body = @world.CreateBody(bodyDef)
      #SetUser Data if setted
      body.UserData = obj.properties.userdata if obj.properties.userdata? 
      body.CreateFixture(fixDef)
      
class TowerGenerator
  constructor:(@json)->
    @sprites = new SpriteSheet(STORAGE.getRessource("spritesheet"), 8)
    @bodies = new List()
    @load()
    
  load:->
    console.log(@json)
    img = document.createElement("canvas")
    img.width = @json.width * @json.tilewidth 
    img.height = @json.height * @json.tileheight
    
    ctx = img.getContext("2d")
    
    data = @json.layers[0]
    tiles = data.data
    
    for y in [0...data.height]
      for x in [0...data.width]
        @sprites.drawTile(ctx, x*8, y*8, tiles[x+y*data.width]-1)
        
    @img = document.createElement("canvas")
    @img.width = @json.width * @json.tilewidth * 4 
    @img.height = @json.height * @json.tileheight *4
    
    ctx = @img.getContext('2d')
    ctx.webkitImageSmoothingEnabled = false
    ctx.drawImage(img, 0, 0,@json.width * @json.tilewidth * 4 ,@json.height * @json.tileheight *4)
    
   getTowerModel:->@img

class Camera
  constructor:(@world,@scale,@screenscale,@inputHandler)->
    @active = false
    @xOffset = 0
    @modelScale = @scale/@screenscale
    @xBound = 128
    
  getXoffset: ->
    @xOffset
    
  setXoffset:(xOffset) ->
    @processEntities xOffset
    @xOffset = xOffset
  
  setXboundary:(xbound)->
    @xBound = xbound
    
  setWorld:(@world)->
    
  tick:=>
    xNow = 0
    
    if @inputHandler.RIGHT.isPressed() is true and @active
      if @xOffset != @xBound
        xNow = 1
        
    if @inputHandler.LEFT.isPressed() is true and @active
      if @xOffset != 0
        xNow = -1

    #Some performance-thing
    if xNow != 0
      @xOffset += xNow
      body = @world.GetBodyList()
      @setBodyPosition(body, xNow, 0)
      while (body = body.GetNext()) != null
        @setBodyPosition(body, xNow, 0)
  
  #Set Body-Position easily
  setBodyPosition:(body,xOffset, yOffset)->
    newx = body.GetPosition().x - (xOffset/@modelScale)
    newy = body.GetPosition().y - (yOffset/@modelScale)
    body.SetPosition(new b2Vec2(newx, newy), 0)
    
  isActive:->@active  
  setActive:(@active)->
  
  setWorld:(@world)->
    
#SpriteSheet-Class for accessing sprites by a atlas-index
class SpriteSheet
  constructor:(@image, @tilesize)->
    console.log("CREATED SpriteSheet")
  
  drawTile:(ctx,posx, posy,index)->
    for y in [0..7]
      for x in [0..7]
        if (x+y*@tilesize) is index
          ctx.drawImage(@image, x*@tilesize, y*@tilesize, @tilesize, @tilesize, posx, posy, @tilesize, @tilesize)