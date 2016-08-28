package tests 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	
	public class TestsHeader extends FlxGroup
	{
		[Embed(source = '../../assets/suite/hud.png')] private var hudPNG:Class;
		[Embed(source = '../../assets/suite/back_button_up.png')] private var backUpPNG:Class;
		[Embed(source = '../../assets/suite/back_button_down.png')] private var backDownPNG:Class;
		
		public var overlay:FlxGroup;
		private var background:FlxSprite;
		private var darkBackground:FlxSprite;
		private var hud:FlxSprite;
		private var backButton:FlxButtonPlus;
		public var instructions:FlxText;
		public var mainMenu:Boolean = false;
		
		public function TestsHeader(text:String, showButton:Boolean = true) 
		{
			super();
			
			background = FlxGradient.createGradientFlxSprite(320, 256, [0xff004080, 0xff3C3CFF]);
			FlxGridOverlay.overlay(background, 16, 16, 320, 256, false, true, 0x44e7e6e6, 0x44d9d5d5);
			background.scrollFactor.x = 0;
			background.scrollFactor.y = 0;
			
			darkBackground = FlxGradient.createGradientFlxSprite(320, 256, [0xff191919, 0xff242424]);
			FlxGridOverlay.overlay(darkBackground, 16, 16, 320, 256, false, true, 0x44e7e6e6, 0x44d9d5d5);
			darkBackground.scrollFactor.x = 0;
			darkBackground.scrollFactor.y = 0;
			darkBackground.visible = false;
			
			overlay = new FlxGroup(3);
			
			hud = new FlxSprite(0, 0, hudPNG);
			hud.scrollFactor.x = 0;
			hud.scrollFactor.y = 0;
			
			instructions = new FlxText(0, FlxG.height - 13, 320, text);
			instructions.alignment = "center";
			instructions.scrollFactor.x = 0;
			instructions.scrollFactor.y = 0;
			
			//	Back Button
			backButton = new FlxButtonPlus(285, 0, backToMenu);
			var buttonUp:FlxSprite = new FlxSprite(0, 0, backUpPNG);
			var buttonDown:FlxSprite = new FlxSprite(0, 0, backDownPNG);
			backButton.loadGraphic(buttonUp, buttonDown);
			backButton.visible = showButton;
			
			overlay.add(hud);
			overlay.add(instructions);
			overlay.add(backButton);
			
			add(background);
			add(darkBackground);
			
			//	So we can take screen shots of any of the test suites
			if (FlxG.getPlugin(FlxScreenGrab) == null)
			{
				FlxG.addPlugin(new FlxScreenGrab);
			}
			
			//	Define our hotkey (string value taken from FlxG.keys) the parameters simply say "save it right away" and "hide the mouse first"
			FlxScreenGrab.defineHotKey("F1", true, true);
		}
		
		public function hideHeader():void
		{
			overlay.remove(hud);
			overlay.remove(instructions);
			
			backButton.x += 19;
			backButton.y += 1;
			
			remove(background);
			remove(darkBackground);
		}
		
		public function showDarkBackground():void
		{
			background.visible = false;
			darkBackground.visible = true;
		}
		
		public function showBlackBackground():void
		{
			background.visible = false;
			darkBackground.visible = false;
		}
		
		override public function update():void
		{
			super.update();
			
			if (Registry.info != instructions.text && mainMenu)
			{
				instructions.text = Registry.info;
			}
			
			if (FlxG.keys.justReleased("ESCAPE") && mainMenu == false)
			{
				backToMenu();
			}
		}
		
		private function backToMenu():void
		{
			if (FlxFlod.isPlaying)
			{
				FlxFlod.stopMod();
			}
			
			FlxG.switchState(new DemoSuiteState);
		}
		
	}

}