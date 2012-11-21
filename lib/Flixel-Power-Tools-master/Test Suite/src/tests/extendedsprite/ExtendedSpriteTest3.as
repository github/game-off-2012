package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest3 extends FlxState
	{
		//	Common variables
		public static var title:String = "Sprite Drag 3";
		public static var description:String = "Direction Locked Dragging";
		private var instructions:String = "The arrows are direction drag-locked";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var arrow1:FlxExtendedSprite;
		private var arrow2:FlxExtendedSprite;
		
		public function ExtendedSpriteTest3() 
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
			
			arrow1 = new FlxExtendedSprite(160, 160);
			arrow1.loadGraphic(AssetsRegistry.arrowsPNG, true, false, 23, 31);
			arrow1.frame = 1;
			arrow1.enableMouseDrag(false, true);
			
			//	This arrow can only move horizontally
			arrow1.setDragLock(true, false);
			
			arrow2 = new FlxExtendedSprite(64, 160);
			arrow2.loadGraphic(AssetsRegistry.arrowsPNG, true, false, 23, 31);
			arrow2.frame = 2;
			arrow2.angle = 270;
			arrow2.enableMouseDrag(false, true);
			
			//	This arrow can only move vertically
			arrow2.setDragLock(false, true);
			
			add(arrow1);
			add(arrow2);
			
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