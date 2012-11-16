class Storage
  constructor:->
    console.log("CREATE  Storage")
    @store = new Array()
    @counter = 0
    @finshed = ->
    
  register:(loader)->
     ++@counter
     loader.setCallback(@callback)
     
  callback:(loader)=>
     --@counter
     @store[loader.getName()] = loader.getRessource()
     if @counter == 0
       @finshed()
     
  setFinished:(finished)->
    @finshed = finished

  getRessource:(name)->
    @store[name]

class Loader
  constructor:(@path,@name)->
    @res = null
    @callback = ->
    
  start:->
    
  setCallback:(callback)->
    @callback = callback
  
  getRessource:->
    @res
  
  getName:->
    @name

class SimpleImageLoader extends Loader
  constructor:(@path,@name)->
    super(@path, @name)
    console.log("CREATE SimpleImageLoader")
    
  start:->
    @res = new Image()
    @res.onLoad = @callback(@)
    @res.src = @path


class SimpleJSONLoader extends Loader
  constructor:(@path,@name)->
    super(@path, @name)
    console.log("CREATE SimpleJSONLoader")
  
  start:->
    $.getJSON(@path, @load)
    
  load:(data)=>
    console.log("JSON Loaded")
    @res = data
    @callback(@)
    
