package  
{
	import starling.core.Starling;
	import starling.display.Image;
	import starling.display.MovieClip;
	import starling.textures.Texture;
	import starling.textures.TextureAtlas;
	
	public class plantBud extends interactiveObject
	{		
		//Texture Atlas
		private var BudTextures:Texture = Texture.fromBitmap(new Resources.BudAtlasTexture());
		private var BudsXml:XML = XML(new Resources.BudAtlasXml());
		private var BudAtlas:TextureAtlas = new TextureAtlas(BudTextures, BudsXml);
		
		private var movieHolder:MovieClip;
		private var ImageHolder:Image;
		private var budMovie5:MovieClip = new MovieClip(BudAtlas.getTextures("venus5_"),15);
		private var budMovie4:MovieClip = new MovieClip(BudAtlas.getTextures("venus4_"),15);
		private var budMovie3:MovieClip = new MovieClip(BudAtlas.getTextures("venus3_"),15);
		private var budMovie2:MovieClip = new MovieClip(BudAtlas.getTextures("venus2_"),15);
		private var budMovie1:MovieClip = new MovieClip(BudAtlas.getTextures("venus1_"),15);
		private var budImage0:Image = new Image(BudAtlas.getTexture("venus0"));
		private var budImageBranching:Image = new Image(BudAtlas.getTexture("venusBranching"));
		private var budImageJoint:Image = new Image(BudAtlas.getTexture("venusJoint"));
		
		public var myVine:plantVine;
		public var whoHurtMe:obstacle;
		public var worldPlane:int;
		public var dead:Boolean;
		
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
			dead = false;
			
			switch(budGrowth)
			{
				case 1:
					movieHolder = budMovie1;
					break;
				case 2:
					movieHolder = budMovie2;
					break;
				case 3:
					movieHolder = budMovie3;
					break;
				case 4:
					movieHolder = budMovie4;
					break;
				case 5:
					movieHolder = budMovie5;
					break;
				default:
					break;
			}
			movieHolder.x = -(movieHolder.width / 2);
			movieHolder.y = -(movieHolder.height / 2);
			addChild(movieHolder);
			Starling.juggler.add(movieHolder);
			
			if (budGrowth == 1)
				touchable = false;
		}
		
		public function Grow():void
		{
			if (!dead)
			{
				if (budGrowth < 5)
					budGrowth++;
				touchable = true;
				Starling.juggler.remove(movieHolder);
				removeChild(movieHolder);
				switch(budGrowth)
				{
					case 2:
						movieHolder = budMovie2;
						break;
					case 3:
						movieHolder = budMovie3;
						break;
					case 4:
						movieHolder = budMovie4;
						break;
					case 5:
						movieHolder = budMovie5;
						break;
					default:
						break;
				}
				movieHolder.x = -(movieHolder.width / 2);
				movieHolder.y = -(movieHolder.height / 2);
				addChild(movieHolder);
				Starling.juggler.add(movieHolder);
			}
		}
		
		public function Hurt():void
		{
			budGrowth--;
			if (budGrowth < 2)
				touchable = false;
			Starling.juggler.remove(movieHolder);
			removeChild(movieHolder);
			switch(budGrowth)
			{
				case 0:
					ImageHolder = budImage0;
					ImageHolder.x = -(ImageHolder.width / 2);
					ImageHolder.y = -(ImageHolder.height / 2);
					addChild(ImageHolder);
					XSpeed = 0;
					YSpeed = 0;
					budMaxSpeed = 0;
					dead = true;
					break;
				case 1:
					movieHolder = budMovie1;
					break;
				case 2:
					movieHolder = budMovie2;
					break;
				case 3:
					movieHolder = budMovie3;
					break;
				case 4:
					movieHolder = budMovie4;
					break;
				case 5:
					movieHolder = budMovie5;
					break;
				default:
					break;
			}
			if (budGrowth != 0)
			{
				movieHolder.x = -(movieHolder.width / 2);
				movieHolder.y = -(movieHolder.height / 2);
				addChild(movieHolder);
				Starling.juggler.add(movieHolder);
			}
		}
		
		public function Kill():void
		{
			budGrowth = 0;
			Starling.juggler.remove(movieHolder);
			removeChild(movieHolder);
			XSpeed = 0;
			YSpeed = 0;
			budMaxSpeed = 0;
			dead = true;
		}
		
		public function startBranching():void
		{
			XSpeed = 0;
			YSpeed = 0;
			Starling.juggler.remove(movieHolder);
			removeChild(movieHolder);
			ImageHolder = budImageBranching;
			ImageHolder.x = -(ImageHolder.width / 2);
			ImageHolder.y = -(ImageHolder.height / 2);
			addChild(ImageHolder);
		}
		
		public function makeJoint():void
		{
			XSpeed = 0;
			YSpeed = 0;
			budMaxSpeed = 0;
			removeChild(ImageHolder);
			ImageHolder = budImageJoint;
			ImageHolder.x = -(ImageHolder.width / 2);
			ImageHolder.y = -(ImageHolder.height / 2);
			addChild(ImageHolder);
			touchable = false;
			dead = true;
		}
		
		public function cancelBranching():void
		{
			if (!dead)
			{
				XSpeed = budMaxSpeed * Math.cos(-rotation);
				YSpeed = budMaxSpeed * Math.sin( -rotation);
				removeChild(ImageHolder);
				Starling.juggler.remove(movieHolder);
				removeChild(movieHolder);
				switch(budGrowth)
				{
					case 2:
						movieHolder = budMovie2;
						break;
					case 3:
						movieHolder = budMovie3;
						break;
					case 4:
						movieHolder = budMovie4;
						break;
					case 5:
						movieHolder = budMovie5;
						break;
					default:
						break;
				}
				movieHolder.x = -(movieHolder.width / 2);
				movieHolder.y = -(movieHolder.height / 2);
				addChild(movieHolder);
				Starling.juggler.add(movieHolder);
			}
		}		
	}
}