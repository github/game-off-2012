package tests.api 
{
	import flash.text.TextField;
	import flash.text.TextFormat;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import org.flixel.plugin.photonstorm.API.FlxKongregate;
	import tests.TestsHeader;

	public class KongregateAPITest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Kongregate";
		public static var description:String = "Using the Kongregate API";
		private var instructions:String = "Click it";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var button1:FlxButtonPlus;
		private var debug:TextField;
		
		public function KongregateAPITest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			header.showDarkBackground();
			
			debug = new TextField();
			debug.defaultTextFormat = new TextFormat("Courier", 10);
			debug.selectable = false;
			debug.textColor = 0xffffff;
			debug.width = 320;
			debug.height = 200;
			debug.x = 32;
			debug.y = 64;
			debug.text = "Kongregate API Test\n\n";
			
			
			button1 = new FlxButtonPlus(230, 32, initAPI, null, "Load API", 80);
			
			add(button1);
			
			FlxG.stage.addChild(debug);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
		private function initAPI():void
		{
			debug.text = debug.text.concat("Loading ... ");
			
			FlxKongregate.init(apiHasLoaded);
		}
		
		private function apiHasLoaded():void
		{
			debug.text = debug.text.concat("Kongregate API Loaded.\nClick Connect.\n");
			
			button1.text = "Connect";
			button1.setOnClickCallback(connect);
		}
		
		private function connect():void
		{
			FlxKongregate.connect();
			
			debug.text = debug.text.concat("Shadow Mode: " + FlxKongregate.isLocal + "\n");
			debug.text = debug.text.concat("Is Guest: " + FlxKongregate.isGuest + "\n");
			debug.text = debug.text.concat("User ID: " + FlxKongregate.getUserId + "\n");
			debug.text = debug.text.concat("Username: " + FlxKongregate.getUserName + "\n\n");
			debug.text = debug.text.concat("You can now call all the API functions!");
		}
		
		override public function destroy():void
		{
			FlxG.stage.removeChild(debug);
			
			FlxKongregate.disconnect();
			
			super.destroy();
		}
		
		
	}

}