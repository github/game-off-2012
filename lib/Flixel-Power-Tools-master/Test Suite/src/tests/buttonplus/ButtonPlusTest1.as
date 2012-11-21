package tests.buttonplus 
{
	import flash.display.BitmapData;
	import flash.geom.Rectangle;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class ButtonPlusTest1 extends FlxState
	{
		//	Common variables
		public static var title:String = "Buttons 1";
		public static var description:String = "Create an advanced FlxButton";
		private var instructions:String = "Demonstrates FlxColor.getRandomColor";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var button1:FlxButtonPlus;
		private var button2:FlxButtonPlus;
		private var button3:FlxButtonPlus;
		
		public function ButtonPlusTest1() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			//	This is a default button with no extra styling or changes. It will send 2 parameters, a String and a Number to the onClick function, when clicked.
			button1 = new FlxButtonPlus(32, 64, onClick, [ "ABC", 12.3 ], "Default Style Button", 140);
			button1.screenCenter();
			
			//	Here we'll style this default button with a 140px width and different shades of gradient for both the normal and rolled-over states
			button2 = new FlxButtonPlus(32, 90, onClick, [ "Atari ST", 1040 ], "Custom Colours", 140);
			button2.updateInactiveButtonColors([ 0xffFF0080, 0xffFF80C0 ]);
			button2.updateActiveButtonColors([ 0xffFFFF00, 0xffFF8000 ]);
			button2.screenCenter();
			
			//	This is a default button with no extra styling or changes. It will send 2 parameters, a String and a Number to the onClick function, when clicked.
			button3 = new FlxButtonPlus(32, 116, onClick, [ "Commodore", 64 ], "Roll Over and Out", 140);
			button3.updateInactiveButtonColors([ 0xffFF0000, 0xffFF8000, 0xffFFFF00 ]);
			button3.setMouseOverCallback(mouseOver);
			button3.setMouseOutCallback(mouseOut);
			button3.screenCenter();
			
			add(button1);
			add(button2);
			add(button3);
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
		private function onClick(text:String, value:Number):void
		{
			header.instructions.text = "You clicked and sent me: " + text + " " + value.toString();
		}
		
		private function mouseOver():void
		{
			header.instructions.text = "You rolled over Button 3";
		}
		
		private function mouseOut():void
		{
			header.instructions.text = "You left Button 3";
		}
		
	}

}