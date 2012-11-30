package  
{
	import away3d.entities.Mesh;
	import flash.display.BitmapData;
	import flash.geom.Point;
	import flash.geom.Vector3D;
	import starling.display.DisplayObject;
	import starling.display.DisplayObjectContainer;
	import starling.display.Image;
	import starling.display.Quad;
	import starling.display.Sprite;
	import starling.events.EnterFrameEvent;
	import starling.events.Event;
	import starling.events.Touch;
	import starling.events.TouchEvent;
	import starling.text.TextField;
	import starling.textures.Texture;
	import starling.events.TouchPhase;
	
	public class Foreground extends Sprite 
	{		
		private var _image:Image;
		private var _line:Quad;
		private var _text:TextField;
		private var _lineStartPoint:Point;
		private static var _instance:Foreground;
		
		private var v3d:Vector3D;
		private var point2D:Point;
		
		private var plane0:Vector.<interactiveObject>;
		private var hidden0:Boolean = false;
		private var plane1:Vector.<interactiveObject>;
		private var hidden1:Boolean = false;
		private var plane2:Vector.<interactiveObject>;
		private var hidden2:Boolean = false;
		private var plane3:Vector.<interactiveObject>;
		private var hidden3:Boolean = false;
		
		private var budList:Vector.<plantBud>;
		private var playerBud:plantBud;
		private var vineList0:Vector.<plantVine>;
		private var vineList1:Vector.<plantVine>;
		private var vineList2:Vector.<plantVine>;
		private var vineList3:Vector.<plantVine>;
		private var playerVine:plantVine;
		private var branchingGuideL:angleGuide;
		private var branchingGuideR:angleGuide;
		
		private var plantFood:food;
		private var glass:window;
		private var blockade:obstacle;
		
		private var buildingRotation:Number;		
		public var moveWorld:Number = 0;
		public var branching:Boolean;
		private var selectedBud:plantBud;
		private var spriteHolder:interactiveObject;
		
		public var intro:Boolean = true;
		private var maxHeight:Number = 550;
		
		private var i:int;
		private var RandomNumber:int;
		private var dx:Number;
		private var dy:Number;
		private var angle:Number;
		private var distance:Number;
		
		public function Foreground() 
		{
			_instance = this;
			
			super();
			
			this.addEventListener(Event.ADDED_TO_STAGE, OnAddedToStage);
		}
		
		public static function GetInstance():Foreground
		{
			return _instance;
		}
		
		private function OnAddedToStage(event:Event):void
		{
			v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0));
			
			var txtField:flash.display.Sprite = new flash.display.Sprite();
			txtField.graphics.beginFill(0x000000);
			txtField.graphics.drawRect(0, 0, 150, 50);
			txtField.graphics.endFill();
			
			var bmpData:BitmapData = new BitmapData(txtField.width, txtField.height);
			bmpData.draw(txtField);
			
			_image = new Image(Texture.fromBitmapData(bmpData));
			_image.x = stage.stageWidth - _image.width - 10;
			_image.y = stage.stageHeight - _image.height - 10;
			this.addChild(_image);
			
			// Add textfield
			_text = new TextField(150, 50, "...", "Verdana", 12, 0xffffff);
			_text.hAlign = "left";
			_text.x = _image.x;
			_text.y = _image.y;
			this.addChild(_text);
			
			// Create line field
			_line = new Quad(10, 1, 0x000000);
			_line.width = 200;
			_line.height = 1;
			this.addChild(_line);
			
			// Start point of line
			_lineStartPoint = new Point(_image.x, _image.y);
			_line.x = _lineStartPoint.x;
			_line.y = _lineStartPoint.y;
			
			point2D = new Point(0,0);
			
			//Arranging Level
			plane0 = new Vector.<interactiveObject>();
			plane1 = new Vector.<interactiveObject>();
			plane2 = new Vector.<interactiveObject>();
			plane3 = new Vector.<interactiveObject>();
			vineList0 = new Vector.<plantVine>();
			vineList1 = new Vector.<plantVine>();
			vineList2 = new Vector.<plantVine>();
			vineList3 = new Vector.<plantVine>();
			
			//Adding Player
			budList = new Vector.<plantBud>();
			playerBud = new plantBud(250, 0, 0, 3);
			playerVine = new plantVine(250, 0, playerBud);
			playerBud.myVine = playerVine;
			vineList0.push(playerVine);
			addChild(playerVine);
			budList.push(playerBud);
			addChild(playerBud);
			
			addEventListener(TouchEvent.TOUCH, onTouch);
		}
		
		private function onTouch(event:TouchEvent):void
		{
			var touch2D:Touch = event.getTouch(this);
			if (touch2D != null)
			{
				var positionTouch:Point = new Point(touch2D.globalX, touch2D.globalY);
				var clicked:DisplayObject = this.hitTest(positionTouch, true);
				if (touch2D.phase == TouchPhase.BEGAN)
				{
					if (clicked != null)
					{
						if (clicked.parent is plantBud)
						{
							branching = true;
							selectedBud = clicked.parent as plantBud;
							selectedBud.startBranching();
							//Creating Guides
							branchingGuideL = new angleGuide(true,selectedBud.x,selectedBud.y);
							addChild(branchingGuideL);
							branchingGuideR = new angleGuide(false,selectedBud.x,selectedBud.y);
							addChild(branchingGuideR);
						}
					}
				}
				else if (touch2D.phase == TouchPhase.ENDED)
				{
					branching = false;
					removeChild(branchingGuideL);
					removeChild(branchingGuideR);
					if (clicked != null)
					{
						if (clicked.parent == selectedBud)
						{
							if (selectedBud.budGrowth > 1)
							{
								//Branch Bud
								RandomNumber = Math.floor(Math.random() * (selectedBud.budGrowth - 1)) + 1;
								createBud(true);
								RandomNumber = selectedBud.budGrowth - RandomNumber;
								createBud(false);								
								selectedBud.makeJoint();
							}
							else
								selectedBud.cancelBranching();
						}
						else
						{
							selectedBud.cancelBranching();
						}
					}
					else
					{
						selectedBud.cancelBranching();
					}
				}
			}
		}
		
		private function createBud(isLeft:Boolean):void
		{
			playerBud = new plantBud(selectedBud.RealX, selectedBud.RealY, selectedBud.worldPlane, RandomNumber, (isLeft)? -branchingGuideL.rotation:-branchingGuideR.rotation);
			playerVine = new plantVine(selectedBud.RealX, selectedBud.RealY, playerBud);
			playerBud.myVine = playerVine;
			switch(playerBud.worldPlane)
			{
				case 0:
					vineList0.push(playerVine);
					break;
				case 1:
					vineList1.push(playerVine);
					break;
				case 2:
					vineList2.push(playerVine);
					break;
				case 3:
					vineList3.push(playerVine);
					break;
				default:
					break;
			}
			addChild(playerVine);
			budList.push(playerBud);
			addChild(playerBud);
		}
		
		public function Update(rotationY:Number):void
		{
			buildingRotation = rotationY < 0 ? 360 + rotationY % 360 : rotationY % 360;
			ShowAndHideWalls();
			
			//*Move objects*
			//Plant Buds
			for (i = 0; i < budList.length; i++)
			{
				playerBud = budList[i];
				//Moving Up
				playerBud.RealY += playerBud.YSpeed;
				
				//Who is highest?
				if (i > 0)
				{
					if(spriteHolder.RealY < playerBud.RealY)
						spriteHolder = playerBud;
				}
				else
					spriteHolder = playerBud;
				
				playerBud.RealX += playerBud.XSpeed;
				//Changing plane
				if (playerBud.RealX < 0)
				{
					playerBud.myVine.KillInPlane(playerBud.RealX, playerBud.RealY);
					playerBud.RealX = 500 + playerBud.RealX;
					playerBud.worldPlane--;
					if (playerBud.worldPlane < 0)
						playerBud.worldPlane = 3;
					//Creating new vine for new plane
					playerVine = new plantVine(playerBud.RealX, playerBud.RealY, playerBud);
					playerBud.myVine = playerVine;
					switch(playerBud.worldPlane)
					{
						case 0:
							vineList0.push(playerVine);
							break;
						case 1:
							vineList1.push(playerVine);
							break;
						case 2:
							vineList2.push(playerVine);
							break;
						case 3:
							vineList3.push(playerVine);
							break;
						default:
							break;
					}
					addChild(playerVine);
				}
				else if (playerBud.RealX > 500)
				{
					playerBud.myVine.KillInPlane(playerBud.RealX, playerBud.RealY);
					playerBud.RealX = playerBud.RealX - 500;
					playerBud.worldPlane++;
					if (playerBud.worldPlane > 3)
						playerBud.worldPlane = 0;
					//Creating new vine for new plane
					playerVine = new plantVine(playerBud.RealX, playerBud.RealY, playerBud);
					playerBud.myVine = playerVine;
					switch(playerBud.worldPlane)
					{
						case 0:
							vineList0.push(playerVine);
							break;
						case 1:
							vineList1.push(playerVine);
							break;
						case 2:
							vineList2.push(playerVine);
							break;
						case 3:
							vineList3.push(playerVine);
							break;
						default:
							break;
					}
					addChild(playerVine);
				}
				//Showing or Hiding
				switch(playerBud.worldPlane)
				{
					case 0:
						playerBud.visible = (hidden0)?false:true;
						break;
					case 1:
						playerBud.visible = (hidden1)?false:true;
						break;
					case 2:
						playerBud.visible = (hidden2)?false:true;
						break;
					case 3:
						playerBud.visible = (hidden3)?false:true;
						break;
					default:
						break;
				}
			}
			
			//Branching
			if (branching)
			{
				branchingGuideL.x = selectedBud.x;
				branchingGuideL.y = selectedBud.y;
				branchingGuideR.x = selectedBud.x;
				branchingGuideR.y = selectedBud.y;
				
				branchingGuideL.rotation += (branchingGuideL.goingBackwards)? 0.01:-0.01;
				if (branchingGuideL.rotation < -3)
					branchingGuideL.goingBackwards = true;
				else if (branchingGuideL.rotation > -1.6)
					branchingGuideL.goingBackwards = false;
				branchingGuideR.rotation += (branchingGuideL.goingBackwards)? -0.01: 0.01;
			}
			
			//*Move World*
			playerBud = spriteHolder as plantBud;			
			if (playerBud.RealY > maxHeight)
				moveWorld += playerBud.RealY - maxHeight;
				
			if (!intro)
			{
				for (i = 0; i < budList.length; i++)
				{
					playerBud = budList[i];
					playerBud.RealY -= moveWorld;
					//Adjusting in 2D
					if (playerBud.visible)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,playerBud.RealX, playerBud.RealY,playerBud.worldPlane));
						playerBud.x = v3d.x;
						playerBud.y = v3d.y;
					}
				}
			}
			else
			{
				maxHeight += moveWorld;
				for (i = 0; i < budList.length; i++)
				{
					playerBud = budList[i];
					//Adjusting in 2D
					if (playerBud.visible)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,playerBud.RealX, playerBud.RealY,playerBud.worldPlane));
						playerBud.x = v3d.x;
						playerBud.y = v3d.y;
					}
				}
			}
			
			//Vines
			updateVines(vineList0, 0);
			updateVines(vineList1, 1);
			updateVines(vineList2, 2);
			updateVines(vineList3, 3);
		}
		
		public function DrawLine():void
		{
			v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0));
			point2D.x = v3d.x,
			point2D.y = v3d.y;
			
			// Set distance points
			dx = point2D.x - _lineStartPoint.x;
			dy = point2D.y - _lineStartPoint.y;
			
			// Calculate angle between 2 points
			angle = Math.atan2(dy, dx);
			
			// Calculate distance between 2 points
			distance = Math.sqrt(dx * dx + dy * dy);
			
			for (i = 0; i < plane0.length; i++)
			{
				spriteHolder = plane0[i]as interactiveObject;
				v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,0));
				spriteHolder.x = v3d.x;
				spriteHolder.y = v3d.y;
			}			
			
			_line.rotation = 0; // Always first reset rotation to zero before change width
			_line.width = Math.round(distance);
			_line.rotation = angle;
			
			_text.text = "Distance climbed: " +  Math.round(distance * 100) / 100 + "\n";
			_text.text += "angle: " + Math.round(_line.rotation * 100) / 100;
		}
		
		private function updateVines(list:Vector.<plantVine>,wall:int):void
		{
			for (i = 0; i < list.length; i++)
			{
				playerVine = list[i] as plantVine;
				if (!intro)
				{
					playerVine.RealY -= moveWorld;
					if(playerVine.isDead)
						playerVine.deadPoint.y -= moveWorld;
				}
				switch(wall)
				{
					case 0:
						playerVine.visible = (hidden0)?false:true;
						break;
					case 1:
						playerVine.visible = (hidden1)?false:true;
						break;
					case 2:
						playerVine.visible = (hidden2)?false:true;
						break;
					case 3:
						playerVine.visible = (hidden3)?false:true;
						break;
					default:
						break;
				}
				if (playerVine.visible)
				{
					v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,playerVine.RealX, playerVine.RealY,wall));
					playerVine.x = v3d.x;
					playerVine.y = v3d.y;
					
					if (playerVine.isDead)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, playerVine.deadPoint.x, playerVine.deadPoint.y, wall));
						// Set distance points
						dx = v3d.x - playerVine.x;
						dy = v3d.y - playerVine.y;
					}
					else
					{
						// Set distance points
						dx = playerVine.master.x - playerVine.x;
						dy = playerVine.master.y - playerVine.y;
					}
					
					// Calculate angle between 2 points
					angle = Math.atan2(dy, dx);
					
					// Calculate distance between 2 points
					distance = Math.sqrt(dx * dx + dy * dy);
					
					playerVine.rotation = 0; //Reset rotation to zero before change width
					playerVine.width = Math.round(distance);
					playerVine.rotation = angle;
				}
			}
		}
		
		private function ShowAndHideWalls():void
		{
			//Wall0
			if(buildingRotation > 75 && buildingRotation < 285)
			{
				if (!hidden0)
				{
					for (i = 0; i < plane0.length; i++)
					{
						spriteHolder = plane0[i]as interactiveObject;
						spriteHolder.visible = false;
					}
					hidden0 = true;
				}
			}
			else if (hidden0)
			{
				for (i = 0; i < plane0.length; i++)
				{
					spriteHolder = plane0[i]as interactiveObject;
					spriteHolder.visible = true;
				}
				hidden0 = false;
			}
			
			//Wall1
			if(buildingRotation > 165 || buildingRotation < 15)
			{
				if (!hidden1)
				{
					for (i = 0; i < plane1.length; i++)
					{
						spriteHolder = plane1[i]as interactiveObject;
						spriteHolder.visible = false;
					}
					hidden1 = true;
				}
			}
			else if (hidden1)
			{
				for (i = 0; i < plane1.length; i++)
				{
					spriteHolder = plane1[i]as interactiveObject;
					spriteHolder.visible = true;
				}
				hidden1 = false;
			}
			
			//Wall2
			if(buildingRotation > 255 || buildingRotation < 105)
			{
				if (!hidden2)
				{
					for (i = 0; i < plane2.length; i++)
					{
						spriteHolder = plane2[i]as interactiveObject;
						spriteHolder.visible = false;
					}
					hidden2 = true;
				}
			}
			else if (hidden2)
			{
				for (i = 0; i < plane2.length; i++)
				{
					spriteHolder = plane2[i]as interactiveObject;
					spriteHolder.visible = true;
				}
				hidden2 = false;
			}
			
			//Wall3
			if(buildingRotation > 345 || buildingRotation < 195)
			{
				if (!hidden3)
				{
					for (i = 0; i < plane3.length; i++)
					{
						spriteHolder = plane3[i]as interactiveObject;
						spriteHolder.visible = false;
					}
					hidden3 = true;
				}
			}
			else if (hidden3)
			{
				for (i = 0; i < plane3.length; i++)
				{
					spriteHolder = plane3[i]as interactiveObject;
					spriteHolder.visible = true;
				}
				hidden3 = false;
			}
		}
	}
}