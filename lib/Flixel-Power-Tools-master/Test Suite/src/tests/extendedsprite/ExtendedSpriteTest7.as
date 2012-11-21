package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest7 extends FlxState
	{
		//	Common variables
		public static var title:String = "Sprite Throw 1";
		public static var description:String = "Throw a Sprite";
		private var instructions:String = "Throw the sprite with the mouse";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var ball:FlxExtendedSprite;
		
		public function ExtendedSpriteTest7() 
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
			
			ball = new FlxExtendedSprite(64, 48, AssetsRegistry.shinyBallPNG);
			
			//	Just to make it visually more interesting we apply gravity pulling the ball down
			ball.setGravity(0, 100, 500, 500, 10, 10);
			
			//	For the best feeling you should enable Mouse Drag along with Mouse Throw, but it's not essential.
			//	If you don't enable Drag or Clicks then enabling Mouse Throw will automatically enable Mouse Clicks.
			ball.enableMouseDrag(true, true);
			
			//	The x/y factors depend on how fast you want the sprite to move - here we use 50, so its sprite velocity = mouse speed * 50
			ball.enableMouseThrow(50, 50);
			
			//	Allow the ball to rebound a little bit, but it will eventually slow to a halt
			ball.elasticity = 0.5;
			
			//	Some walls to collide against
			add(FlxCollision.createCameraWall(FlxG.camera, FlxCollision.CAMERA_WALL_OUTSIDE, 16, true));
			
			add(ball);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			FlxG.collide();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxMouseControl.clear();
			
			super.destroy();
		}
		
	}

}