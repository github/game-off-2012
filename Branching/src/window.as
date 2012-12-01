package  
{
	import starling.display.Quad;

	public class window extends interactiveObject 
	{
		private var windowImage:Quad;
		
		public function window(X2D:Number, Y2D:Number) 
		{
			RealX = X2D;
			RealY = Y2D;
			RealWidth = 40;
			RealHeight = 60;
			
			windowImage = new Quad(RealWidth, RealHeight, 0x111111);
			windowImage.x = -windowImage.width / 2;
			windowImage.y = -windowImage.height / 2;
			addChild(windowImage);
		}
		
	}

}