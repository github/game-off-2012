package tests.specialfx 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.FX.CenterSlideFX;
	import tests.TestsHeader;

	public class CenterSlideTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "CenterSlide 1";
		public static var description:String = "CenterSlide FX Plugin";
		private var instructions:String = "Click to start the effect";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var delay:FlxDelay;
		private var slide:CenterSlideFX;
		private var pic:FlxSprite;
		private var currentSlide:int = 0;
		
		public function CenterSlideTest1() 
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
			
			//	This is just a 2 second delay timer, so you get to see the picture once it has revealed
			delay = new FlxDelay(2000);
			delay.callback = changeSlide;
			
			//	Create the Slide FX
			slide = FlxSpecialFX.centerSlide();
			
			//	Here we'll create it from an embedded PNG, positioned at 0,0 and it'll do a vertical reveal to start with
			pic = slide.createFromClass(AssetsRegistry.sevenseasPNG, 0, 0, CenterSlideFX.REVEAL_VERTICAL);
			
			//	Once the reveal completes set the delay timer running, after 2 seconds the delay timer callback will hide the changeSlide function
			slide.completeCallback = delay.start;
			
			add(pic);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
			
			if (FlxG.mouse.justReleased() && slide.complete == false)
			{
				header.instructions.text = "Reveal - Vertical";
				slide.start();
			}
		}
		
		/**
		 * This function is called by the Delay Timer after the picture has appeared for 2 seconds.<br>
		 * It just cycles through the 4 different ways of using CenterSlideFX
		 */
		private function changeSlide():void
		{
			remove(pic);
			
			if (currentSlide == 0)
			{
				header.instructions.text = "Hide - Horizontal";
				pic = slide.createFromClass(AssetsRegistry.sevenseasPNG, 0, 0, CenterSlideFX.HIDE_HORIZONTAL);
			}
			else if (currentSlide == 1)
			{
				header.instructions.text = "Reveal - Horizontal";
				pic = slide.createFromClass(AssetsRegistry.questarPNG, 0, 0, CenterSlideFX.REVEAL_HORIZONTAL);
			}
			else if (currentSlide == 2)
			{
				header.instructions.text = "Hide - Vertical";
				pic = slide.createFromClass(AssetsRegistry.questarPNG, 0, 0, CenterSlideFX.HIDE_VERTICAL);
			}
			else if (currentSlide == 3)
			{
				header.instructions.text = "Reveal - Vertical";
				pic = slide.createFromClass(AssetsRegistry.sevenseasPNG, 0, 0, CenterSlideFX.REVEAL_VERTICAL);
			}
			
			add(pic);
			
			slide.start();
			
			currentSlide++;
			
			if (currentSlide == 4)
			{
				currentSlide = 0;
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