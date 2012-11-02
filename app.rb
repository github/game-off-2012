require 'sinatra/base'
require 'sinatra/assetpack'

class ReleaseCyclesApp < Sinatra::Base
  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack

  assets {
    js :application, '/js/app.js', ['/js/*.js']
    css :application, '/css/app.css', ['/css/*.css']
  }

  get '/' do
    erb :index
  end
end