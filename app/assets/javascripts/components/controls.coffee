Crafty.c "Controls"
  list: ["","awsd","hjkl"]
  currentIndex: 0

  content: """
            <h3>Controls:</h3>
            <span class='leftkey typicn left keyboard'></span>
            <span class='typicn right keyboard'></span>
           """
  init: ->
    @requires("2D, DOM, Text, ControlerScheme, Mouse")
    @attr(w: 100, h: 60)
    @text(@content)
    @bind("Click", @next)

  next: ->
    _.each @list, (component) =>
      @removeComponent(component)
    @currentIndex = (@currentIndex + 1) % @list.length
    @addComponent(@current())

  current: ->
    @list[@currentIndex]
