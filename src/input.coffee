class Key
  constructor: ->
    @pressed
  
  toggle:(pressed)->
    @pressed = pressed
    
  isPressed:->
    @pressed


class InputHandler
  constructor:->
    @LEFT = new Key()
    @RIGHT = new Key()
    @ENTER = new Key()
    @ESC = new Key()
    
    window.addEventListener("keydown", @keyDown)
    window.addEventListener("keyup", @keyUp)
    
  keyDown:(e)=>
    keycode = e.keyCode
    
    if keycode is 37
      @LEFT.toggle(true)
      e.preventDefault()
    
    if keycode is 39
      @RIGHT.toggle(true)
      e.preventDefault()
      
    if keycode is 13
      @ENTER.toggle(true)
      e.preventDefault()
      
    if keycode is 27
      @ESC.toggle(true)
      e.preventDefault()
    
    
    
  keyUp:(e)=>
    keycode = e.keyCode
  
    if keycode is 37
      @LEFT.toggle(false)
      e.preventDefault()
      
    if keycode is 39
      @RIGHT.toggle(false)
      e.preventDefault()
      
    if keycode is 13
      @ENTER.toggle(false)
      e.preventDefault()
    
    if keycode is 27
      @ESC.toggle(false)
      e.preventDefault()
      
    
    
  
