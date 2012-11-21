package tests.specialfx 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.FloodFillFX;
	import tests.TestsHeader;

	public class FloodFillTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "FloodFill 2";
		public static var description:String = "FloodFill FX - Stretched image";
		private var instructions:String = "Click to start the flood fill effect";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var flood:FloodFillFX;
		private var soPretty:FlxSprite;
		
		public function FloodFillTest2() 
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
			
			var pic:FlxSprite = new FlxSprite(0, 0, AssetsRegistry.overdoseEyePNG);
			
			flood = FlxSpecialFX.floodFill();
			
			//	We're adding 100px to the height, so the image appears to drop even further down
			soPretty = flood.create(pic, 0, 0, pic.width, 232);

			FlxDisplay.screenCenter(soPretty, true, false);
			
			add(soPretty);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.justReleased())
			{
				flood.start(1);
			}
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin, otherwise resources will get messed right up after a while
			FlxSpecialFX.clear();
			
			super.destroy();
		}
		
	}

}