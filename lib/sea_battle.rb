module SeaBattle
  ROOT_PATH = File.expand_path(File.join('..', '..'), __FILE__)
  LIB_PATH = File.join(ROOT_PATH, 'lib')

  autoload :Application, File.join(LIB_PATH, 'sea_battle', 'application.rb')
end