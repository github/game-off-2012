#TODO May not needed anymore ?!
class Screen
  constructor:(@w, @h, @ctx)->
    @scale = 2
    #getPixels
         
  #Would be the method for entities
  render:(x, y, tile, rotate) ->
    @ctx.fillStyle ='#FF00FF'
    @ctx.fillRect(x, y, 16, 16)
    
  clear:->
    #Clear to white
    @ctx.fillStyle ='#FFFFFF'
    @ctx.fillRect(0, 0, @ctx.canvas.width, @ctx.canvas.height)

#RessourceLoader for syncing the loaded ressources and start rendering
class RessourceLoader
  constructor:(@game)->
    
class LevelLoader
  
  constructor:(@bundle, @world, @game)->
    @data
    @background = document.createElement("canvas")
    @ctx = @background.getContext("2d")
    #AsyncLoading at the moment, maybe sync would be better...
    $.getJSON(@bundle.sheet, @load)
  
  #load-method -> async
  load:(data)=>
    @data = data
    
    #Get graphical-context
    
    
    for i in [0..@data.layers.length-1]
      name = @data.layers[i].name
      if name == 'scene'
        @createScene(@data, @data.layers[i])
        
      if name == 'static'
        @createModel(@world, @data.layers[i])
        
      if name == 'sensors'
        @createModel(@world, @data.layers[i])
    
    @game.run()
   
   #Method creates Scene out of SceneLayer
      #LoadS the spites
   createScene:(data, layer)=>
    sprites = new SpriteSheet(@bundle.img, 8)
    #RawTileData
    tiles = layer.data
     
    tileheight = data.tileheight
    tilewidth =  data.tilewidth
     
    @background.width = data.width*tilewidth
    @background.height = data.height*tileheight
     
    #iterate through data(tiles)
    for y in [0..data.height-1]
      for x in [0..data.width-1]
        sprites.drawTile(@ctx, x, y, tiles[x+y*data.width]-1)

   createModel:(world, layer)=>
    objects = layer.objects
    
    #The ratio is how much tiles are in one frame
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

#SpriteSheet-Class for loading and accessing sprites by a atlas-index
class SpriteSheet
  constructor:(@path, @tilesize)->
    @image = new Image()
    @image.src = @path
  
  drawTile:(ctx,x, y,index)->
    for iy in [0..7]
      for ix in [0..7]
        if (ix+iy*@tilesize) is index
          ctx.drawImage(@image, (ix*@tilesize), (iy*@tilesize), @tilesize,@tilesize, x*@tilesize, y*@tilesize, @tilesize, @tilesize)