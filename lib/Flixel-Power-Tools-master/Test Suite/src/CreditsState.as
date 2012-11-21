package  
{
	import flash.geom.Rectangle;
	import flash.utils.Dictionary;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.StarfieldFX;
	import org.flixel.plugin.photonstorm.FX.RainbowLineFX;
	import org.flixel.plugin.photonstorm.FX.SineWaveFX;
	import tests.TestsHeader;
	import com.greensock.TweenMax;
	import com.greensock.easing.Sine;
	import com.greensock.easing.Bounce;

	public class CreditsState extends FlxState
	{
		//	Common variables
		public static var title:String = "The Credits";
		public static var description:String = "We made this!";
		private var instructions:String = "We made this!";
		private var header:TestsHeader;
		
		//	Credits
		private var background:FlxSprite;
		private var flixel:FlxSprite;
		private var power:FlxSprite;
		private var tools:FlxSprite;
		private var photonstorm:FlxSprite;
		private var starfield:StarfieldFX;
		private var rgbline:RainbowLineFX;
		private var font:FlxBitmapFont;
		private var scroller:FlxSprite;
		private var output:FlxSprite;
		private var sinewaveV:SineWaveFX;
		private var mummy:FlxSprite;
		private var ilkke:FlxSprite;
		private var coords:Dictionary;
		
		public function CreditsState() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			
			header.hideHeader();
			
			if (FlxG.getPlugin(FlxSpecialFX) == null)
			{
				FlxG.addPlugin(new FlxSpecialFX);
			}
			
			if (FlxG.getPlugin(FlxScrollingText) == null)
			{
				FlxG.addPlugin(new FlxScrollingText);
			}
			
			starfield = FlxSpecialFX.starfield();
			rgbline = FlxSpecialFX.rainbowLine();
			rgbline.create(0, 18, 320, 1, null, 360, 4);
			
			starfield.create(0, 0, 320, 256, 256);
			
			//font = new FlxBitmapFont(AssetsRegistry.smallPurpleFontPNG, 16, 10, FlxBitmapFont.TEXT_SET10 + ":.!?", 10);
			//font = new FlxBitmapFont(AssetsRegistry.tinyPNG, 7, 8, FlxBitmapFont.TEXT_SET10 + ":/.!',-701234 6", 21, 1, 1);
			font = new FlxBitmapFont(AssetsRegistry.knightHawksPurpleFontPNG, 31, 25, FlxBitmapFont.TEXT_SET6, 10, 1, 1);
			//font = new FlxBitmapFont(AssetsRegistry.bluepinkFontPNG, 32, 32, FlxBitmapFont.TEXT_SET2, 10);
			
			var scrollText:String = "- PHOTON STORM - ARE HAPPY TO PRESENT V1.8 OF THE FLIXEL POWER TOOLS            ";
			scrollText = scrollText.concat("THIS RELEASE IS THE BIGGEST YET! WITH STACKS OF NEW FEATURES JUST WAITING TO HIT YOUR GAMES.      ");
			scrollText = scrollText.concat("CREDITS: ALL CODE BY RICH DAVEY ...... GRAPHICS ON THIS SCREEN, AND IN LOTS OF THE DEMOS: ILIJA MELENTIJEVIC (ILKKE) ...... ");
			scrollText = scrollText.concat("MUSIC TAKEN FROM THE FALCON 030 DEMO OBNOXIOUS BY INTER ...... ");
			scrollText = scrollText.concat("WARNING: LOTS OF THE GRAPHICS YOU SEE IN THE DEMO SUITE ARE RIPPED FROM COMMERCIAL GAMES. SO DON'T USE THEM! ......");
			scrollText = scrollText.concat("MY THANKS TO ADAM BOTH FOR RELEASING FLIXEL, AND FOR LISTENING TO MY DAFT REQUESTS TIME AFTER TIME - AND USUALLY IMPLEMENTING THEM!      ");
			scrollText = scrollText.concat("ALSO HI TO ALL THE GUYS ON THE FLIXEL.ORG FORUMS - HOPE YOU FIND THESE TOOLS USEFUL DUDES :)      ......      ");
			scrollText = scrollText.concat("I'VE GOT LOTS OF THINGS PLANNED FOR V1.8, BUT AM GOING TO TAKE A SHORT BREAK TO WORK ON BUG FIXING AND RELEASING SOME NEW GAMES.      ");
			scrollText = scrollText.concat("BUT YOU CAN FIND ALL THAT WE RELEASE ON WWW.PHOTONSTORM.COM --- SO DO CHECK IT OUT :) --------------------------------------------    ");
			scrollText = scrollText.concat("RIGHT THAT'S ENOUGH FOR NOW, TIME TO WRAP! ....................................................                          ");
			
			scroller = FlxScrollingText.add(font, new Rectangle(0, 0, 320, font.characterHeight), 4, 0, scrollText);
			scroller.y = 212;
			
			sinewaveV = FlxSpecialFX.sineWave();
			output = sinewaveV.createFromFlxSprite(scroller, SineWaveFX.WAVETYPE_VERTICAL_SINE, 8, scroller.width, 2, 1, true);
			sinewaveV.start();
			
			mummy = new FlxSprite(0, 210);
			mummy.loadGraphic(AssetsRegistry.mummyPNG, true, true, 37, 45);
			mummy.addAnimation("walk", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
			mummy.play("walk");
			mummy.facing = FlxObject.RIGHT;
			mummy.velocity.x = 20;
			
			ilkke = new FlxSprite(302, 249, AssetsRegistry.creditsIlkkePNG);
			
			background = new FlxSprite(0, 0, AssetsRegistry.creditsBackgroundPNG);
			flixel = new FlxSprite(17, 89, AssetsRegistry.creditsFlixelPNG);
			power = new FlxSprite(41, 142, AssetsRegistry.creditsPowerPNG);
			tools = new FlxSprite(41, 195, AssetsRegistry.creditsToolsPNG);
			photonstorm = new FlxSprite(204, 5, AssetsRegistry.creditsPhotonStormPNG);
			
			coords = new Dictionary(true);
			coords[flixel] = new FlxPoint(flixel.x, flixel.y);
			coords[power] = new FlxPoint(power.x, power.y);
			coords[tools] = new FlxPoint(tools.x, tools.y);
			
			FlxDisplay.screenCenter(photonstorm);
			photonstorm.y = -64;
			TweenMax.to(photonstorm, 2, { y: 20, yoyo: true, repeat: -1, ease: Bounce.easeOut } );
			
			flixel.x = 500;
			flixel.y -= 45;
			TweenMax.to(flixel, 2, { x: coords[flixel].x - 40, yoyo: true, repeat: -1, ease: Sine.easeInOut } );
			
			power.x = 500;
			power.y -= 45;
			TweenMax.to(power, 2, { x: coords[power].x - 40, yoyo: true, repeat: -1, ease: Sine.easeInOut, delay: 0.1 } );
			
			tools.x = 500;
			tools.y -= 45;
			TweenMax.to(tools, 2, { x: coords[tools].x - 40, yoyo: true, repeat: -1, ease: Sine.easeInOut, delay: 0.2 } );
			
			TweenMax.to(ilkke, 2, { x: 100, yoyo: true, repeat: -1, ease: Sine.easeOut, delay: 1, repeatDelay: 4 } );
				
			FlxFlod.playMod(AssetsRegistry.obnoxiousMOD);
			
			add(starfield.sprite);
			add(rgbline.sprite);
			add(ilkke);
			add(mummy);
			add(background);
			add(tools);
			add(power);
			add(flixel);
			add(output);
			add(photonstorm);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (mummy.x > 340)
			{
				mummy.facing = FlxObject.LEFT;
				mummy.velocity.x = -20;
			}
			else if (mummy.x < 0)
			{
				mummy.facing = FlxObject.RIGHT;
				mummy.velocity.x = 20;
			}
			
			if (FlxG.mouse.justPressed())
			{
				starfield.setStarSpeed(FlxMath.randFloat(-1, 1), FlxMath.randFloat(-1, 1));
			}
		}
		
		override public function destroy():void
		{
			FlxSpecialFX.clear();
			FlxScrollingText.clear();
			
			super.destroy();
		}
		
		
	}

}