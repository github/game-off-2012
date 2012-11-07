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
    
    window.addEventListener("keydown", @keyDown)   
    window.addEventListener("keyup", @keyUp)  
    
  keyDown:(e)=>
    keycode = e.keyCode
    
    if keycode is 37
      @LEFT.toggle(true)
    
    if keycode is 39
      @RIGHT.toggle(true)
    
    
  keyUp:(e)=>
    keycode = e.keyCode
  
    if keycode is 37
      @LEFT.toggle(false)
      
    if keycode is 39
      @RIGHT.toggle(false)
    
  
