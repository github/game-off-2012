package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest8 extends FlxState
	{
		//	Common variables
		public static var title:String = "Mouse Zone 1";
		public static var description:String = "Limit mouse actions to an FlxRect";
		private var instructions:String = "Mouse can only click/drag/throw while in this zone";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var ball:FlxExtendedSprite;
		private var walls:FlxGroup;
		
		public function ExtendedSpriteTest8() 
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
			
			//	The Mouse Zone is a region outside of which mouse actions are ignored.
			//	For example you won't be able to click, drag or throw the ball unless it's within the mouse zone.
			//	If you are dragging the ball and the mouse leaves the zone, it'll automatically let go.
			FlxMouseControl.mouseZone = new FlxRect(0, 156, 320, 100);
			
			//	This is just so we can visually see the mouse zone - it's not required for actual use
			var debugZone:FlxSprite = new FlxSprite(0, 156).makeGraphic(320, 100, 0x55FF0080);
			
			//	From here on down it's mostly the same as ExtendedSpriteTest7
			ball = new FlxExtendedSprite(64, 48, AssetsRegistry.shinyBallPNG);
			
			//	Just to make it visually more interesting we apply gravity pulling the ball down
			ball.setGravity(0, 100);
			
			//	For the best feeling you should enable Mouse Drag along with Mouse Throw, but it's not essential.
			//	If you don't enable Drag or Clicks then enabling Mouse Throw will automatically enable Mouse Clicks.
			ball.enableMouseDrag(true, true);
			
			//	The x/y factors depend on how fast you want the sprite to move - here we use 50, so its sprite velocity = mouse speed * 50
			ball.enableMouseThrow(50, 50);
			
			//	Allow the ball to rebound a little bit, but it will eventually slow to a halt
			ball.elasticity = 0.5;
			
			//	Some walls to collide against
			walls = FlxCollision.createCameraWall(FlxG.camera, FlxCollision.CAMERA_WALL_OUTSIDE, 16, true);
			
			add(debugZone);
			add(walls);
			add(ball);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			FlxG.collide(ball, walls);
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxMouseControl.clear();
			
			super.destroy();
		}
		
	}

}