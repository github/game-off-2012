package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest9 extends FlxState
	{
		//	Common variables
		public static var title:String = "Sprite Snap 1";
		public static var description:String = "Sprite snaps to grid while dragged";
		private var instructions:String = "Sprite snaps to 32x32 grid as dragged";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var card:FlxExtendedSprite;
		
		public function ExtendedSpriteTest9() 
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
			
			//	The sprite will snap to a 32x32 sized grid as you drag it around
			card.enableMouseSnap(32, 32);
			
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