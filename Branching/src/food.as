package  
{
	import starling.display.Quad;
	
	public class food extends interactiveObject 
	{
		private var foodImage:Quad;
		
		public function food() 
		{
			foodImage = new Quad(30, 30, 0xff2233)
			foodImage.x = -foodImage.width / 2;
			foodImage.y = -foodImage.height / 2;
			addChild(foodImage);
		}
		
	}

}