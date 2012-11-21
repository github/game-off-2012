package net.wonderfl.editor.highlighter.model
{
	/**
	 * ...
	 * @author 9re
	 */
	public class Interval
	{
		public var begin:int;
		public var end:int;
		
		public function Interval($begin:int, $end:int) {
			begin = $begin;
			end = $end;
		}
		
		public function toString():String 
		{
			return "(begin: " + begin + " end: " + end + ")";
		}
	}
}