package tests.screengrab 
{
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.StarfieldFX;
	import tests.TestsHeader;

	public class ScreenGrabTest2 extends FlxState
	{
		//	Common variables
		public static var title:String = "ScreenGrab 2";
		public static var description:String = "Captures specific region of the screen";
		private var instructions:String = "Click to capture the region and save to PNG";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var canvas:FlxSprite;
		private var camera:FlxSprite;
		private var pic:FlxSprite;
		private var stars:StarfieldFX;
		private var starfield:FlxSprite;
		private var balls:FlxEmitter;
		
		public function ScreenGrabTest2() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	If the FlxScreenGrab Plugin isn't already in use, we add it here
			if (FlxG.getPlugin(FlxScreenGrab) == null)
			{
				FlxG.addPlugin(new FlxScreenGrab);
			}
			
			if (FlxG.getPlugin(FlxSpecialFX) == null)
			{
				FlxG.addPlugin(new FlxSpecialFX);
			}
			
			//	Define our hotkey (string value taken from FlxG.keys) the parameters simply say "save it right away" and "hide the mouse first"
			//	The reason this is commented out is because the Test Suite has this code in the TestHeader.as, so you can grab screens from any test!
			
			//FlxScreenGrab.defineHotKey("F1", true, true);
			
			camera = new FlxSprite(0, 0).makeGraphic(121, 121, 0x0);
			camera.drawLine(0, 0, 120, 0, 0xffffffff);
			camera.drawLine(0, 120, 120, 120, 0xffffffff);
			camera.drawLine(0, 0, 0, 120, 0xffffffff);
			camera.drawLine(120, 0, 120, 120, 0xffffffff);
			
			//	From here on down it's just graphics and stuff to make the screen grab interesting ;)
			canvas = new FlxSprite(0, 28).makeGraphic(320, 190, 0xff000000, true);
			canvas.drawLine(0, 0, canvas.width, 0, 0xffffffff);
			canvas.drawLine(0, canvas.height - 1, canvas.width, canvas.height - 1, 0xffffffff);
			
			stars = FlxSpecialFX.starfield();
			starfield = stars.create(0, canvas.y + 1, 320, canvas.height - 50, 90);
			stars.setBackgroundColor(0x00);
			
			pic = new FlxSprite(0, 0, AssetsRegistry.spazPNG);
			pic.y = (canvas.y + canvas.height) - pic.height - 1;
			
			balls = new FlxEmitter(160, 150);
			balls.gravity = -100;
			balls.minRotation = 0;
			balls.maxRotation = 0;
			balls.makeParticles(AssetsRegistry.ballsPNG, 30, 0, true, 0);
			balls.start(false);
			
			add(canvas);
			add(pic);
			add(starfield);
			add(balls);
			add(camera);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			camera.x = FlxG.mouse.screenX;
			camera.y = FlxG.mouse.screenY;
			
			if (FlxG.mouse.justReleased())
			{
				//	We * 2 here because the Test Suite is zoomed in x2 (there's no way to get that info back from Flixel currently)
				FlxScreenGrab.grab(new Rectangle((camera.x * 2) + 1, (camera.y * 2) + 1, 120 * 2, 120 * 2), true, true);
			}
		}
		
		override public function destroy():void
		{
			FlxSpecialFX.clear();
			super.destroy();
		}
		
	}

}