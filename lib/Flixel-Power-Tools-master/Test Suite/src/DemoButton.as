package  
{
	import org.flixel.*;

	public class DemoButton extends FlxButton
	{
		private var demo:Class;
		
		public function DemoButton(x:int, y:int, demo:Class) 
		{
			super(x, y, demo.title, mouseClick);
			
			this.demo = demo;
			this.onOver = mouseOver;
			this.onOut = mouseOut;
		}
		
		private function mouseOver():void
		{
			Registry.info = demo.description;
		}
		
		private function mouseOut():void
		{
			Registry.info = "";
		}
		
		private function mouseClick():void
		{
			FlxG.switchState(new demo);
		}
		
	}

}