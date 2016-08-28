package net.wonderfl.editor.highlighter
{
	/*
	 * Updated 4th August 2011 by Richard Davey / Photon Storm
	 * to use htmlText in native textFields instead of Flex MXML TextArea components.
	 *
	 * @author 9re
	 * http://wonderfl.net/user/9re
	 *
	 * based on
	 * jp.psyark.psycode.coloring.TextAreaSyntaxHighlighter by psyark and
	 *
	 * Code Syntax Highlighter 1.3.0.
	 * The Initial Developer of the Original Code is Alex Gorbatchev.
	 * Portions created by the Initial Developer are Copyright (C) 2004
	 * the Initial Developer. All Rights Reserved.
	 * http://www.dreamprojections.com/syntaxhighlighter/
	 *
	 * Code Optimization trick in Code Syntax Highlighter 1.3.1. by WitchGarden
	 */
	
	import flash.events.TimerEvent;
	import flash.text.TextField;
	import flash.utils.getTimer;
	import flash.utils.Timer;
	import org.flixel.plugin.photonstorm.FlxColor;
	import net.wonderfl.editor.highlighter.model.*;
	
	public class SyntaxHighlighter
	{
		public var output:String;
		public var lock:Boolean = false;
		private var text:String;
		private var contextColorSettingList:Vector.<ContextColorSetting>;
		private var keywordsColorSettingList:Vector.<KeywordsColorSetting>;
		private var defaultColor:uint;
		private var processed:Array;
		
		public function SyntaxHighlighter(input:String)
		{
			output = input;
			
			var as3ColorSetting:AS3ColorSetting = new AS3ColorSetting();
			var as3Context:AS3Context = new AS3Context();
			as3Context.as3ColorSetting = as3ColorSetting;
			as3Context.buildContextColorSettingList();
			
			contextColorSettingList = as3Context.contextColorSettingList;
			keywordsColorSettingList = as3Context.keywordsColorSettingList;
			defaultColor = as3ColorSetting.defaultColor;
			
			parseSyntax(input);
		}
		
		private function wordColor(word:String, color:int):void
		{
			if (processed[word])
			{
				trace(word, "already done");
				return;
			}
			
			trace("Colouring:", word);
			
			var r:RegExp = new RegExp("(" + word + ")", "g");
			
			output = output.replace(r, '<font color="' + FlxColor.RGBtoWebString(color) + '">$1</font>');
			
			processed[word] = true;
		}
		
		public function parseSyntax(input:String):void
		{
			//var _time:int = getTimer();
			
			if (keywordsColorSettingList == null)
			{
				trace("keywordsColorSettingList = null");
				return;
			}
			
			// find words and check if it is a keyword
			var match:Object;
			var regExp:RegExp = /(\w+)\W+/g;
			//var text:String = _target.text.substring($start, $end);
			var text:String = input;
			var keywordsColorSetting:KeywordsColorSetting;
			var i:int, j:int;
			var word:String;
			var len:int = keywordsColorSettingList.length;
			//matchPatterns.length = 0;
			var found:Boolean;
			processed = new Array;
			
			while ((match = regExp.exec(text)) != null)
			{
				word = String(match[1]);
				
				if (word)
				{
					if (word.search(AS3Context.classNameRegExp) == 0)
					{
						//trace("classNameRegExp", word);
						wordColor(word, 0x3299f9);
						//words[word] = 0x3299f9;
						//matchPatterns.push(new MatchPattern($start + match.index, word.length, 0x3299f9));
					}
					else if (word.search(AS3Context.keywordsRegExp) == 0)
					{
						//trace("keywordsRegExp", word);
						wordColor(word, 0xcf734b);
						//words[word] = 0xcf734b;
						//matchPatterns.push(new MatchPattern($start + match.index, word.length, 0xcf734b));
					}
				}
			}
			
			// set contextual color settings, such as comments and string literals
			
			if (contextColorSettingList == null)
			{
				trace("contextColorSettingList = null");
				return;
			}
			
			len = contextColorSettingList.length;
			var colorSetting:ContextColorSetting;
			
			for (i = 0; i < len; ++i)
			{
				colorSetting = contextColorSettingList[i];
				
				while ((match = colorSetting.regExp.exec(text)) != null)
				{
					//trace(colorSetting.color, String(match[0]));
					//words[String(match[0])] = colorSetting.color;
					wordColor(String(match[0]), colorSetting.color);
					//matchPatterns.push(new MatchPattern($start + match.index, String(match[0]).length, colorSetting.color));
				}
			}
			
			//if (matchPatterns.length == 0)
			//{
				//return;
			//}
			
			//setTextColor($start, $end, defaultColor);
			
			//matchPatterns = matchPatterns.sort(sortCallback);
			//len = matchPatterns.length;
			//
			//for (i = 0; i < len; ++i)
				//if (isInside(matchPatterns[i], i))
					//matchPatterns[i] = null;
		}
		
		
		/*
		
		public function startColoring():void
		{
			timer.start();
		}
		
		public function stopColoring():void
		{
			timer.stop();
		}
		
		private function textColoringCallback(e:TimerEvent):void
		{
			if (!coloringInterval || lock)
				return;
			
			var i:Interval = calcUnRenderedAreaFromInterval(coloringInterval);
			
			if (i != null)
			{
				colorText(coloringInterval.begin, coloringInterval.end);
				renderedArea.push(coloringInterval);
			}
			else
			{
				stopColoring();
			}
		}
		
		private function calcUnRenderedAreaFromInterval(i:Interval):Interval
		{
			if (coloringInterval == null)
				return null;
			
			renderedArea = simplifyIntervals(renderedArea);
			renderedArea.forEach(function(i:Interval, index:int, vector:Vector.<Interval>):void
				{
					if (i == null)
						return;
					
					if ((i.end >= coloringInterval.begin) && (i.end <= coloringInterval.end))
					{
						coloringInterval.begin = i.end + 1;
					}
					if ((i.begin > coloringInterval.begin) && (i.begin <= coloringInterval.end))
					{
						coloringInterval.end = i.begin - 1;
					}
				});
			
			return (coloringInterval.begin >= coloringInterval.end) ? null : coloringInterval;
		}
		
		private function simplifyIntervals(intervals:Vector.<Interval>):Vector.<Interval>
		{
			if (intervals.length == 0)
				return intervals;
			
			intervals = intervals.sort(intervalSort);
			
			var result:Vector.<Interval> = new Vector.<Interval>();
			var i:Interval;
			var len:int = intervals.length;
			var j:Interval = intervals[0];
			for (var ii:int = 0; ii < len; ++ii)
			{
				i = intervals[ii];
				if (i == null)
					break;
				
				if (j.end + 1 < i.begin)
				{
					result.push(j);
					j = i;
				}
				else
				{
					j.end = Math.max(j.end, i.end);
				}
			}
			result.push(j);
			
			return result;
		}
		
		private function intervalSort(a:Interval, b:Interval):int
		{
			if (a == null && b == null)
				return 0;
			
			if (a == null)
				return 1;
			if (b == null)
				return -1;
			
			if (a.begin < b.begin)
				return -1;
			if (a.begin > b.begin)
				return 1;
			
			if (a.end < b.end)
				return -1;
			if (b.end > b.end)
				return 1;
			
			return 0;
		}
		
		public function setColoringInterval(begin:int, end:int):void
		{
			coloringInterval = new Interval(begin, end);
		}
		
		public function clearRenderedArea():void
		{
			renderedArea.length = 0;
		}
		
		public function setTextColor(start:int, end:int, color:uint):void
		{
			
			
			//try
			//{
				//_range.beginIndex = $start;
				//_range.endIndex = $end;
				//_range.color = $color;
			//}
			//catch (e:Error)
			//{
				//
			//}
		}
		
		public function parseSyntax($start:int, $end:int):void
		{
			var _time:int = getTimer();
			
			if (keywordsColorSettingList == null)
				return;
			
			// find words and check if it is a keyword
			var match:Object;
			var regExp:RegExp = /(\w+)\W+/g;
			var text:String = _target.text.substring($start, $end);
			var keywordsColorSetting:KeywordsColorSetting;
			var i:int, j:int;
			var word:String;
			var len:int = keywordsColorSettingList.length;
			matchPatterns.length = 0;
			var found:Boolean;
			
			while ((match = regExp.exec(text)) != null)
			{
				word = String(match[1]);
				
				if (word)
				{
					if (word.search(AS3Context.classNameRegExp) == 0)
					{
						matchPatterns.push(new MatchPattern($start + match.index, word.length, 0x3299f9));
					}
					else if (word.search(AS3Context.keywordsRegExp) == 0)
					{
						matchPatterns.push(new MatchPattern($start + match.index, word.length, 0xcf734b));
					}
				}
			}
			
			// set contextual color settings, such as comments and string literals
			if (contextColorSettingList == null)
				return;
			
			// process regexpList
			len = contextColorSettingList.length;
			var colorSetting:ContextColorSetting;
			//_matchPatterns.length = 0;
			
			for (i = 0; i < len; ++i)
			{
				colorSetting = contextColorSettingList[i];
				
				while ((match = colorSetting.regExp.exec(text)) != null)
				{
					matchPatterns.push(new MatchPattern($start + match.index, String(match[0]).length, colorSetting.color));
				}
			}
			
			if (matchPatterns.length == 0) // no match
				return;
			
			// set to defaul color
			setTextColor($start, $end, defaultColor);
			
			matchPatterns = matchPatterns.sort(sortCallback);
			len = matchPatterns.length;
			
			for (i = 0; i < len; ++i)
				if (isInside(matchPatterns[i], i))
					matchPatterns[i] = null;
		}
		
		public function colorText($start:int, $end:int):void
		{
			var i:int;
			var len:int = matchPatterns.length;
			var pattern:MatchPattern;
			for (i = 0; i < len; ++i)
			{
				pattern = matchPatterns[i];
				if (pattern == null || pattern.length == 0)
					continue;
				
				if (pattern.index > $end)
					break;
				
				if (pattern.index + pattern.length >= $start)
					setTextColor(pattern.index, pattern.index + pattern.length, pattern.color);
			}
		}
		
		
		/////////////////////////////////////////////////////////////////////// P R I V A T E   M E T H O D S
		private function sortCallback(m0:MatchPattern, m1:MatchPattern):int
		{
			// sort matches by index first
			if (m0.index < m1.index)
				return -1;
			else if (m0.index > m1.index)
				return 1;
			else
			{
				// if indeces are same, sort on length
				if (m0.length > m1.length)
					return -1;
				else if (m0.length < m1.length)
					return 1;
			}
			return 0;
		}
		
		private function isInside(match:MatchPattern, endindex:int):Boolean
		{
			if (match == null || match.length == 0)
				return false;
			
			for (var i:int = 0; i < endindex; i++)
			{
				var c:MatchPattern = matchPatterns[i];
				if (c == null)
					continue;
				
				if (match.index < c.index + c.length)
					return true;
			}
			return false;
		}
		*/
	}
}