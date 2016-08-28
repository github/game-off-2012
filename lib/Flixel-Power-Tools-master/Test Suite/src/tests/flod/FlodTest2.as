package tests.flod 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class FlodTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "Flod 2";
		public static var description:String = "Soundtracker VU Meter";
		private var instructions:String = "Soundtracker VU Meter";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var playback:FlxButtonPlus;
		private var pause:FlxButtonPlus;
		private var vu:FlxFlectrum;
		
		public function FlodTest2() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			playback = new FlxButtonPlus(32, 64, toggleMusic, null, "Play Music");
			
			pause = new FlxButtonPlus(164, 64, togglePause, null, "Pause", 60);
			pause.visible = false;

			var columnWidth:int = int(FlxG.width / 32) - 1;
			
			//	Here we have the standard flectrum effect - there will be 32 columns, each row is 5 pixels high, with spacing between them all
			vu = FlxFlod.createFlectrum(0, 0, null, false, false, 32, columnWidth, 1, 32, 5, 1);
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
				FlxFlod.playMod(AssetsRegistry.battlechips3MOD);
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