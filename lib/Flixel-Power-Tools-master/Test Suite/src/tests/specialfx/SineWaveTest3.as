package tests.specialfx 
{
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.SineWaveFX;
	import tests.TestsHeader;

	public class SineWaveTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "SineWave 3";
		public static var description:String = "Applying 2 SineWaves at once";
		private var instructions:String = "It can start getting pretty trippy!";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var sinewaveV:SineWaveFX;
		private var sinewaveH:SineWaveFX;
		private var output:FlxSprite;
		
		public function SineWaveTest3() 
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