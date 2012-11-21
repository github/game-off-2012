package tests.specialfx 
{
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.SineWaveFX;
	import tests.TestsHeader;

	public class SineWaveTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "SineWave 2";
		public static var description:String = "Using dynamically changing source images";
		private var instructions:String = "This wave is fed from an updating ScrollingText";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var font:FlxBitmapFont;
		private var scroller:FlxSprite;
		private var sinewaveV:SineWaveFX;
		private var sinewaveH:SineWaveFX;
		private var output:FlxSprite;
		
		public function SineWaveTest2() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	Add the 2 plugins we need
			if (FlxG.getPlugin(FlxSpecialFX) == null)
			{
				FlxG.addPlugin(new FlxSpecialFX);
			}
			
			if (FlxG.getPlugin(FlxScrollingText) == null)
			{
				FlxG.addPlugin(new FlxScrollingText);
			}
			
			header.showDarkBackground();
			
			//	First we create a ScrollText FlxSprite as usual
			var text:String = "WELCOME DUDES AND DUDETTES!   ";
			
			font = new FlxBitmapFont(AssetsRegistry.bluepinkFontPNG, 32, 32, FlxBitmapFont.TEXT_SET2, 10);
			
			//	The only slight difference here is that we offset by -16 to the left, and extend an extra 16 pixels right.
			//	This is so the sprite doesn't get cut off when the sine distortion goes through it. Note that we also give it a
			//	height x2 that we need, because the vertical distortion will make it move up and down :)
			scroller = FlxScrollingText.add(font, new Rectangle(-16, 80, 336, 64), 4, 0, text);
			
			//	Then we create 2 sine wave patterns - one will distort vertically, the other horizontally
			sinewaveV = FlxSpecialFX.sineWave();
			sinewaveH = FlxSpecialFX.sineWave();
			
			//	Finally the first sine wave is created from the constantly updating scroller FlxSprite
			output = sinewaveV.createFromFlxSprite(scroller, SineWaveFX.WAVETYPE_VERTICAL_SINE, 8, scroller.width, 2, 1, true);
			
			//	And then fed back into itself for a horizontal distortion!
			output = sinewaveH.createFromFlxSprite(output, SineWaveFX.WAVETYPE_HORIZONTAL_SINE, 8, scroller.height, 2, 1, true);
			
			//	Starts both effects running
			sinewaveV.start();
			sinewaveH.start();
			
			add(output);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugins, otherwise resources will get messed right up after a while
			FlxScrollingText.clear();
			FlxSpecialFX.clear();
			
			super.destroy();
		}
		
	}

}