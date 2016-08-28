package net.wonderfl.editor.highlighter.model
{
	public class ContextColorSetting 
	{
		public var regExp:RegExp;
		public var color:uint;
		
		public function ContextColorSetting($regExp:RegExp, $color:uint) 
		{
			regExp = $regExp;
			color = $color;
		}
		
	}
	
}