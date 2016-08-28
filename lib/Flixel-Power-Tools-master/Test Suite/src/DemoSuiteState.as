/**
 * Flixel Power Tools Test Suite
 * 
 * v1.9 - Lots of small updates and bug fixes
 * v1.8 - Extended Sprites and new FlxFlectrum / FlxFlod class
 * v1.7 - New FlxBar and FlxWeapon tests
 * v1.6 - FlxControl and new Special FX Plugins
 * v1.5 - Massive restructure to split the tests up and move to git
 * v1.4 - Scrolling Text and new Special FX Plugin systems added
 * v1.3 - Updated for Flixel v2.53
 * 
 * @version 1.9 - October 10th 2011
 * @link http://www.photonstorm.com
 * @author Richard Davey / Photon Storm
*/

package  
{
	import flash.display.Sprite;
	
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	
	import tests.*;
	import tests.api.*;
	import tests.bitmapfont.*;
	import tests.buttonplus.*;
	import tests.collision.*;
	import tests.color.*;
	import tests.controls.*;
	import tests.delay.*;
	import tests.display.*;
	import tests.extendedsprite.*;
	import tests.flod.*;
	import tests.gradient.*;
	import tests.linkedgroup.*;
	import tests.flxbar.*;
	import tests.screengrab.*;
	import tests.scrollingtext.*;
	import tests.scrollzone.*;
	import tests.specialfx.*;
	import tests.velocity.*;
	import tests.weapon.*;
	import tests.wip.*;
	
	public class DemoSuiteState extends FlxState
	{
		[Embed(source = '../assets/suite/exocet_spaceman.png')] private var spacemanPNG:Class;
		[Embed(source = '../assets/suite/amigamouse.png')] private var mouseCursorPNG:Class;
		[Embed(source = '../assets/fonts/087.png')] private var blueFontPNG:Class;
		
		//	Press SPACE to jump to this one quickly
		private var shortcut:Class = WeaponTest6;
		
		private var version:String;
		private var options:Array;
		
		//	Sections Menu List
		private var sections:Array;
		private var sectionList:FlxGroup;
		private var list:FlxRect;
		private var spaceman:FlxSprite;
		private var listBackground:FlxSprite;
		
		//	Sections
		private var sectionTitle:FlxBitmapFont;
		private var sectionBG:FlxSprite;
		private var demoList:DemoSuiteSection;
		
		//	Misc
		private var header:TestsHeader;
		private var dolly:FlxSprite;
		private var credits:FlxButton;
		private var menuVisible:Boolean = true;
		
		public function DemoSuiteState()
		{
			sections = new Array;
			
			sections.push( { title: "Bitmap Fonts", 	isNew: false, 	pic: AssetsRegistry.shockAngel1PNG } );
			sections.push( { title: "Button Plus", 		isNew: false,	pic: AssetsRegistry.vulkaiserRedPNG } );
			sections.push( { title: "Collision", 		isNew: false,	pic: AssetsRegistry.nonohaPinkPNG } );
			sections.push( { title: "Color", 			isNew: false,	pic: AssetsRegistry.shockLulu2PNG } );
			sections.push( { title: "Controls", 		isNew: false,	pic: AssetsRegistry.nonohaPurplePNG } );
			sections.push( { title: "Delay", 			isNew: false,	pic: AssetsRegistry.pigChampagnePNG } );
			sections.push( { title: "Display", 			isNew: false,	pic: AssetsRegistry.nonohaBluePNG } );
			sections.push( { title: "Extended Sprites",	isNew: false,	pic: AssetsRegistry.ladyCopyPNG } );
			sections.push( { title: "Flod", 			isNew: false,	pic: AssetsRegistry.cactuarPNG } );
			sections.push( { title: "FlxBar", 			isNew: false,	pic: AssetsRegistry.spyroPNG } );
			sections.push( { title: "Gradient", 		isNew: false,	pic: AssetsRegistry.goldenGirlMackPNG } );
			//sections.push( { title: "Linked Group",		isNew: true,	pic: AssetsRegistry.goldenGirlMackPNG } );
			sections.push( { title: "Screen Grab", 		isNew: false,	pic: AssetsRegistry.ayaTouhouTengPNG } );
			sections.push( { title: "Scrolling Text", 	isNew: false,	pic: AssetsRegistry.shockLuluPNG } );
			sections.push( { title: "Scrolling Zones", 	isNew: false,	pic: AssetsRegistry.profilSadPlushPNG } );
			sections.push( { title: "Special FX", 		isNew: false, 	pic: AssetsRegistry.shockAngel2PNG } );
			sections.push( { title: "Velocity", 		isNew: false,	pic: AssetsRegistry.nslideSnotPNG } );
			sections.push( { title: "Weapons", 			isNew: false,	pic: AssetsRegistry.shockLeon2PNG } );
			
			options = new Array;
			
			options["Bitmap Fonts"] = [BitmapFontTest1, BitmapFontTest2, BitmapFontTest3];
			options["Button Plus"] = [ButtonPlusTest1];
			options["Collision"] = [CollisionTest1, CollisionTest2, CollisionTest3, CollisionTest4];
			options["Color"] = [ColorTest1, ColorTest2];
			options["Controls"] = [ControlTest1, ControlTest2, ControlTest3, ControlTest4, ControlTest5, ControlTest6, ControlTest7 ];
			options["Delay"] = [DelayTest1];
			options["Display"] = [AlphaMaskTest1, AlphaMaskTest2, AlphaMaskTest3];
			options["Extended Sprites"] = [ExtendedSpriteTest1, ExtendedSpriteTest2, ExtendedSpriteTest3, ExtendedSpriteTest4, ExtendedSpriteTest5, ExtendedSpriteTest6, ExtendedSpriteTest7, ExtendedSpriteTest8, ExtendedSpriteTest9, ExtendedSpriteTest10, ExtendedSpriteTest11, ExtendedSpriteTest12, ExtendedSpriteTest13, ExtendedSpriteTest14];
			options["Flod"] = [FlodTest1, FlodTest2, FlodTest3];
			options["FlxBar"] = [FlxBarTest1, FlxBarTest2, FlxBarTest3, FlxBarTest4, FlxBarTest5];
			options["Gradient"] = [GradientTest1, GradientTest2, GradientTest3];
			//options["Linked Group"] = [LinkedGroupTest1];
			options["Screen Grab"] = [ScreenGrabTest1, ScreenGrabTest2];
			options["Scrolling Text"] = [ScrollingTextTest1, ScrollingTextTest2, ScrollingTextTest3];
			options["Scrolling Zones"] = [ScrollZoneTest1, ScrollZoneTest2, ScrollZoneTest3, ScrollZoneTest4, ScrollZoneTest5];
			options["Special FX"] = [BlurTest1, BlurTest2, CenterSlideTest1, FloodFillTest1, FloodFillTest2, GlitchTest1, PlasmaTest1, RainbowLineTest1, SineWaveTest1, SineWaveTest2, SineWaveTest3, SineWaveTest4, StarFieldTest1, StarFieldTest2];
			options["Velocity"] = [VelocityTest1, VelocityTest2, VelocityTest3, VelocityTest4];
			options["Weapons"] = [WeaponTest1, WeaponTest2, WeaponTest3, WeaponTest4, WeaponTest5, WeaponTest6, WeaponTest7, WeaponTest8, WeaponTest9, WeaponTest10];
		}
		
		override public function create():void
		{
			version = "- Demo Suite v" + FlxPowerTools.LIBRARY_MAJOR_VERSION + "." + FlxPowerTools.LIBRARY_MINOR_VERSION + " - Contains " + countTests().toString() + " examples -";

			header = new TestsHeader(version, false);
			header.showDarkBackground();
			header.mainMenu = true;
			
			FlxG.mouse.load(mouseCursorPNG, 2);
			
			//	Section Menu List
			
			listBackground = new FlxSprite(200 - 32, 33).makeGraphic(150, 11, 0xffe06000);
			listBackground.visible = false;
			
			sectionList = new FlxGroup(sections.length);
			
			var tx:int = 200 - 32;
			var ty:int = 32 - 8;
			
			for each (var item:Object in sections)
			{
				var txt:FlxText = new FlxText(tx, ty, 160, item.title);
				
				if (item.isNew)
				{
					txt.text = txt.text.concat("    (new)");
				}
				
				txt.shadow = 0xff000000;
				
				sectionList.add(txt);
				
				ty += 12;
			}
			
			list = new FlxRect(tx, 32 - 8, 160, ty - (32));
			
			//	Sections
			
			sectionTitle = new FlxBitmapFont(blueFontPNG, 16, 16, FlxBitmapFont.TEXT_SET10 + ")!()", 20);
			sectionTitle.setText("Bitmap Fonts");
			sectionTitle.x = 320 + 16;
			sectionTitle.y = 32;
			
			sectionBG = FlxGradient.createGradientFlxSprite(260, 26, [0xff000000, 0xff000000, 0xff000000, 0x00000000], 1, 0);
			sectionBG.x = 332;
			sectionBG.y = 28;
			
			//	Default list
			
			dolly = new FlxSprite(160, 0);
			dolly.makeGraphic(1, 1, 0xffffffff);
			
			if (Registry.currentSection != "")
			{
				demoList = new DemoSuiteSection(options[Registry.currentSection], sections[Registry.currentSectionID].pic);
				sectionTitle.text = Registry.currentSection;
				dolly.x = 480;
				menuVisible = false;
			}
			else
			{
				demoList = new DemoSuiteSection(options["Bitmap Fonts"]);
			}
			
			//	Misc stuff
			
			spaceman = new FlxSprite(0, 0, spacemanPNG);
			
			credits = new FlxButton(16, 214, "Credits", runCredits);
			
			FlxG.camera.follow(dolly);
			FlxG.camera.setBounds(0, 0, 640, 256, true);
			FlxG.mouse.show();
			
			add(header);
			add(dolly);
			add(listBackground);
			add(spaceman);
			add(sectionList);
			add(demoList);
			//add(sectionBG);
			add(sectionTitle);
			add(credits);
			add(header.overlay);
		}
		
		private function jumpToSection(s:int):void
		{
			sectionTitle.text = sections[s].title;
			
			remove(demoList);
			
			demoList = new DemoSuiteSection(options[sections[s].title], sections[s].pic);
			
			Registry.currentSectionID = s;
			Registry.currentSection = sections[s].title;
			
			add(demoList);
			
			FlxVelocity.moveTowardsPoint(dolly, new FlxPoint(480, 0), 60, 500);
			
			menuVisible = false;
		}
		
		override public function update():void
		{
			super.update();
			
			if (menuVisible == false)
			{
				if (dolly.x > 480)
				{
					dolly.velocity.x = 0;
					dolly.velocity.y = 0;
					dolly.x = 480;
					dolly.y = 0;
				}
				
				if (Registry.info == "")
				{
					Registry.info = "Press ESCAPE to Return to the Main, or exit any demo";
				}
			}
			
			if (menuVisible)
			{
				if (dolly.velocity.x != 0)
				{
					if (dolly.x < 160)
					{
						dolly.velocity.x = 0;
						dolly.velocity.y = 0;
						dolly.x = 160;
						dolly.y = 0;
					}
				}
				
				if (FlxMath.pointInFlxRect(FlxG.mouse.screenX, FlxG.mouse.screenY, list))
				{
					//	Where in the list is it? (each entry is 12 pixels high)
					var mx:int = (FlxG.mouse.screenY - list.top) / 12;
					
					if (sectionList.members[mx])
					{
						listBackground.y = sectionList.members[mx].y + 2;
						listBackground.visible = true;
						header.instructions.text = getInfo(mx);
					}
					
					if (FlxG.mouse.justReleased())
					{
						jumpToSection(mx);
					}
				}
				else
				{
					listBackground.visible = false;
					header.instructions.text = version;
				}
			}
			
			//	Short-cut to save scrolling when debugging!
			if (FlxG.keys.justReleased("ESCAPE") && menuVisible == false)
			{
				FlxVelocity.moveTowardsPoint(dolly, new FlxPoint(160, 0), 60, 500);
				menuVisible = true;
			}
			
			if (FlxG.keys.justReleased("SPACE"))
			{
				startTest(shortcut);
			}
		}
		
		private function getInfo(mx:int):String
		{
			//	It's ugly, but it works
			var output:String = "- " + sections[mx].title + " contains ";
			
			output = output.concat((options[sections[mx].title] as Array).length.toString());
			
			output = output.concat(" demos -");
			
			return output;
		}
		
		private function countTests():int
		{
			var result:int = 0;
			
			for each (var item:Array in options)
			{
				result += item.length;
			}
			
			return result;
		}
		
		private function startTest(state:Class):void
		{
			FlxG.switchState(new state);
		}
		
		private function runCredits():void
		{
			FlxG.switchState(new CreditsState);
		}
		
		private function dump():void
		{
			trace("stage numChildren", FlxG.stage.numChildren);
			trace("stage child 1", FlxG.stage.getChildAt(0));
			
			trace("Preloader numChildren", Sprite(FlxG.stage.getChildAt(0)).numChildren);
			trace("Preloader child 1", Sprite(FlxG.stage.getChildAt(0)).getChildAt(0));
			
			var mainRef:Sprite = Sprite(FlxG.stage.getChildAt(0)).getChildAt(0) as Sprite;
			
			trace("Main numChildren", mainRef.numChildren);
			
			trace("Main child 1", mainRef.getChildAt(0), "Game Camera 1");
			trace("Main child 2", mainRef.getChildAt(1), "Mouse Pointer");
			trace("Main child 3", mainRef.getChildAt(2), "FlxDebugger");
			trace("Main child 4", mainRef.getChildAt(3), "Sound Tray");
			trace("Main child 5", mainRef.getChildAt(4), "Focus Screen");
			
			trace("Game numChildren", Sprite(mainRef.getChildAt(0)).numChildren);
			
			var gameRef:Sprite = Sprite(mainRef.getChildAt(0));
			
			trace("Game child 1", gameRef.getChildAt(0), "The Bitmap to which your game is rendered");
		}
		
	}

}