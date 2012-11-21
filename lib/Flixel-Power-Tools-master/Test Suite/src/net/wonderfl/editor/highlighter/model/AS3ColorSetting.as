package net.wonderfl.editor.highlighter.model
{
	
	/**
	 * ...
	 * @author 9re
	 * http://wonderfl.net/user/9re
	 */
	public class AS3ColorSetting 
	{
		public var defaultColor:uint = 0xffffff;
		public var as3Keywords:uint = 0xcf734b;
		public var className:uint = 0x3299f9;
		public var comment:uint = 0x53b055;
		public var string:uint = 0x4a48ff;
		public var number:uint = 0x0000ff;
		
		public function AS3ColorSetting($xml:XML = null) 
		{
			for (var nodeName:String in $xml) {
				try {
					this[nodeName] = uint($xml[nodeName]);
				} catch (e:Error) {
					//
				}
			}
		}
		
	}
	
}