require 'sinatra/base'

module SeaBattle
  class Application < Sinatra::Base
    set :root, ROOT_PATH

    get '/' do
      erb :index
    end
  end
end