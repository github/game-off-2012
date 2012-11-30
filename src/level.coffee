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
    debugDraw.SetDrawScale(30)
    debugDraw.SetFillAlpha(0.8)
    debugDraw.SetAlpha(1)
    debugDraw.SetLineThickness(1.0)
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
    @world.SetDebugDraw(debugDraw)
    
    #ContactListener
    contactListener = new Box2D.Dynamics.b2ContactListener()
    contactListener.BeginContact = @beginContact
    @world.SetContactListener(contactListener)
    
  getWorld:->@world
    
  tick:->
    @world.Step(1 / 60, 10, 10)
    @world.ClearForces()
    body = @world.GetBodyList()
    
    while((body = body.GetNext())!= null)
      if body.UserData instanceof Entity
        if body.UserData.hasDied()
          @world.DestroyBody(body) 
    
    for i in [0...@entities.size()]
      #console.log(@entities.get(i).getUserData())
      
      if typeof @entities.get(i) != 'undefined'
        if @entities.get(i).getUserData().hasDied()
          if @entities.get(i).getUserData() instanceof BadWarrior
            @clonepoints++
          @entities.del(i)
        
    
    for i in [0...@entities.size()]
      #m = Model
      m = @entities.get(i)
      #e = Entity
      e = @entities.get(i).getUserData()
      
      m.setStopped(e.hasStopped())     
      if m.hasStopped() == false
        m.tick()
      e.tick()
      e.setX(m.getScreenX())
      e.setY(m.getScreenY())
      m.wakeUp()
    
  beginContact:(contact, manifold)->
    
  draw:(xOffset, yOffset)->
    @ctx.clearRect(0, 0, WIDTH, HEIGHT)
    @ctx.drawImage(@level.background,xOffset, yOffset, 128, 128, 0, 0, 640, 480)
    @screen.clear()
    #@world.DrawDebugData()
    for i in [0...@entities.size()]
      @entities.get(i).getUserData().render(@screen)
    @screen.draw()
    

class TestLevel extends Level
  constructor:(@id, json, @camera)->
    super @id
    @level = new LevelGenerator(json, STORAGE.getRessource("spritesheet"), @world)
    
    @clonepoints = 10
    
    #HowMuchCanBeSpawned
    @badWarriors = 3
    @badArchers = 10
    
    @tickcount = 0
    
    @cloneMenu = new CloneMenu()
    
    #Connect Buttons to Level
    btn = document.getElementsByClassName(".btn")
    for i in [0...btn.length]
      $(btn[i]).click(@click)
    
    body = @world.GetBodyList()
    if body.UserData is "Tower" then @towerbody = body
    while((body = body.GetNext()) != null)
      if body.UserData is "Tower" then @towerbody = body
    
    @tower=new Tower(500, new TowerGenerator(STORAGE.getRessource("towermodel")).getTowerModel()) 
    @towerbody.UserData = @tower
  
  tick:->
    super()
    @tickcount++
    
    if @tickcount %30 == 0
      @badWarriors--
      if @badWarriors >= 0
        e = new EntityModel(@world, 800-@camera.getXoffset(), 180, 24, -1.5, 0x04, 0x01|0x02|0x08)
        e.setUserData(new BadWarrior())
        @entities.add(e)
    
    if !@tower.hasDied()
      @tower.setX(@towerbody.GetPosition().x*30)
      @tower.setY((@towerbody.GetPosition().y)*30+10)
      
    @cloneMenu.setTotal(@clonepoints)
      
  draw:(xOffset, yOffset)->
    super(xOffset, yOffset)
    @tower.render(@ctx) if !@tower.hasDied()
  
  click:(e)=>
    ent = e.srcElement.attributes.entity.value
    
    if @clonepoints != 0
      if ent == "archer"
        @clonepoints--
        @cloneMenu.setTotal(@clonepoints)
        e = new EntityModel(@world, 2-@camera.getXoffset()-12, 30, 200, 2, 0x02, 0x01|0x04|0x08)
        e.setUserData(new Archer())
        @entities.add(e)
        
     if ent == "warrior"
        @clonepoints--
        @cloneMenu.setTotal(@clonepoints)
        e = new EntityModel(@world, 2-@camera.getXoffset()-12, 30, 24, 1.5, 0x02, 0x01|0x04|0x08)
        e.setUserData(new Warrior())
        @entities.add(e)
      
  
  beginContact:(contact, manifold)->
    entity1 = contact.GetFixtureA().GetBody().UserData
    entity2 = contact.GetFixtureB().GetBody().UserData
    #If Tower
    if entity2 instanceof Tower
      entity1.collide(entity2)
      
    if entity2 instanceof Entity and entity1 instanceof Entity
      entity1.collide(entity2)
      entity2.collide(entity1)
  
  
  
  
  
