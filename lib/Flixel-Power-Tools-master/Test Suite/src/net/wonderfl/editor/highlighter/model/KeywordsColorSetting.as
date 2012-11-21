package net.wonderfl.editor.highlighter.model
{
	
	/**
	 * ...
	 * @author 9re
	 */
	public class KeywordsColorSetting 
	{
		public var keywords:Vector.<String>;
		public var color:uint;
		
		public function KeywordsColorSetting($keywords:Vector.<String>, $color:uint) 
		{
			keywords = $keywords;
			color = $color;
		}
		
	}
	
}