package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest5 extends FlxState
	{
		//	Common variables
		public static var title:String = "Sprite Clicks 1";
		public static var description:String = "Big Clickable Sprite";
		private var instructions:String = "Click and drag the sprite!";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var atari:FlxExtendedSprite;
		private var clickCounter:FlxText;
		
		public function ExtendedSpriteTest5() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	Enable the plugin - you only need do this once in your State (unless you destroy the plugin)
			if (FlxG.getPlugin(FlxMouseControl) == null)
			{
				FlxG.addPlugin(new FlxMouseControl);
			}
			
			atari = new FlxExtendedSprite(64, 96, AssetsRegistry.atari130xePNG);
			atari.enableMouseClicks(false);
			atari.enableMouseDrag(false);
			atari.mouseReleasedCallback = spriteClicked;
			
			clickCounter = new FlxText(16, 32, 200, "");
			
			add(atari);
			add(clickCounter);
			
			//	Header overlay
			add(header.overlay);
		}
		
		/**
		 * This function is called when the sprite is clicked (mouse down)
		 * 
		 * @param	obj		The FlxExtendedSprite that was clicked (in the case of this test it's always atari)
		 * @param	x		The x coordinate WITHIN THE SPRITE that was clicked, calculated from its origin
		 * @param	y		The y coordinate WITHIN THE SPRITE that was clicked, calculated from its origin
		 */
		private function spriteClicked(obj:FlxExtendedSprite, x:int, y:int):void
		{
			header.instructions.text = "Sprite clicked at x: " + x + " y: " + y;
			
			atari.alpha = 0.1 + (Math.random() * 0.9);
		}
		
		override public function update():void
		{
			super.update();
			
			clickCounter.text = "Clicks: " + atari.clicks.toString();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxMouseControl.clear();
			
			super.destroy();
		}
		
	}

}