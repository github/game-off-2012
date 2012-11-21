Flixel Power Tools
==================

Version 1.9

October 11th 2011

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

The [Flixel Power Tools](http://www.photonstorm.com/flixel-power-tools) are a package
of classes designed to provide extra functionality to your Flixel 2.5+ games.


Quick Install Guide
-------------------

Unzip the file `photonstorm.zip` into the following folder within your Flixel project:

     src/org/flixel/plugin

It should create a folder called `photonstorm` containing all of the tools. The final
directory structure of your project should be:

     src/org/flixel/plugin/photonstorm

and within the `photonstorm` folder you'll find all the classes listed below.

Now read the Getting Started Guide in the Doc folder. It contains important information that will 
help you compile!

Dev branch users:

I don't keep the zip file as up to date as the src in the Test Suite. So ignore the above and 
instead copy the photonstorm folder out of:

    Test Suite/src/org/flixel/plugin

to your Flixel plugin folder


Getting Started Guide
---------------------

There is a comprehensive Getting Started Guide in both Word and PDF format in the `Docs` folder.

Documentation is also provided built-in to the classes. AS3 IDEs such as FlashDevelop will
provide context-sensitive help for all classes and functions in the Flixel Power Tools.

Finally check out the home page at http://www.photonstorm.com/flixel-power-tools for updates.


Demo Suite
----------

The Flixel Power Tools come with a comprehensive Demo Suite. Use it to visually see the 
tools in action, and then learn from the source code and comments within.

To run the Demo Suite launch the following SWF:

    Test Suite/bin/FlixelPowerTools.swf

If you don't have Flash Player installed locally then open `index.html` in a browser.


Classes
-------

The following classes are currently in the Flixel Power Tools:

* FlxBar
* FlxBitmapFont
* FlxButtonPlus
* FlxCollision
* FlxColor
* FlxControl (includes FlxControlHandler)
* FlxCoreUtils
* FlxDelay
* FlxDisplay
* FlxExtendedSprite
* FlxFlod (includes FlxFlectrum)
* FlxGradient
* FlxGridOverlay
* FlxLinkedGroup
* FlxMath
* FlxMouseControl
* FlxScreenGrab
* FlxScrollingText
* FlxScrollZone
* FlxSpecialFX
* FlxVelocity
* FlxWeapon

APIs Include

* FlxKongregate

Special FX Includes

* BlurFX
* CenterSlideFX
* FloodFillFX
* GlitchFX
* PlasmaFX
* RainbowLineFX
* RevealFX
* SineWaveFX
* StarfieldFX

Contributing
------------

If you'd like to add a new class to the package, or a function into an exisiting class
then please feel free. Be sure to checkout the dev branch first however!

If you'd just like to request a specific class or function then leave me a message on
either the [Flixel Power Tools project page][fpt] or the [Flixel Forums][ff]


Dev or Master
-------------

As the Flixel Power Tools are changing rapidly I have split them into two branches: master and dev.

Dev contains the "bleeding edge" classes (aka might not compile). Once they are stable I merge with "master".

Unless you are extremely curious, or helping out with the project, you should pretty much always checkout from master.


Bugs?
-----

Please add them to the [Issue Tracker][1] with as much info as possible.

License
-------

Copyright 2011 Richard Davey. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY RICHARD DAVEY ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL RICHARD DAVEY OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the
authors and should not be interpreted as representing official policies, either expressed

[1]: https://github.com/photonstorm/Flixel-Power-Tools/issues
[fpt]: https://github.com/photonstorm/Flixel-Power-Tools
[ff]: http://flixel.org/forums/