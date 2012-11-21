package net.wonderfl.editor.highlighter.model
{
    
    /**
     * ...
	 * @author 9re
	 * http://wonderfl.net/user/9re
     */
	import net.wonderfl.editor.highlighter.model.LanguageContext;
	
    public class AS3Context extends LanguageContext
    {
        public static const definitions:String = 'class interface package';
        
        public static const keywords:String
		
                   =    'Array Boolean Function Vector Date decodeURI decodeURIComponent encodeURI encodeURIComponent escape ' +
                        'int isFinite isNaN isXMLName Number Object parseFloat parseInt ' +
                        'String trace uint unescape XML XMLList ' + //global functions
                        
                        'Infinity NaN undefined ' + //global constants
                        
                        'as delete instanceof is new typeof ' + //operators
                        
                        'break case catch continue default do each else finally for if in ' +
                        'label return super switch throw try while with ' + //statements
                        
                        'dynamic final internal native override private protected public static ' + //attributes
                        
                        '...rest const extends function get implements namespace set ' + //definitions
                        
                        'import include use ' + //directives
                        
                        'AS3 flash_proxy object_proxy ' + //namespaces
                        
                        'false null this true ' + //expressions
                        
                        'void Null ' + //types
						
						'var class'; // declarations
						
		
		public static const multiLineComments:RegExp = new RegExp('/\\*[\\s\\S]*?\\*/', 'gm');
		public static const singleLineComments:RegExp =  new RegExp('//.*$', 'gm');
		//?
		public static const doubleQuotedString:RegExp =  new RegExp('"(?:\\"|[^"\\n])*?"', 'g');
		public static const singleQuotedString:RegExp =  new RegExp("'(?:\\'|[^'\\n])*?'", 'g');
		
		public static const keywordsRegExp:RegExp = new RegExp("(?:i(?:n(?:stanceof|ternal|clude)?|s(?:(?:XMLNam|Finit)e|NaN)?|mp(?:lements|ort)|f)|p(?:a(?:rse(?:Floa|In)t|ckage)|r(?:otected|ivate)|ublic)|d(?:e(?:codeURI(?:Component)?|fault|lete)|ynamic|o)|e(?:ncodeURI(?:Component)?|(?:scap|ls)e|xtends|ach)|f(?:inal(?:ly)?|lash_proxy|unction|alse|or)|t(?:r(?:(?:ac|u)e|y)|h(?:row|is)|ypeof)|c(?:on(?:tinue|st)|a(?:tch|se))|n(?:a(?:mespac|tiv)e|ull|ew)|u(?:n(?:defined|escape)|se)|o(?:bject_proxy|verride)|s(?:tatic|witch|uper|et)|(?:\.\.\.res|ge)t|w(?:hile|ith)|N(?:ull|aN)|v(?:oid|ar)|Infinity|return|break|label|AS3|as)", "g");
		public static const classNameRegExp:RegExp = new RegExp("(?:S(?:ha(?:der(?:P(?:arameter(?:Type)?|recision)|(?:Even|Inpu)t|Filter|Data|Job)?|redObject(?:FlushStatus)?|pe)|t(?:a(?:ge(?:(?:DisplayStat|ScaleMod)e|Quality|Align)?|t(?:usEven|icTex)t|ckOverflowError)|yleSheet|ring)|o(?:und(?:C(?:hannel|odec)|LoaderContext|Transform|Mixer)?|cket)|ecurity(?:Error(?:Event)?|Domain|Panel)?|p(?:r(?:eadMethod|ite)|aceJustifier)|y(?:n(?:taxError|cEvent)|stem)|c(?:riptTimeoutError|ene)|(?:impleButt|WFVersi)on|ampleDataEvent)|T(?:ext(?:Line(?:M(?:irrorRegion|etrics)|CreationResult|Validity)?|F(?:ield(?:(?:AutoSiz|Typ)e)?|ormat(?:Align)?)|(?:E(?:lem|v)en|Snapsho)t|(?:DisplayMod|ColorTyp)e|R(?:enderer|otation)|B(?:aseline|lock)|Justifier)|r(?:iangleCulling|ansform)|yp(?:ographicCase|eError)|ab(?:Alignment|Stop)|imer(?:Event)?)|I(?:D(?:ynamicProperty(?:Output|Writer)|ata(?:Out|In)put|rawCommand|3Info)|n(?:ter(?:polationMethod|activeObject)|validSWFError)|E(?:ventDispatcher|xternalizable)|Graphics(?:Stroke|Data|Fill|Path)|ME(?:ConversionMode|Event)?|llegalOperationError|OError(?:Event)?|BitmapDrawable)|C(?:o(?:n(?:te(?:xtMenu(?:(?:Clipboard|BuiltIn)Items|Event|Item)?|ntElement)|volutionFilter)|lor(?:Correction(?:Support)?|MatrixFilter|Transform))|l(?:ipboard(?:TransferMode|Formats)?|ass)|a(?:p(?:abilities|sStyle)|mera)|(?:ustomAction|SMSetting)s|FFHinting)|G(?:r(?:a(?:phic(?:s(?:S(?:(?:hader|olid)Fill|troke)|(?:Gradient|Bitmap|End)Fill|Path(?:Command|Winding)?|TrianglePath)?|Element)|dient(?:(?:Bevel|Glow)Filter|Type))|oupElement|idFitType)|lowFilter)|F(?:o(?:nt(?:(?:Postur|Styl|Typ)e|Description|Metrics|Lookup|Weight)?|cusEvent)|ile(?:Reference(?:List)?|Filter)|u(?:llScreenEvent|nction)|rameLabel)|A(?:c(?:ti(?:onScriptVersion|vityEvent)|cessibility(?:Properties)?)|(?:ntiAliasTyp|VM1Movi)e|r(?:gumentError|ray)|pplicationDomain|syncErrorEvent)|D(?:i(?:spla(?:cementMapFilter(?:Mode)?|yObject(?:Container)?)|git(?:Width|Case)|ctionary)|(?:ropShadowFilte|efinitionErro)r|at(?:aEvent|e))|B(?:itmap(?:Filter(?:Quality|Type)?|Data(?:Channel)?)?|(?:reakOpportunit|yteArra)y|l(?:urFilter|endMode)|evelFilter|oolean)|E(?:v(?:ent(?:Dispatcher|Phase)?|alError)|(?:astAsianJustifie|OFErro)r|xternalInterface|rror(?:Event)?|lementFormat|ndian)|P(?:r(?:intJob(?:O(?:rientation|ptions))?|o(?:gressEvent|xy))|erspectiveProjection|ixelSnapping|oint)|U(?:R(?:L(?:Request(?:Header|Method)?|Loader(?:DataFormat)?|Variables|Stream)|IError)|tils3D)|L(?:i(?:ne(?:Justification|ScaleMode)|gatureLevel)|o(?:ader(?:Context|Info)?|calConnection))|N(?:et(?:St(?:ream(?:Play(?:Transi|Op)tions|Info)?|atusEvent)|Connection)|amespace|umber)|M(?:o(?:use(?:Cursor|Event)?|rphShape|vieClip)|at(?:rix(?:3D)?|h)|emoryError|icrophone)|R(?:e(?:(?:ferenceErro|sponde)r|(?:nderingMod|ctangl)e|gExp)|angeError)|J(?:(?:ustification|oint)Style|PEGLoaderContext)|XML(?:(?:Documen|Socke|Lis)t|Nod(?:eTyp)?e|UI)?|Ke(?:y(?:board(?:Event)?|Location)|rning)|O(?:bject(?:Encoding)?|rientation3D)|V(?:e(?:ctor(?:3D)?|rifyError)|ideo)|(?:HTTPStatusEve|u?i)nt|arguments|QName)", "g");
		
		public var classes:String = "Accessibility AccessibilityProperties ActionScriptVersion ActivityEvent AntiAliasType ApplicationDomain ArgumentError arguments Array AsyncErrorEvent AVM1Movie BevelFilter Bitmap BitmapData BitmapDataChannel BitmapFilter BitmapFilterQuality BitmapFilterType BlendMode BlurFilter Boolean BreakOpportunity ByteArray Camera Capabilities CapsStyle CFFHinting Class Clipboard ClipboardFormats ClipboardTransferMode ColorCorrection ColorCorrectionSupport ColorMatrixFilter ColorTransform ContentElement ContextMenu ContextMenuBuiltInItems ContextMenuClipboardItems ContextMenuEvent ContextMenuItem ConvolutionFilter CSMSettings CustomActions DataEvent Date DefinitionError Dictionary DigitCase DigitWidth DisplacementMapFilter DisplacementMapFilterMode DisplayObject DisplayObjectContainer DropShadowFilter EastAsianJustifier ElementFormat Endian EOFError Error ErrorEvent EvalError Event EventDispatcher EventPhase ExternalInterface FileFilter FileReference FileReferenceList FocusEvent Font FontDescription FontLookup FontMetrics FontPosture FontStyle FontType FontWeight FrameLabel FullScreenEvent Function GlowFilter GradientBevelFilter GradientGlowFilter GradientType GraphicElement Graphics GraphicsBitmapFill GraphicsEndFill GraphicsGradientFill GraphicsPath GraphicsPathCommand GraphicsPathWinding GraphicsShaderFill GraphicsSolidFill GraphicsStroke GraphicsTrianglePath GridFitType GroupElement HTTPStatusEvent IBitmapDrawable ID3Info IDataInput IDataOutput IDrawCommand IDynamicPropertyOutput IDynamicPropertyWriter IEventDispatcher IExternalizable IGraphicsData IGraphicsFill IGraphicsPath IGraphicsStroke IllegalOperationError IME IMEConversionMode IMEEvent int InteractiveObject InterpolationMethod InvalidSWFError IOError IOErrorEvent JointStyle JPEGLoaderContext JustificationStyle Kerning Keyboard KeyboardEvent KeyLocation LigatureLevel LineJustification LineScaleMode Loader LoaderContext LoaderInfo LocalConnection Math Matrix Matrix3D MemoryError Microphone MorphShape Mouse MouseCursor MouseEvent MovieClip Namespace NetConnection NetStatusEvent NetStream NetStreamInfo NetStreamPlayOptions NetStreamPlayTransitions Number Object ObjectEncoding Orientation3D PerspectiveProjection PixelSnapping Point PrintJob PrintJobOptions PrintJobOrientation ProgressEvent Proxy QName RangeError Rectangle ReferenceError RegExp RenderingMode Responder SampleDataEvent Scene ScriptTimeoutError Security SecurityDomain SecurityError SecurityErrorEvent SecurityPanel Shader ShaderData ShaderEvent ShaderFilter ShaderInput ShaderJob ShaderParameter ShaderParameterType ShaderPrecision Shape SharedObject SharedObjectFlushStatus SimpleButton Socket Sound SoundChannel SoundCodec SoundLoaderContext SoundMixer SoundTransform SpaceJustifier SpreadMethod Sprite StackOverflowError Stage StageAlign StageDisplayState StageQuality StageScaleMode StaticText StatusEvent String StyleSheet SWFVersion SyncEvent SyntaxError System TabAlignment TabStop TextBaseline TextBlock TextColorType TextDisplayMode TextElement TextEvent TextField TextFieldAutoSize TextFieldType TextFormat TextFormatAlign TextJustifier TextLine TextLineCreationResult TextLineMetrics TextLineMirrorRegion TextLineValidity TextRenderer TextRotation TextSnapshot Timer TimerEvent Transform TriangleCulling TypeError TypographicCase uint URIError URLLoader URLLoaderDataFormat URLRequest URLRequestHeader URLRequestMethod URLStream URLVariables Utils3D Vector Vector3D VerifyError Video XML XMLDocument XMLList XMLNode XMLNodeType XMLSocket XMLUI";
		private var _as3ColorSetting:AS3ColorSetting;
		
		public function buildContextColorSettingList():void {
			_contextColorSettingList.length = 0;
			
			_contextColorSettingList.push(new ContextColorSetting(multiLineComments, _as3ColorSetting.comment));
			_contextColorSettingList.push(new ContextColorSetting(singleLineComments, _as3ColorSetting.comment));
			_contextColorSettingList.push(new ContextColorSetting(doubleQuotedString, _as3ColorSetting.string));
			_contextColorSettingList.push(new ContextColorSetting(singleQuotedString, _as3ColorSetting.string));
			//_contextColorSettingList.push(new ContextColorSetting(keywordsRegExp, _as3ColorSetting.as3Keywords));
			//_contextColorSettingList.push(new ContextColorSetting(classNameRegExp, _as3ColorSetting.className));
			
			var keywordString:String = keywords + " " + definitions;
			_keywordsColorSettingList.length = 0;
			var keywordsColorSetting:KeywordsColorSetting;
			var vectorString:Vector.<String>;
			
			//vectorString = makeVectorStringFromKeywords(keywordString);
			//_keywordsColorSettingList.push(new KeywordsColorSetting(vectorString, _as3ColorSetting.as3Keywords));
			//
			//if (classes) {
				//vectorString = makeVectorStringFromKeywords(classes);
				//_keywordsColorSettingList.push(new KeywordsColorSetting(vectorString, _as3ColorSetting.className));
			//}
			
			_keywordsColorSettingList.length = 0;
		}
		
		public function set as3ColorSetting(value:AS3ColorSetting):void 
		{
			_as3ColorSetting = value;
		}
		
		public function makeVectorStringFromKeywords($keywords:String):Vector.<String> {
			var vector:Vector.<String> = new Vector.<String>();
			
			$keywords.split(/ /).forEach(function ():void {
				vector.push(arguments[0]);
			});
			
			return vector;
		}
    }
}
