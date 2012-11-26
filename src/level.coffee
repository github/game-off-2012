class Level
  constructor:(@id, @world, @screen,json, sheet, @inputHandler, @game)->
    console.log("INIT Level")
    
    @entities = new List()
    
    @tower=new Tower(10)
    
    @contactListener = new Box2D.Dynamics.b2ContactListener()
    @contactListener.BeginContact = @beginContact
    
    @world.SetContactListener(@contactListener)
    
    @canvas = document.getElementById(@id)
    @ctx = @canvas.getContext("2d")
    @ctx.canvas.width = WIDTH
    @ctx.canvas.height = HEIGHT
    
    @ctx.webkitImageSmoothingEnabled = false
    @ctx.mozImageSmoothingEnabled= false
    
    @level = new LevelGenerator(json, sheet, world)
    
    #Entities are added
    for i in [0...3]
      e = new PlayerModel(world, (Math.random()*200)+50, 30)
      e.setUserData(new TestEntity())
      @entities.add(e)
    
    #Create Tower
    body  = @world.GetBodyList()
    if body.UserData == "Tower"
      body.UserData = new Tower(10)
      
    while((body = body.GetNext())!= null)
      if body.UserData == "Tower"
        body.UserData = new Tower(50)  

  beginContact:(contact, manifold)->
    entity1 = contact.GetFixtureA().GetBody().UserData
    entity2 = contact.GetFixtureB().GetBody().UserData
    
    #If Tower
    if entity2 instanceof Tower
      entity1.collide(entity2)
      

  tick:->
    if @inputHandler.ESC.isPressed()
      impress().goto("map_screen")
      @inputHandler.ESC.toggle(false)
      @game.loadMap()
      
      
    body = @world.GetBodyList()
    
    
    while((body = body.GetNext())!= null)
      if body.UserData instanceof Tower
        if body.UserData.hasDied()
          @world.DestroyBody(body) 
    
    for i in [0...@entities.size()]
      m = @entities.get(i)
      e = @entities.get(i).getUserData()
      e.tick()
      if e.stop == false
        m.tick()
      e.setX(m.getScreenX())
      e.setY(m.getScreenY())
      m.wakeUp()
  
  draw:(xOffset, yOffset)->
    @ctx.clearRect(0, 0, WIDTH, HEIGHT)
    @ctx.drawImage(@level.background,xOffset, yOffset, 128, 128, 0, 0, 640, 480)
    
    for i in [0...@entities.size()]
      @entities.get(i).getUserData().render(@screen)
