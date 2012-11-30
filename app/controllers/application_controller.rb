class ApplicationController < ActionController::Base
  protect_from_forgery

  caches_page :main

  def main
  end
end
