$ = Zepto 

$ ->
   @b2Vec2 = Box2D.Common.Math.b2Vec2;
   @b2BodyDef = Box2D.Dynamics.b2BodyDef;
   @b2Body = Box2D.Dynamics.b2Body;
   @b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
   @b2Fixture = Box2D.Dynamics.b2Fixture;
   @b2World = Box2D.Dynamics.b2World;
   @b2MassData = Box2D.Collision.Shapes.b2MassData;
   @b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
   @b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
   @b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
   
   list = new List()
   list.add(1)
   list.add(2)
   list.add(3)
   
   game = new Game()
   game.run()

class Game
  
  constructor: ->
    @width = 600.0
    @height = 400.0
    @scale = 30.0
    
    @screen = new Screen(@width, @height)
    @debugDraw = new b2DebugDraw()
    @debugDraw.SetSprite(@screen.getContext())
    @debugDraw.SetDrawScale(@scale)
    @debugDraw.SetFillAlpha(0.3)
    @debugDraw.SetLineThickness(1.0)
    @debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
    @world = new b2World(new b2Vec2(0, 10), true)
    @world.SetDebugDraw(@debugDraw)
    @init()
  
  init: ->
    @ground = new GroundModel @world , this
    
  run: ->
    @e = new TestEntity(10, 10)
    @render()
  
  render: =>
      @world.Step(1 / 60, 10, 10);
      @world.DrawDebugData();
      window.requestAnimFrame(@render)
      #@e.render(@screen)

 


