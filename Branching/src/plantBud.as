package  
{
	import starling.display.Quad;
	
	public class plantBud extends interactiveObject
	{
		private var budImage:Quad;
		
		public var worldPlane:int;
		
		public var budGrowth:int;
		public var XSpeed:Number;
		public var YSpeed:Number;
		private var budMaxSpeed:Number;
		
		public function plantBud(X2D:Number, Y2D:Number, wallPlane:int, budLevel:int = 3, budRotation:Number = (Math.PI/2)) 
		{
			worldPlane = wallPlane;
			budGrowth = budLevel;
			rotation = -budRotation;
			RealX = X2D;
			RealY = Y2D;
			budMaxSpeed = 1.5;
			XSpeed = budMaxSpeed * Math.cos(budRotation);
			YSpeed = budMaxSpeed * Math.sin(budRotation);
			
			budImage = new Quad(50, 50);
			switch(budGrowth)
			{
				case 1:
					budImage.color = 0xAEE359;
					break;
				case 2:
					budImage.color = 0x84E359;
					break;
				case 3:
					budImage.color = 0x69E359;
					break;
				case 4:
					budImage.color = 0x48CF5C;
					break;
				case 5:
					budImage.color = 0x00B521;
					break;
				default:
					break;
			}
			budImage.x = -(budImage.width / 2);
			budImage.y = -(budImage.height / 2);
			addChild(budImage);
			
			if (budGrowth == 1)
				touchable = false;
		}
		
		public function startBranching():void
		{
			XSpeed = 0;
			YSpeed = 0;
			budImage.color = 0x95CCA0;
		}
		
		public function makeJoint():void
		{
			budImage.color = 0x98F59E;
			touchable = false;
		}
		
		public function cancelBranching():void
		{
			XSpeed = budMaxSpeed * Math.cos(-rotation);
			YSpeed = budMaxSpeed * Math.sin(-rotation);
			switch(budGrowth)
			{
				case 1:
					budImage.color = 0xAEE359;
					break;
				case 2:
					budImage.color = 0x84E359;
					break;
				case 3:
					budImage.color = 0x69E359;
					break;
				case 4:
					budImage.color = 0x48CF5C;
					break;
				case 5:
					budImage.color = 0x00B521;
					break;
				default:
					break;
			}
		}		
	}
}