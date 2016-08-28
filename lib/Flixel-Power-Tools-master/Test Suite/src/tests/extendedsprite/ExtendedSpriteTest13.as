package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ExtendedSpriteTest13 extends FlxState
	{
		//	Common variables
		public static var title:String = "Springs 2";
		public static var description:String = "Mouse Spring only active on click";
		private var instructions:String = "The spring is only active on click";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var ball:FlxExtendedSprite;
		private var debug:FlxSprite;
		
		public function ExtendedSpriteTest13() 
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
			
			ball = new FlxExtendedSprite(160, 120, AssetsRegistry.redPNG);
			ball.enableMouseSpring(true);
			
			//	As the sprite is 16x16 and we want the spring to attach to the middle of it, we need an 8x8 offset
			ball.springOffsetX = 8;
			ball.springOffsetY = 8;
			
			debug = new FlxSprite(0, 0).makeGraphic(FlxG.width, FlxG.height, 0x0);
			debug.solid = false;
			
			//	Walls for the ball to rebound off, positioned just outside the camera edges
			add(FlxCollision.createCameraWall(FlxG.camera, FlxCollision.CAMERA_WALL_OUTSIDE, 16, true));
			
			add(debug);
			add(ball);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			FlxG.collide();
			
			//	Draw the spring
			
			debug.fill(0x0);
			
			if (ball.isPressed)
			{
				debug.drawLine(ball.springX, ball.springY, FlxG.mouse.x, FlxG.mouse.y, 0xffFFFFFF, 1);
			}
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxMouseControl.clear();
			
			super.destroy();
		}
		
	}

}