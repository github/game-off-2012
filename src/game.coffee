$ = Zepto

$ ->
  @b2Vec2 = Box2D.Common.Math.b2Vec2
  @b2BodyDef = Box2D.Dynamics.b2BodyDef
  @b2Body = Box2D.Dynamics.b2Body
  @b2FixtureDef = Box2D.Dynamics.b2FixtureDef
  @b2Fixture = Box2D.Dynamics.b2Fixture
  @b2World = Box2D.Dynamics.b2World
  @b2MassData = Box2D.Collision.Shapes.b2MassData
  @b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
  @b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  @b2DebugDraw = Box2D.Dynamics.b2DebugDraw
  
  @WIDTH = 640.0
  @HEIGHT = 480.0
  #GLOABAL Storage
  @STORAGE = new Storage()
  
  game = new Game()
  
  @STORAGE.setFinished(game.init)
  
  l1 = new SimpleImageLoader("img/sprites.png", "spritesheet")
  l2 = new SimpleJSONLoader("img/map.json", "map")
  l3 = new SimpleJSONLoader("level/sheet.json", "level")
  STORAGE.register(l1)
  STORAGE.register(l2)
  STORAGE.register(l3)
  l1.start()
  l2.start()
  l3.start()
  
  #game = new Game()
  #game.run()
class Game
  constructor: ->
    console.log("CREATE Game")
    @scale = 30
  
  init:=>
    console.log("INIT Game") 
    
    #box2dweb-world for physics
    @world = new b2World(new b2Vec2(0, 10), true)
    
    #Init DebugDraw
    debugDraw = new b2DebugDraw()
    debugDraw.SetSprite(document.getElementById("board").getContext("2d"))
    debugDraw.SetDrawScale(@scale)
    debugDraw.SetFillAlpha(0.8)
    debugDraw.SetAlpha(1)
    debugDraw.SetLineThickness(1.0)
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
    @world.SetDebugDraw(debugDraw)
    
    #InputHandler
    @inputHandler = new InputHandler
    
    #TestMap
    @map = new Map("map", @inputHandler)
    
    
      
    @level = new Level("board", @world, @inputHandler)
    #The Camera
    @camera = new Camera(@world,30 ,5,@inputHandler)
    
    @run()
 
  beginContacts:(begin, manifold)=>
    console.log("contact")
    
  run: =>
    @tick()
    @render()
    window.requestAnimFrame(@run)
    
  tick: ->
    @world.Step(1 / 60, 10, 10)
    @world.ClearForces()
    
    @map.tick()
    @camera.tick()
  
  render: ->
    #@world.DrawDebugData()
    @level.draw(@camera.getXoffset(), 0)
    @map.draw()

