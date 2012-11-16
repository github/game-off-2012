class window.Settings

  data: null

  constructor: ->
    @data = store.get("settings")
    @data = Config.settings unless @data?

  save: ->
    store.set("settings", @data)

  get: (what) ->
    @data[what]

  set: (what, val) ->
    @data[what] = val
    @save()

  @load: ->
    @instance()

  @instance: ->
    @_instance ||= new Settings()

  @all: ->
    @instance().data

  @get: (what) ->
    @instance().get(what)

  @set: (what, value) ->
    @instance().set(what, value)

