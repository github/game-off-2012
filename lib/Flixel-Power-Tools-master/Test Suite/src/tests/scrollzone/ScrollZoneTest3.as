package tests.scrollzone 
{
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ScrollZoneTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "ScrollZone 3";
		public static var description:String = "Updates the scroll values in real-time";
		private var instructions:String = "Updating the scroll values in real-time";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var pic:FlxSprite;
		private var ot:int = 0;
		private var ang:Number = 0;
		
		public function ScrollZoneTest3() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	If the FlxScrollZone Plugin isn't already in use, we add it here
			if (FlxG.getPlugin(FlxScrollZone) == null)
			{
				FlxG.addPlugin(new FlxScrollZone);
			}
			
			header.showDarkBackground();
			
			//	This is our sine-wavy scrolling background
			pic = new FlxSprite(0, 32, AssetsRegistry.acfPNG);
			
			//	Note that we pass "true" for the "clearRegion" parameter - set it to false to see why :)
			FlxScrollZone.add(pic, new Rectangle(0, 0, 320, 200), 0, 0, true, true);
			
			add(pic);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			//	Just applies a sin/cos wave to the scrolling
			var os:Number = FlxG.elapsed * 20;
			ang += 0.1 * os;
				
			FlxScrollZone.updateX(pic, Math.sin(ang) * os * 20);
			FlxScrollZone.updateY(pic, Math.cos(ang) * os * 10);
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the scrolling image from the plugin, otherwise resources will get messed right up after a while
			FlxScrollZone.clear();
			
			super.destroy();
		}
		
	}

}