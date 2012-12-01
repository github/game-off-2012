package  
{
	import starling.textures.Texture;
	import starling.textures.TextureAtlas;

	public class Resources 
	{
		[Embed(source="../lib/MainSong.mp3")]
		public static const bgmusic:Class;
		
		[Embed(source="../lib/eating.mp3")]
		public static const eatSfx:Class;
		[Embed(source="../lib/dividing.mp3")]
		public static const divideSfx:Class;
		[Embed(source="../lib/hit.mp3")]
		public static const hitSfx:Class;
		[Embed(source="../lib/dead.mp3")]
		public static const deadSfx:Class;
		
		[Embed(source="../lib/TittleScreen.png")]
		public static const titleTexture:Class;
		
		[Embed(source = "../lib/layer0.png")]
		public static const layer0Texture:Class;
		[Embed(source="../lib/layer1.png")]
		public static const layer1Texture:Class;
		
		[Embed(source="../lib/VenusSheet.xml", mimeType="application/octet-stream")]
		public static const BudAtlasXml:Class; 
		[Embed(source="../lib/VenusSheet.png")]
		public static const BudAtlasTexture:Class;
		
		[Embed(source="../lib/vine.jpg")]
		public static const vineTexture:Class;
		
		[Embed(source="../lib/foodSheet.xml", mimeType="application/octet-stream")]
		public static const foodAtlasXml:Class;
		[Embed(source="../lib/foodSheet.png")]
		public static const foodAtlasTexture:Class;
		
		public function Resources() 
		{
			
		}
		
	}

}