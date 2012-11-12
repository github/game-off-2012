fs = require 'fs'

{print} = require 'sys'
{spawn} = require 'child_process'

lint = (callback) ->
  #Scan whole src directory
  packages = fs.readdirSync("src/")
  
  for file in packages
    coffelint = spawn 'coffeelint', ['src/'+file]
    #print all messages in stdout
    coffelint.stdout.on 'data', (data) ->
      print data

build = (callback) ->
  coffee = spawn 'coffee', ['-w', '-j', 'game','-c','-o','js' ,'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

task 'lint', 'lint all packages with coffeelint', ->
  lint()

task 'build', 'Build js/ from s rc/', ->
  build()