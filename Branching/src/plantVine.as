package  
{
	import flash.geom.Point;
	import starling.display.Image;
	import starling.display.Quad;
	import starling.textures.Texture;
	
	public class plantVine extends interactiveObject
	{
		private var vineTexture:Texture;
		private var vineImage:Image;
		
		public var master:plantBud;
		public var isDead:Boolean;
		public var deadPoint:Point;
		public var CleanMePlease:Boolean;
		
		public function plantVine(X2D:Number,Y2D:Number, owner:plantBud)
		{
			touchable = false;
			master = owner;
			RealX = X2D;
			RealY = Y2D;
			isDead = false;
			CleanMePlease = false;
			deadPoint = new Point();
			vineTexture = Texture.fromBitmap(new Resources.vineTexture());
			vineTexture.repeat = true;
			vineImage = new Image(vineTexture);
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