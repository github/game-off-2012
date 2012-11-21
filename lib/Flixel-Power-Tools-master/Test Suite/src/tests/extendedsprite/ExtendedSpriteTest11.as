package tests.extendedsprite 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.controls.ControlTestScene3;
	import tests.TestsHeader;

	public class ExtendedSpriteTest11 extends FlxState
	{
		//	Common variables
		public static var title:String = "Sprite Throw 2";
		public static var description:String = "Throw a Sprite in a map";
		private var instructions:String = "Throw the sprite around the map";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		private var level:ControlTestScene3;
		private var ball:FlxExtendedSprite;
		private var debug:FlxText;
		
		public function ExtendedSpriteTest11() 
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
			
			header.showDarkBackground();
			
			level = new ControlTestScene3();
			
			ball = new FlxExtendedSprite(64, 32, AssetsRegistry.redPNG);
			
			//	Just to make it visually more interesting we apply gravity pulling the ball down
			ball.setGravity(0, 100, 500, 500, 10, 10);
			
			//	For the best feeling you should enable Mouse Drag along with Mouse Throw, but it's not essential.
			//	If you don't enable Drag or Clicks then enabling Mouse Throw will automatically enable Mouse Clicks.
			ball.enableMouseDrag(false, true);
			
			//	The x/y factors depend on how fast you want the sprite to move - here we use 50, so its sprite velocity = mouse speed * 50
			ball.enableMouseThrow(50, 50);
			
			//	Allow the ball to rebound a little bit, but it will eventually slow to a halt
			ball.elasticity = 0.5;
			
			//	Make the camera follow the ball
			FlxG.camera.follow(ball);
			
			//	The deadzone is the most important thing to get right when using mouse drag AND scrolling cameras
			//	When the mouse LEAVES the deadzone and is dragging the follow target, the camera will start to move REALLY fast.
			//	So you need to ensure the deadzone is a good large size, and ideally link the FlxMouseControl to it
			//	Also make sure the sprite starts WITHIN the deadzone, or it can never be dragged!
			
			FlxG.camera.deadzone = new FlxRect(32, 32, FlxG.width - 64, FlxG.height - 64);
			
			FlxMouseControl.linkToDeadZone = true;
			
			add(level);
			add(ball);
			
			debug = new FlxText(0, 32, 300, "");
			debug.scrollFactor.x = 0;
			debug.scrollFactor.y = 0;
			
			add(debug);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			//debug.text = "Mouse x: " + int(FlxG.mouse.x) + " y: " + int(FlxG.mouse.y) + " sx: " + FlxG.mouse.screenX + " sy: " + FlxG.mouse.screenY;
			
			FlxG.collide(level, ball);
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin otherwise resources will get messed right up after a while
			FlxMouseControl.clear();
			
			super.destroy();
		}
		
	}

}