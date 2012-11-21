package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest10 extends FlxState
	{
		//	Common variables
		public static var title:String = "Sprite Snap 2";
		public static var description:String = "Sprite snaps to grid on release";
		private var instructions:String = "Sprite snaps to grid on release";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var card:FlxExtendedSprite;
		
		public function ExtendedSpriteTest10() 
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
			
			card = new FlxExtendedSprite(64, 48, AssetsRegistry.manaCardPNG);
			
			//	This time the sprite will drag around freely / smoothly, but will snap to the 16x16 grid when released
			card.enableMouseSnap(16, 16, false, true);
			
			//	You should nearly always turn off lockToCenter when using mouse snap
			card.enableMouseDrag();
			
			add(card);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxMouseControl.clear();
			
			super.destroy();
		}
		
	}

}