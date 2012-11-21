package tests.specialfx 
{
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.SineWaveFX;
	import tests.TestsHeader;

	public class SineWaveTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "SineWave 1";
		public static var description:String = "SineWave FX Plugin";
		private var instructions:String = "The standard sine-wave effect";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var sinewave:SineWaveFX;
		private var wibbleWobble:FlxSprite;
		
		public function SineWaveTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			if (FlxG.getPlugin(FlxSpecialFX) == null)
			{
				FlxG.addPlugin(new FlxSpecialFX);
			}
			
			//	Get a sinewave effect from FlxSpecialFX
			sinewave = FlxSpecialFX.sineWave();
			
			//	There are 3 ways to create a sine wave effect, first is from an existing FlxSprite such as this one ...
			var pic:FlxSprite = new FlxSprite(96, 32, AssetsRegistry.overdoseEyePNG);
			
			//	You then call createFromFlxSprite() and pass the sprite in. A copy of the FlxSprite image data is taken, so it's safe to delete the FlxSprite if you need
			//	without messing up the sinewave (the only restriction being for dynamically updating effects - see SineWaveTest2)
			
			//	You have 2 different wave types available (sine and cosine) which give subtly different patterns, 
			//	and 2 directions - vertical and horizontal. Play with them to see the difference!
			
			//	The value 32 is the height of the wave in the effect at its maximum peak.
			//	The final parameter here is the width of the wave. This should be at least the width of the source image, but can be much longer if you want a slow undulating effect
			wibbleWobble = sinewave.createFromFlxSprite(pic, SineWaveFX.WAVETYPE_VERTICAL_SINE, 32, pic.width);
			
			//	You don't have to create from an FlxSprite, the following 2 lines both give the same end result but create from a Class or BitmapData
			
			//wibbleWobble = sinewave.createFromClass(AssetsRegistry.overdoseEyePNG, 32, 32, SineWaveFX.WAVETYPE_VERTICAL_SINE, 32, 64, 2, 1);
			//wibbleWobble = sinewave.createFromBitmapData((new AssetsRegistry.overdoseEyePNG).bitmapData, 32, 32, SineWaveFX.WAVETYPE_VERTICAL_SINE, 32, 64, 2, 1);
			
			//	Forget this and you'll have a very static effect :)
			sinewave.start();
			
			add(wibbleWobble);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin, otherwise resources will get messed right up after a while
			FlxSpecialFX.clear();
			
			super.destroy();
		}
		
	}

}