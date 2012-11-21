package tests.flod 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class FlodTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Flod 1";
		public static var description:String = "Replay of MOD files (tracker music)";
		private var instructions:String = "Button toggles music + try the flixel volume controls";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var playback:FlxButtonPlus;
		private var pause:FlxButtonPlus;
		
		public function FlodTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			playback = new FlxButtonPlus(80, 112, toggleMusic, null, "Play Music");
			
			pause = new FlxButtonPlus(196, 112, togglePause, null, "Pause", 60);
			pause.visible = false;
			
			add(playback);
			add(pause);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
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
				FlxFlod.playMod(AssetsRegistry.anarchyMOD);
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