class Game
  constructor:->
    screen = new Screen()
    e1 = new TestEntity(10, 10)
    e1.render(screen)
    
new Game()
