package net.wonderfl.editor.highlighter.model
{
	
	/**
	 * ...
	 * @author 9re
	 */
	public class MatchPattern 
	{
		public var index:int;
		public var length:int;
		public var color:uint;
		
		public function MatchPattern($index:int, $length:int, $color:uint) 
		{
			index = $index;
			length = $length;
			color = $color;
		}		
	}
	
}