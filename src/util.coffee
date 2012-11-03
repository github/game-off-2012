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
    
