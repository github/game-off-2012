CODE = {LEFT:37,RIGHT:39, ENTER:13, ESC:27}

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
    
    if keycode is CODE.LEFT
      @LEFT.toggle(true)
      e.preventDefault()
    
    if keycode is CODE.RIGHT
      @RIGHT.toggle(true)
      e.preventDefault()
      
    if keycode is CODE.ENTER
      @ENTER.toggle(true)
      e.preventDefault()
      
    if keycode is CODE.ESC
      @ESC.toggle(true)
      e.preventDefault()
    
  keyUp:(e)=>
    keycode = e.keyCode
  
    if keycode is CODE.LEFT
      @LEFT.toggle(false)
      #e.preventDefault()
      
    if keycode is CODE.RIGHT
      @RIGHT.toggle(false)
      #e.preventDefault()
      
    if keycode is CODE.ENTER
      @ENTER.toggle(false)
      #e.preventDefault()
    
    if keycode is CODE.ESC
      @ESC.toggle(false)
      #e.preventDefault()