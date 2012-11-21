package tests.specialfx 
{
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.SineWaveFX;
	import org.flixel.plugin.photonstorm.FX.PlasmaFX;
	import tests.TestsHeader;

	public class SineWaveTest4 extends FlxState
	{
		//	Common variables
		public static var title:String = "SineWave 4";
		public static var description:String = "Applying 2 SineWaves at once";
		private var instructions:String = "It can start getting pretty trippy!";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var sinewave1:SineWaveFX;
		private var sinewave2:SineWaveFX;
		private var sinewave3:SineWaveFX;
		private var sinewave4:SineWaveFX;
		private var sinewave5:SineWaveFX;
		private var sinewave6:SineWaveFX;
		
		private var wave1:FlxSprite;
		private var wave2:FlxSprite;
		private var wave3:FlxSprite;
		private var wave4:FlxSprite;
		private var wave5:FlxSprite;
		private var wave6:FlxSprite;
		
		public function SineWaveTest4() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			header.showDarkBackground();
			
			//	Add the 2 plugins we need
			if (FlxG.getPlugin(FlxSpecialFX) == null)
			{
				FlxG.addPlugin(new FlxSpecialFX);
			}
			
			sinewave1 = FlxSpecialFX.sineWave();
			sinewave2 = FlxSpecialFX.sineWave();
			sinewave3 = FlxSpecialFX.sineWave();
			sinewave4 = FlxSpecialFX.sineWave();
			sinewave5 = FlxSpecialFX.sineWave();
			sinewave6 = FlxSpecialFX.sineWave();
			
			wave1 = sinewave1.createFromBitmapData(FlxGradient.createGradientBitmapData(320, 32, [0xff200000, 0xffe00000, 0xff200000], 2), 0, 32, SineWaveFX.WAVETYPE_VERTICAL_SINE, 64, 320, 2, 4);
			wave2 = sinewave2.createFromBitmapData(FlxGradient.createGradientBitmapData(320, 32, [0xff201200, 0xffe07f00, 0xff201200], 2), 0, 32, SineWaveFX.WAVETYPE_VERTICAL_SINE, 64, 420, 2, 4);
			wave3 = sinewave3.createFromBitmapData(FlxGradient.createGradientBitmapData(320, 32, [0xff201f00, 0xffe0dd00, 0xff201f00], 2), 0, 32, SineWaveFX.WAVETYPE_VERTICAL_SINE, 64, 520, 2, 4);
			wave4 = sinewave4.createFromBitmapData(FlxGradient.createGradientBitmapData(320, 32, [0xff182000, 0xffa6e000, 0xff182000], 2), 0, 32, SineWaveFX.WAVETYPE_VERTICAL_SINE, 64, 620, 2, 4);
			wave5 = sinewave5.createFromBitmapData(FlxGradient.createGradientBitmapData(320, 32, [0xff000620, 0xff002be0, 0xff000620], 2), 0, 32, SineWaveFX.WAVETYPE_VERTICAL_SINE, 64, 720, 2, 4);
			wave6 = sinewave6.createFromBitmapData(FlxGradient.createGradientBitmapData(320, 32, [0xff20001c, 0xffe000c8, 0xff20001c], 2), 0, 32, SineWaveFX.WAVETYPE_VERTICAL_SINE, 64, 820, 2, 4);
			
			sinewave1.start();
			sinewave2.start();
			sinewave3.start();
			sinewave4.start();
			sinewave5.start();
			sinewave6.start();
			
			add(wave6);
			add(wave5);
			add(wave4);
			add(wave3);
			add(wave2);
			add(wave1);
			
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