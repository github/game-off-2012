
goog.require('gameOff')

describe "Grid", -> 

  grid = 0
  beforeEach ->
    grid = new gameOff.Grid 10, 10

  it "should be created", ->
    expect(grid).toBeDefined()

  it "should have 10 rows", ->
    expect(grid.grid.length).toBe(10)
