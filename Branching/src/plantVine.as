package  
{
	import starling.display.Quad;
	
	public class plantVine extends interactiveObject
	{
		private var vineImage:Quad;
		
		public function plantVine(X2D:Number,Y2D:Number)
		{
			touchable = false;
			RealX = X2D;
			RealY = Y2D;
			vineImage = new Quad(30, 10, 0x47D163);
			vineImage.x = -(vineImage.width / 2);
			vineImage.y = -vineImage.height;
			addChild(vineImage);
		}
		
	}

}