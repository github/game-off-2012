REM Starts an IIS EXPRESS server in the project src directory

IF NOT EXIST %programfiles(x86)% GOTO 32

64:
"%programfiles(x86)%\iis express\iisexpress" /path:"%cd%"

32:
"%programfiles%\iis express\iisexpress" /path:"%cd%"
