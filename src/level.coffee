class Level
  constructor:(@id)->
    console.log("INIT TestLevel")
    #Init the physics
    @initPhysics()
    #Init Graphics
    @initGfx()
    #List for entities
    @entities = new List()
    @screen = new Screen(@id, STORAGE.getRessource("spritesheet"))
  
  initGfx:->
    @canvas = document.getElementById(@id)
    @ctx = @canvas.getContext("2d")
    @ctx.canvas.width = WIDTH
    @ctx.canvas.height = HEIGHT
    
    @ctx.webkitImageSmoothingEnabled = false
    @ctx.mozImageSmoothingEnabled= false
  
  initPhysics:->
    #box2dweb-world for physics
    @world = new b2World(new b2Vec2(0, 10), true)
    
    #Init DebugDraw
    debugDraw = new b2DebugDraw()
    debugDraw.SetSprite(document.getElementById(@id).getContext("2d"))
    debugDraw.SetDrawScale(@scale)
    debugDraw.SetFillAlpha(0.8)
    debugDraw.SetAlpha(1)
    debugDraw.SetLineThickness(1.0)
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
    @world.SetDebugDraw(debugDraw)
    
    #ContactListener
    contactListener = new Box2D.Dynamics.b2ContactListener()
    contactListener.BeginContact = @beginContact
    @world.SetContactListener(contactListener)
    
  tick:->
    @world.Step(1 / 60, 10, 10)
    @world.ClearForces()
    body = @world.GetBodyList()
    
    while((body = body.GetNext())!= null)
      if body.UserData instanceof Tower
        if body.UserData.hasDied()
          @world.DestroyBody(body) 
          
    for i in [0...@entities.size()]
      #m = Model
      m = @entities.get(i)
      #e = Entity
      e = @entities.get(i).getUserData()
      e.tick()
      m.setStopped(e.stop)
      if m.hasStopped() == false
        m.tick()
      e.setX(m.getScreenX())
      e.setY(m.getScreenY())
      m.wakeUp()
    
  beginContact:(contact, manifold)->
    
  draw:(xOffset, yOffset)->
    @ctx.clearRect(0, 0, WIDTH, HEIGHT)
    @ctx.drawImage(@level.background,xOffset, yOffset, 128, 128, 0, 0, 640, 480)
    @screen.clear()
    for i in [0...@entities.size()]
      @entities.get(i).getUserData().render(@screen)
    @screen.draw()

class TestLevel extends Level
  constructor:(@id, json)->
    super @id
    @level = new LevelGenerator(json, STORAGE.getRessource("spritesheet"), @world)
    
    @tower=new Tower(10)
    
    #Entities are added
    for i in [0...3]
      e = new PlayerModel(@world, (Math.random()*200)+50, 30)
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
  
  
  
  
  
