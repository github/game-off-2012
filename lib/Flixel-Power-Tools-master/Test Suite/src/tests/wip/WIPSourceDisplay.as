package tests.wip 
{
	import com.bit101.components.TextArea;
	import com.greensock.events.LoaderEvent;
	import com.greensock.loading.DataLoader;
	import com.greensock.loading.LoaderMax;
	import flash.text.TextField;
	import flash.text.TextFormat;
	//import net.wonderfl.editor.highlighter.SyntaxHighlighter;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.*;
	import tests.TestsHeader;

	public class WIPSourceDisplay extends FlxState
	{
		//	Common variables
		public static var title:String = "Button Label";
		public static var description:String = "Description";
		private var instructions:String = "Instruction Text";
		private var header:TestsHeader;
		
		//	Test specific variables
		private var source:TextArea;
		//private var source:TextField;
		
		public function WIPSourceDisplay() 
		{
		}
		
		override public function create():void
		{
			header = new TestsHeader(instructions);
			add(header);
			
			//	Test specific
			
			source = new TextArea(null, 16, 64);
			//source = new TextField();
			//source.opaqueBackground = 0x0;
			source.width = 600;
			source.height = 400;
			source.textField.selectable = false;
			
			var l:LoaderMax = new LoaderMax();
			//l.append(new DataLoader("../src/CreditsState.as", { name: "code", onComplete: complete, onError: errorHandler } ));
			l.append(new DataLoader("https://raw.github.com/photonstorm/Flixel-Power-Tools/master/Test%20Suite/src/CreditsState.as", { name: "code", onComplete: complete, onError: errorHandler } ));
			l.load();
			
			FlxCoreUtils.gameContainer.addChildAt(source, FlxCoreUtils.mouseIndex);
			
			//	Header overlay
			add(header.overlay);
		}
		
		private function errorHandler(event:LoaderEvent):void
		{
			//source.text = "error " + event.text;
		}
		
		private function complete(event:LoaderEvent):void
		{
			var temp:String = LoaderMax.getContent("code");
			
			var r:RegExp = /(\r)/g;
			temp = temp.replace(r, '');
			
			var r2:RegExp = /</g;
			temp = temp.replace(r2, '&lt;');
			
			var r3:RegExp = />/g;
			temp = temp.replace(r3, '&gt;');
			
			source.textField.htmlText = temp;
		}
		
		override public function update():void
		{
			super.update();
		}
		
		override public function destroy():void
		{
			FlxCoreUtils.gameContainer.removeChild(source);
			
			super.destroy();
		}
		
	}

}