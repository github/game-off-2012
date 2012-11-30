package  
{
	import starling.display.Quad;
	
	public class obstacle extends interactiveObject 
	{
		private var obstacleImage:Quad;
		
		public function obstacle() 
		{
			obstacleImage = new Quad(200, 50, 0x786B54);
			obstacleImage.x = -obstacleImage.width / 2;
			obstacleImage.y = -obstacleImage.height / 2;
			addChild(obstacleImage);
		}
		
	}

}