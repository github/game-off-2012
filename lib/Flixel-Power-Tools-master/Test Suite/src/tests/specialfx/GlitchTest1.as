package tests.specialfx 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.GlitchFX;
	import tests.TestsHeader;

	public class GlitchTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "GlitchFX 1";
		public static var description:String = "Glitch FX Plugin";
		private var instructions:String = "Glitch distortion effect. Click to randomise.";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var glitch:GlitchFX;
		private var scratch:FlxSprite;
		
		public function GlitchTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			if (FlxG.getPlugin(FlxSpecialFX) == null)
			{
				FlxG.addPlugin(new FlxSpecialFX);
			}
			
			header.showDarkBackground();
			
			var pic:FlxSprite = new FlxSprite(96, 40, AssetsRegistry.shockAngel2PNG);
			
			glitch = FlxSpecialFX.glitch();
			
			scratch = glitch.createFromFlxSprite(pic, 2, 2);
			
			glitch.start(4);
			
			add(scratch);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.justPressed())
			{
				var rndGlitch:uint = FlxMath.rand(2, 8);
				var rndSkip:uint = FlxMath.rand(1, 8);
				
				header.instructions.text = "Glitch Max " + rndGlitch + "    Skip Max " + rndSkip;
				
				glitch.changeGlitchValues(rndGlitch, rndSkip);
			}
		}
		
		override public function destroy():void
		{
			//	Important! Clear out the plugin, otherwise resources will get messed right up after a while
			FlxSpecialFX.clear();
			
			super.destroy();
		}
		
	}

}