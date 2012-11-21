package tests.wip 
{
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class Action extends FlxState
	{
		//	Common variables
		public static var title:String = "Button Label";
		public static var description:String = "Description";
		private var instructions:String = "Instruction Text";
		private var header:TestsHeader;
		
		//	Test specific variables
		
		
		public function Action() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			
			//	Header overlay
			add(header.overlay);
		}
		
		override public function update():void
		{
			super.update();
		}
		
		override public function destroy():void
		{
			super.destroy();
		}
		
	}

}