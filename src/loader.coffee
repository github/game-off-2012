class Storage
  constructor:->
    console.log("CREATE  Storage")
    @store = new Array()
    @counter = 0
    @finshed = ->
    
  register:(loader...)->
    @counter = loader.length
    for l in loader
      l.setCallback(@callback)
    
    for l in loader
      l.start()
     
  callback:(loader)=>
    --@counter
    @store[loader.getName()] = loader.getRessource()
    if @counter == 0
      @finshed()
     
  setOnFinish:(finished)->
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
    @res.onLoad = @load()
    @res.src = @path
    
  load:->
    console.log("SimpleImageLoader Loaded")
    @callback(@)

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
    
