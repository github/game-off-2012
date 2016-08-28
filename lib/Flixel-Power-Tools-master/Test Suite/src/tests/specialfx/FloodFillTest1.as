package tests.specialfx 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.FloodFillFX;
	import tests.TestsHeader;

	public class FloodFillTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "FloodFill 1";
		public static var description:String = "FloodFill FX Plugin";
		private var instructions:String = "Click to start the flood fill effect";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var flood:FloodFillFX;
		private var soPretty:FlxSprite;
		
		public function FloodFillTest1() 
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
			
			var pic:FlxSprite = new FlxSprite(0, 0, AssetsRegistry.noCooper1984PNG);
			
			flood = FlxSpecialFX.floodFill();
			
			soPretty = flood.create(pic, 0, 32, pic.width, pic.height);
			
			add(soPretty);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.justReleased())
			{
				//	A speed of 2 makes it a little bit slower, so you can appreciate the effect :)
				flood.start(2);
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