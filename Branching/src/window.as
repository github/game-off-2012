package  
{
	import starling.display.Quad;

	public class window extends interactiveObject 
	{
		private var windowImage:Quad;
		
		public function window() 
		{
			windowImage = new Quad(200, 200, 0xbbfeff);
			windowImage.x = -windowImage.width / 2;
			windowImage.y = -windowImage.height / 2;
			addChild(windowImage);
		}
		
	}

}