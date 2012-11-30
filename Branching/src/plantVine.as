package  
{
	import flash.geom.Point;
	import starling.display.Quad;
	
	public class plantVine extends interactiveObject
	{
		private var vineImage:Quad;
		
		private var v3d:Point;
		
		public var master:plantBud;
		public var isDead:Boolean;
		public var deadPoint:Point;
		
		public function plantVine(X2D:Number,Y2D:Number, owner:plantBud)
		{
			touchable = false;
			master = owner;
			RealX = X2D;
			RealY = Y2D;
			isDead = false;
			deadPoint = new Point();
			vineImage = new Quad(10, 10, 0x47D163);
			vineImage.y = -(vineImage.height / 2);
			addChild(vineImage);
		}
		
		public function KillInPlane(NewX:Number,NewY:Number):void
		{
			isDead = true;
			deadPoint.x = NewX;
			deadPoint.y = NewY;
		}
		
	}

}