$ = Zepto 

$ ->
  game = new Game()
  game.run()

class Game
  
  run: ->
    @screen = new Screen()
    @e = new TestEntity(10, 10)
    setInterval(@mainLoop, 1.0/60)
  
  mainLoop: =>
      @e.render(@screen)

 


