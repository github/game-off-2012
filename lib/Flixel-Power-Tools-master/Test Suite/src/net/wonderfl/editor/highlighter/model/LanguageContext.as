package net.wonderfl.editor.highlighter.model
{
	
	/**
	 * ...
	 * @author 9re
	 */
	public class LanguageContext 
	{
		protected var _contextColorSettingList:Vector.<ContextColorSetting>;
		protected var _keywordsColorSettingList:Vector.<KeywordsColorSetting>;
		
		public function LanguageContext() {
			_contextColorSettingList = new Vector.<ContextColorSetting>();
			_keywordsColorSettingList = new Vector.<KeywordsColorSetting>();
		}
		
		public function get contextColorSettingList():Vector.<ContextColorSetting> { return _contextColorSettingList; }
		public function get keywordsColorSettingList():Vector.<KeywordsColorSetting> { return _keywordsColorSettingList; }
	}
}