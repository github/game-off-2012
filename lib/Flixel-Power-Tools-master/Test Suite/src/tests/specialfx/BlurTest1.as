package tests.specialfx 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.BlurFX;
	import tests.TestsHeader;

	public class BlurTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Blur 1";
		public static var description:String = "Blur FX Plugin";
		private var instructions:String = "Move the mouse :)";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var blur:BlurFX;
		private var blurEffect:FlxSprite;
		private var ball:FlxSprite;
		private var timer:FlxDelay;
		
		public function BlurTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			header.showDarkBackground();
			
			if (FlxG.getPlugin(FlxSpecialFX) == null)
			{
				FlxG.addPlugin(new FlxSpecialFX);
			}
			
			//	Something to move around to create a blur trail
			ball = new FlxSprite(0, 0);
			ball.loadGraphic(AssetsRegistry.ballsPNG, true, false, 17, 17);
			ball.replaceColor(0xff000000, 0x0); // this just removes the black border from the balls, gives a smoother blur effect
			
			//	The plugin
			blur = FlxSpecialFX.blur();
			
			blurEffect = blur.create(320, 240, 2, 2, 1);
			
			blur.addSprite(ball);
			
			add(blurEffect);
			add(ball);
			
			blur.start(2);
			
			//	Just a timer to change the ball color every few seconds
			timer = new FlxDelay(2000);
			timer.start();
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			ball.x = FlxG.mouse.screenX;
			ball.y = FlxG.mouse.screenY;
			
			if (timer.hasExpired)
			{
				ball.frame++;
				
				if (ball.frame == ball.frames)
				{
					ball.frame = 1;
				}
				
				timer.start();
			}
			
			super.update();
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin, otherwise resources will get messed right up after a while
			FlxSpecialFX.clear();
			
			super.destroy();
		}
		
	}

}