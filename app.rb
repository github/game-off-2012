require 'sinatra/base'
require 'sinatra/assetpack'

class ReleaseCyclesApp < Sinatra::Base
  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack

  assets {
    serve '/javascripts',     from: 'assets/javascripts'
    serve '/stylesheets',    from: 'assets/stylesheets'
    serve '/images',         from: 'assets/images'
    #
    ## The second parameter defines where the compressed version will be served.
    ## (Note: that parameter is optional, AssetPack will figure it out.)
    #js :application, '/js/app.js', [
    #  '/js/vendor/**/*.js',
    #  '/js/app/**/*.js'
    #]
    #
    #css :application, '/css/application.css', [
    #  '/css/screen.css'
    #]
    #
    #js_compression  :jsmin      # Optional
    #css_compression :sass       # Optional
  }

  get '/' do
    "Hello World!"
  end
end