package  
{
	import starling.core.Starling;
	import starling.display.MovieClip;
	import starling.textures.Texture;
	import starling.textures.TextureAtlas;
	
	public class food extends interactiveObject 
	{
		//Texture Atlas
		private var foodTextures:Texture = Texture.fromBitmap(new Resources.foodAtlasTexture());
		private var foodXml:XML = XML(new Resources.foodAtlasXml());
		private var foodAtlas:TextureAtlas= new TextureAtlas(foodTextures, foodXml);
		
		private var foodMovie:MovieClip;
		
		public function food(X2D:Number, Y2D:Number) 
		{
			RealX = X2D;
			RealY = Y2D;
			
			foodMovie = new MovieClip(foodAtlas.getTextures("food_"), 10);
			foodMovie.x = -foodMovie.width / 2;
			foodMovie.y = -foodMovie.height / 2;
			addChild(foodMovie);
			
			Starling.juggler.add(foodMovie);
		}
		
	}

}