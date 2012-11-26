#animation-function
window.requestAnimFrame = (->
  window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback, element) ->
    window.setTimeout callback, 1000 / 60
)()

class List
  constructor:->
    @addindex = 0
    @array = new Array()
    
  add:(object) ->
    @array[@addindex++] = object
    
  size: ->
    return @array.length
    
  get:(index) ->
    @array[index]
    
  del:(index) ->
    --@addindex
    @array.splice(index, 1)