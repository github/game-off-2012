package tests.scrollzone 
{
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ScrollZoneTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "ScrollZone 2";
		public static var description:String = "Scrolls several sections of one FlxSprite";
		private var instructions:String = "Scrolling several sections of one FlxSprite";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var pic:FlxSprite;
		
		public function ScrollZoneTest2() 
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
			
			//	Create a sprite from a 320x200 PNG (drawn by a friend of mine, Havoc, in just 16-colours on an Atari ST)
			pic = new FlxSprite(0, 32, AssetsRegistry.angelDawnPNG);
			
			//	Scrolls a region of this sprite verticall by 2 pixels every frame
			FlxScrollZone.add(pic, new Rectangle(16, 16, 176, 120), 0, 2);
			
			//	Creates a new scrolling zone within the same FlxSprite
			FlxScrollZone.createZone(pic, new Rectangle(241, 16, 46, 46), -4, 0);
			
			FlxScrollZone.createZone(pic, new Rectangle(233, 81, 59, 5), 0, -0.1);
			
			add(pic);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the scrolling image from the plugin, otherwise resources will get messed right up after a while
			FlxScrollZone.clear();
			
			super.destroy();
		}
		
	}

}