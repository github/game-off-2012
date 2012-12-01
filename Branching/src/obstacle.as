package  
{
	import starling.display.Quad;
	
	public class obstacle extends interactiveObject 
	{
		private var obstacleImage:Quad;
		
		public function obstacle(X2D:Number, Y2D:Number) 
		{
			RealX = X2D;
			RealY = Y2D;
			RealWidth = 102;
			RealHeight = 20;
			
			obstacleImage = new Quad(RealWidth, 20, 0xA36D3E);
			obstacleImage.y = -obstacleImage.height / 2;
			addChild(obstacleImage);
		}
		
	}

}