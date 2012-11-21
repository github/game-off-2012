package tests.flod 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class FlodTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "Flod 3";
		public static var description:String = "Custom VU Meter";
		private var instructions:String = "Custom VU Meter";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var playback:FlxButtonPlus;
		private var pause:FlxButtonPlus;
		private var vu:FlxFlectrum;
		
		public function FlodTest3() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			playback = new FlxButtonPlus(32, 64, toggleMusic, null, "Play Music");
			
			pause = new FlxButtonPlus(164, 64, togglePause, null, "Pause", 60);
			pause.visible = false;

			//	This VU meter uses a custom PNG instead of the built-in colour bar
			vu = FlxFlod.createFlectrum(0, 0, AssetsRegistry.flectrum2PNG, false, false, 32);
			vu.y = FlxG.height - vu.height - 20;
			
			add(vu);
			add(playback);
			add(pause);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			vu.update();
		}
		
		private function toggleMusic():void
		{
			if (FlxFlod.isPlaying)
			{
				playback.text = "Play Music";
				FlxFlod.stopMod();
				pause.visible = false;
			}
			else
			{
				playback.text = "Stop Music";
				FlxFlod.playMod(AssetsRegistry.alpineCutMOD);
				pause.text = "Pause";
				pause.visible = true;
			}
		}
		
		private function togglePause():void
		{
			if (FlxFlod.isPaused)
			{
				pause.text = "Pause";
				FlxFlod.resume();
			}
			else
			{
				pause.text = "Resume";
				FlxFlod.pause();
			}
		}
		
	}

}