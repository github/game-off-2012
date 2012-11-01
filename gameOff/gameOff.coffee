
goog.provide 'gameOff'

goog.require 'lime.Director'
goog.require 'lime.Scene'
goog.require 'lime.Layer'
goog.require 'goog.events.KeyCodes'

gameOff.start = ->
  scale = 5
  grid = new Grid 10,10
  hero = new Hero 
  mob = new Mob

  map = new Map grid

  map.add_thing hero, 1, 1
  map.add_thing mob, 5, 5

  director = new lime.Director document.body,grid.size_x * scale, grid.size_y * scale
  director.makeMobileWebAppCapable()
  director.setDisplayFPS(false)
  map_scene = new lime.Scene();
  map_layer = new lime.Layer().setPosition(0,0).setRenderer(lime.Renderer.CANVAS).setAnchorPoint(0,0)
  map_sprite = new lime.Sprite().setSize(grid.size_x * scale, grid.size_y * scale).setFill('#000').setPosition(0,0).setAnchorPoint(0,0)
  hero_sprite = new lime.Sprite().setSize(1 * scale,1 * scale).setFill('#FFF').setPosition(hero.cell.x * scale, hero.cell.y * scale)
  mob_sprite = new lime.Sprite().setSize(1 * scale, 1 * scale).setFill('#F00').setPosition(mob.cell.x * scale, mob.cell.y * scale)

  goog.events.listen document, ['keydown'], (e) =>
    switch e.keyCode
      when goog.events.KeyCodes.UP    then map.move(hero, Grid.UP)
      when goog.events.KeyCodes.DOWN  then map.move(hero, Grid.DOWN)
      when goog.events.KeyCodes.RIGHT then map.move(hero, Grid.RIGHT)
      when goog.events.KeyCodes.LEFT  then map.move(hero, Grid.LEFT)

    movement = new lime.animation.MoveTo(hero.cell.x * scale,hero.cell.y * scale).setDuration(0.2)
    hero_sprite.runAction(movement)

  map_layer.appendChild(map_sprite)
  map_layer.appendChild(mob_sprite);
  map_layer.appendChild(hero_sprite)
  map_scene.appendChild(map_layer)

  director.replaceScene(map_scene)


class Grid
  @X = 'x'
  @Y = 'y'
  @UP    = 1
  @DOWN  = 2
  @RIGHT = 3
  @LEFT  = 4
  
  constructor: (size_x, size_y) ->
    @size_x = size_x
    @size_y = size_y
    @grid = []
    for i in [0..size_x] 
      @grid[i] = []
      for j in [0..size_y]
        @grid[i][j] = new Cell this, i,j

  move: (thing, direction) ->
    cell = thing.cell
    move_to_cell = switch direction
      when Grid.UP then cell.up()
      when Grid.DOWN then cell.down()
      when Grid.LEFT then cell.left()
      when Grid.RIGHT then cell.right()
    if move_to_cell? and not move_to_cell.filled
      move_to_cell.fill_with thing
      thing.cell.empty()

    return thing

  get_cell: (x,y) ->
    if (x > @size_x) or (x < 0) or (y > @size_y) or (y < 0)
      return null
    @grid[x][y]
   
  add_thing: (thing, x, y) ->
    @grid[x][y].fill_with thing
    
class Map
  constructor: (grid, things...) -> 
    @grid = grid

  add_thing: (thing, x, y) ->
    @grid.add_thing thing, x, y

  move: (thing, dir) ->
    @grid.move(thing, dir)
    
class Cell
  constructor: (grid, x, y) ->
    @grid = grid
    @x = x
    @y = y
    @filled = false

  fill_with: (thing) ->
    @thing = thing
    @thing.cell = this
    @filled = true

  empty: ->
    @thing = null
    @filled = false

  up: ->
    @grid.get_cell(@x, @y - 1)

  down: ->
    @grid.get_cell(@x, @y + 1)

  right: ->
    @grid.get_cell(@x + 1, @y)

  left: ->
    @grid.get_cell(@x - 1, @y)

    
class Thing

class Mover extends Thing
  
class Hero extends Mover

class Mob extends Mover
  
class AI extends Mover
  where_to: ->
    [0,0]
    
