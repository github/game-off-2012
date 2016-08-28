package tests.specialfx 
{
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.SineWaveFX;
	import org.flixel.plugin.photonstorm.FX.BlurFX;
	import tests.TestsHeader;

	public class BlurTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "Blur 2";
		public static var description:String = "Bluring a moving image";
		private var instructions:String = "It can start getting pretty trippy Part 2!";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var blur:BlurFX;
		private var blurEffect:FlxSprite;
		private var sinewaveV:SineWaveFX;
		private var sinewaveH:SineWaveFX;
		private var output:FlxSprite;
		
		public function BlurTest2() 
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
			
			//	2 sine wave patterns - one will distort vertically, the other horizontally
			sinewaveV = FlxSpecialFX.sineWave();
			sinewaveH = FlxSpecialFX.sineWave();
			
			//	The first sine wave is created from a static embedded PNG
			output = sinewaveV.createFromClass(AssetsRegistry.overdoseEyePNG, 64, 32, SineWaveFX.WAVETYPE_VERTICAL_SINE, 32, 200);
			
			//	And then fed back into itself for a horizontal distortion!
			output = sinewaveH.createFromFlxSprite(output, SineWaveFX.WAVETYPE_HORIZONTAL_SINE, 32, 200, 2, 1, true);
			
			//	Starts both effects running
			sinewaveV.start();
			sinewaveH.start();
			
			//	The plugin
			blur = FlxSpecialFX.blur();
			
			blurEffect = blur.create(320, 240, 4, 8, 4);
			
			blur.addSprite(output);
			
			blur.start();
			
			add(blurEffect);
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
			FlxSpecialFX.clear();
			
			super.destroy();
		}
		
	}

}