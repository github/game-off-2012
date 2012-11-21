package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "Sprite Drag 2";
		public static var description:String = "Priority Order Sprite Drag";
		private var instructions:String = "The ball is always dragged first, even when behind";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var items:FlxGroup;
		
		private var atari:FlxExtendedSprite;
		private var ball:FlxExtendedSprite;
		
		public function ExtendedSpriteTest2() 
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
			
			items = new FlxGroup(3);
			
			atari = new FlxExtendedSprite(32, 32, AssetsRegistry.atari800xlPNG);
			atari.alpha = 0.8;
			atari.enableMouseDrag();
			atari.priorityID = 1;
			
			ball = new FlxExtendedSprite(64, 48, AssetsRegistry.shinyBallPNG);
			ball.enableMouseDrag(false, true);
			ball.priorityID = 2;
			
			//	This controls the parameter used to determine which sprite is dragged when one or more of them overlap
			
			FlxMouseControl.sortIndex = "priorityID";
			FlxMouseControl.sortOrder = FlxMouseControl.ASCENDING;
			
			//	In this case the Atari computer sprite overlaps the ball, but it doesn't matter as the ball has a higher priorityID, so it will always get dragged first regardless of its display order
			
			items.add(ball);
			items.add(atari);
			
			add(items);
			
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