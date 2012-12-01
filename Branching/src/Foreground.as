package  
{
	import away3d.entities.Mesh;
	import flash.display.BitmapData;
	import flash.geom.Point;
	import flash.geom.Vector3D;
	import starling.display.Button;
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
		private static var _instance:Foreground;
		
		private var audioManager:soundManager;
		
		private var titleImage:Image;
		
		private var _image:Image;
		private var _text:TextField;
		private var _startDialog:Image;
		private var _startText:TextField;
		private var _gameOverDialog:Image;
		private var _gameOverText:TextField;
		private var restartBttn:Button;
		
		private var touch2D:Touch;
		private var v3d:Vector3D;
		
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
		private var hole:window;
		private var blockade:obstacle;
		
		private var buildingRotation:Number;		
		public var moveWorld:Number = 0;
		public var branching:Boolean;
		private var selectedBud:plantBud;
		private var spriteHolder:interactiveObject;
		private var ObjectHolder:interactiveObject;
		
		public var GameOn:Boolean = false;
		public var GameOff:Boolean = false;
		public var RestartMe:Boolean = false;
		public var intro:Boolean = true;
		private var reachedTop:Boolean = false;
		private var budsDead:Boolean = false;
		private var maxHeight:Number = 550;
		private var buildingBlock:int = 0;
		private var blockTracker:Number = 0;
		
		private var altitude:Number;
		private var i:int;
		private var j:int;
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
			
			audioManager = new soundManager();
			
			var titleTexture:Texture = Texture.fromBitmap(new Resources.titleTexture());
			titleImage = new Image(titleTexture);
			titleImage.x = 300 - (titleImage.width / 2);
			titleImage.y = 10;
			addChild(titleImage);
			
			var txtField:flash.display.Sprite = new flash.display.Sprite();
			txtField.graphics.beginFill(0x000000);
			txtField.graphics.drawRect(0, 0, 150, 50);
			txtField.graphics.endFill();
			
			var bmpData:BitmapData = new BitmapData(txtField.width, txtField.height);
			bmpData.draw(txtField);
			
			_image = new Image(Texture.fromBitmapData(bmpData));
			_image.alpha = 0.7;
			_image.x = stage.stageWidth - _image.width - 10;
			_image.y = stage.stageHeight - _image.height - 10;
			_image.visible = false;
			this.addChild(_image);
			
			// Add textfield
			_text = new TextField(150, 50, "...", "Verdana", 16, 0xffffff);
			_text.hAlign = "left";
			_text.x = _image.x+4;
			_text.y = _image.y;
			_text.visible = false;
			this.addChild(_text);
			
			//Start Dialog
			txtField = new flash.display.Sprite();
			txtField.graphics.beginFill(0x000000);
			txtField.graphics.drawRect(0, 0, 160, 60);
			txtField.graphics.endFill();
			
			bmpData = new BitmapData(txtField.width, txtField.height);
			bmpData.draw(txtField);
			
			_startDialog = new Image(Texture.fromBitmapData(bmpData));
			_startDialog.alpha = 0.7;
			_startDialog.x = 0;
			_startDialog.y = 0;
			this.addChild(_startDialog);
			
			// Add textfield
			_startText = new TextField(160, 60, "Click and release to start playing!", "Verdana", 18, 0xffffff);
			_startText.hAlign = "center";
			_startText.x = _startDialog.x+2;
			_startText.y = _startDialog.y+2;
			this.addChild(_startText);
			
			//Game Over Dialog
			txtField = new flash.display.Sprite();
			txtField.graphics.beginFill(0x000000);
			txtField.graphics.drawRect(0, 0, 300, 180);
			txtField.graphics.endFill();
			
			bmpData = new BitmapData(txtField.width, txtField.height);
			bmpData.draw(txtField);
			
			_gameOverDialog = new Image(Texture.fromBitmapData(bmpData));
			_gameOverDialog.alpha = 0.8;
			_gameOverDialog.x = 150;
			_gameOverDialog.y = 250;
			
			// Add textfield
			_gameOverText = new TextField(300, 180, "Your plants are dead :(\n", "Verdana", 24, 0xffffff);
			_gameOverText.hAlign = "center";
			_gameOverText.x = _gameOverDialog.x;
			_gameOverText.y = _gameOverText.y + 220;
			
			//Restart Button
			var DummyBox:flash.display.Sprite = new flash.display.Sprite();
			DummyBox.graphics.beginFill(0xeeeeee, 1);
			DummyBox.graphics.drawRect(0,0,100,50);
			DummyBox.graphics.endFill();
			bmpData = new BitmapData(80,40,true,0x000000);
			bmpData.draw(DummyBox);
			var BttnTexture:Texture = Texture.fromBitmapData(bmpData,false,false);
			restartBttn = new Button(BttnTexture, "Restart Game");
			restartBttn.x = 300 - (restartBttn.width / 2);
			restartBttn.y = 370;
			restartBttn.addEventListener(Event.TRIGGERED, OnRestart);
			
			//Arranging Level
			plane0 = new Vector.<interactiveObject>();
			plane1 = new Vector.<interactiveObject>();
			plane2 = new Vector.<interactiveObject>();
			plane3 = new Vector.<interactiveObject>();
			vineList0 = new Vector.<plantVine>();
			vineList1 = new Vector.<plantVine>();
			vineList2 = new Vector.<plantVine>();
			vineList3 = new Vector.<plantVine>();
			
			objectDispatcher();
			objectDispatcher();
			objectDispatcher();
			objectDispatcher();
			objectDispatcher();
			
			altitude = 0;
			
			//Adding Player
			budList = new Vector.<plantBud>();
			playerBud = new plantBud(250, 0, 0, 3);
			playerVine = new plantVine(250, 0, playerBud);
			playerBud.myVine = playerVine;
			vineList0.push(playerVine);
			addChild(playerVine);
			budList.push(playerBud);
			playerBud.startBranching();
			addChild(playerBud);
			
			addEventListener(TouchEvent.TOUCH, onStartTouch);
		}
		
		public function waitStart(rotationY:Number):void
		{
			buildingRotation = rotationY < 0 ? 360 + rotationY % 360 : rotationY % 360;
			ShowAndHideWalls();
			
			//*Move objects*
			//Plant Buds
			budsDead = true;
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
				
				//Showing or Hiding
				playerBud.visible = (hidden0)?false:true;
				CheckCollision(plane0);
			}
			
			//Branching
			if (branching)
			{
				branchingGuideL.x = playerBud.x;
				branchingGuideL.y = playerBud.y;
				
				if (touch2D != null)
				{
					dx = touch2D.globalX - branchingGuideL.x;
					dy = touch2D.globalY - branchingGuideL.y;
				}
				
				// Calculate angle between 2 points
				angle = Math.atan2(dy, dx);
				if (angle > -0.4)
					angle = -0.4;
				else if (angle < -2.7)
					angle = -2.7;
				branchingGuideL.rotation = angle;				
			}
			
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
			
			//Game Objects
			for (i = 0; i < plane0.length; i++)
			{
				spriteHolder = plane0[i];
				if (!intro)
					spriteHolder.RealY -= moveWorld;
				spriteHolder.visible = (hidden0)?false:true;
				//Adjusting in 2D
				if (spriteHolder.visible)
				{
					if (spriteHolder is obstacle)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,0));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;

						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 0));
						// Set distance points
						dx = v3d.x - spriteHolder.x;
						dy = v3d.y - spriteHolder.y;
						
						// Calculate angle between 2 points
						angle = Math.atan2(dy, dx);
						
						// Calculate distance between 2 points
						distance = Math.sqrt(dx * dx + dy * dy);
						
						spriteHolder.rotation = 0; //Reset rotation to zero before change width
						spriteHolder.width = Math.round(distance);
						spriteHolder.rotation = angle;
					}
					else
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,0));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;
						
						if (spriteHolder is window)
						{
							v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 0));
							// Set distance points
							dx = v3d.x - spriteHolder.x;
							dy = v3d.y - spriteHolder.y;
							
							// Calculate distance between 2 points
							distance = Math.sqrt(dx * dx + dy * dy);
							
							spriteHolder.width = Math.round(distance);
						}
					}
				}
			}
			for (i = 0; i < plane1.length; i++)
			{
				spriteHolder = plane1[i];
				if (!intro)
					spriteHolder.RealY -= moveWorld;
				spriteHolder.visible = (hidden1)?false:true;
				//Adjusting in 2D
				if (spriteHolder.visible)
				{
					if (spriteHolder is obstacle)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,1));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;

						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 1));
						// Set distance points
						dx = v3d.x - spriteHolder.x;
						dy = v3d.y - spriteHolder.y;
						
						// Calculate angle between 2 points
						angle = Math.atan2(dy, dx);
						
						// Calculate distance between 2 points
						distance = Math.sqrt(dx * dx + dy * dy);
						
						spriteHolder.rotation = 0; //Reset rotation to zero before change width
						spriteHolder.width = Math.round(distance);
						spriteHolder.rotation = angle;
					}
					else
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,1));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;
						
						if (spriteHolder is window)
						{
							v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 1));
							// Set distance points
							dx = v3d.x - spriteHolder.x;
							dy = v3d.y - spriteHolder.y;
							
							// Calculate distance between 2 points
							distance = Math.sqrt(dx * dx + dy * dy);
							
							spriteHolder.width = Math.round(distance);
						}
					}
				}
			}
			for (i = 0; i < plane2.length; i++)
			{
				spriteHolder = plane2[i];
				if (!intro)
					spriteHolder.RealY -= moveWorld;
				spriteHolder.visible = (hidden2)?false:true;
				//Adjusting in 2D
				if (spriteHolder.visible)
				{
					if (spriteHolder is obstacle)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,2));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;

						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 2));
						// Set distance points
						dx = v3d.x - spriteHolder.x;
						dy = v3d.y - spriteHolder.y;
						
						// Calculate angle between 2 points
						angle = Math.atan2(dy, dx);
						
						// Calculate distance between 2 points
						distance = Math.sqrt(dx * dx + dy * dy);
						
						spriteHolder.rotation = 0; //Reset rotation to zero before change width
						spriteHolder.width = Math.round(distance);
						spriteHolder.rotation = angle;
					}
					else
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,2));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;
						
						if (spriteHolder is window)
						{
							v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 2));
							// Set distance points
							dx = v3d.x - spriteHolder.x;
							dy = v3d.y - spriteHolder.y;
							
							// Calculate distance between 2 points
							distance = Math.sqrt(dx * dx + dy * dy);
							
							spriteHolder.width = Math.round(distance);
						}
					}
				}
			}
			for (i = 0; i < plane3.length; i++)
			{
				spriteHolder = plane3[i];
				if (!intro)
					spriteHolder.RealY -= moveWorld;
				spriteHolder.visible = (hidden3)?false:true;
				//Adjusting in 2D
				if (spriteHolder.visible)
				{
					if (spriteHolder is obstacle)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,3));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;

						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 3));
						// Set distance points
						dx = v3d.x - spriteHolder.x;
						dy = v3d.y - spriteHolder.y;
						
						// Calculate angle between 2 points
						angle = Math.atan2(dy, dx);
						
						// Calculate distance between 2 points
						distance = Math.sqrt(dx * dx + dy * dy);
						
						spriteHolder.rotation = 0; //Reset rotation to zero before change width
						spriteHolder.width = Math.round(distance);
						spriteHolder.rotation = angle;
					}
					else
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,3));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;
						
						if (spriteHolder is window)
						{
							v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 3));
							// Set distance points
							dx = v3d.x - spriteHolder.x;
							dy = v3d.y - spriteHolder.y;
							
							// Calculate distance between 2 points
							distance = Math.sqrt(dx * dx + dy * dy);
							
							spriteHolder.width = Math.round(distance);
						}
					}
				}
			}
			
			v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, playerBud.RealX, playerBud.RealY, 0));
			_startDialog.x = v3d.x - (_startDialog.width/2);
			_startText.x = _startDialog.x +1;
			_startDialog.y = v3d.y - 80;
			_startText.y = _startDialog.y - 2;
			
			this.swapChildrenAt(this.getChildIndex(titleImage), this.numChildren -1);
		}
		
		private function startGame():void
		{
			removeChild(_startText,true);
			removeChild(_startDialog, true);
			removeChild(titleImage, true);
			_image.visible = true;
			_text.visible = true;
			removeEventListener(TouchEvent.TOUCH, onStartTouch);
			addEventListener(TouchEvent.TOUCH, onTouch);
			GameOn = true;
		}
		
		private function onStartTouch(event:TouchEvent):void
		{
			touch2D = event.getTouch(this);
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
							//Creating Guides
							branchingGuideL = new angleGuide(true,selectedBud.x,selectedBud.y);
							addChild(branchingGuideL);
						}
					}
				}
				else if (touch2D.phase == TouchPhase.ENDED)
				{
					if (branchingGuideL != null)
					{
						branching = false;
						RandomNumber = 3;
						playerBud.makeJoint();
						createBud(true);
						audioManager.playDivide();
						removeChild(branchingGuideL);
						startGame();
					}
				}
			}
		}
		
		private function onTouch(event:TouchEvent):void
		{
			touch2D = event.getTouch(this);
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
					if (selectedBud is plantBud)
					{
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
									audioManager.playDivide();
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
			budsDead = true;
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
				
				switch(playerBud.worldPlane)
				{
					case 0:
						//Showing or Hiding
						playerBud.visible = (hidden0)?false:true;
						CheckCollision(plane0);
						break;
					case 1:
						//Showing or Hiding
						playerBud.visible = (hidden1)?false:true;
						CheckCollision(plane1);
						break;
					case 2:
						//Showing or Hiding
						playerBud.visible = (hidden2)?false:true;
						CheckCollision(plane2);
						break;
					case 3:
						//Showing or Hiding
						playerBud.visible = (hidden3)?false:true;
						CheckCollision(plane3);
						break;
					default:
						break;
				}
				
				if (!playerBud.dead)
					budsDead = false;
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
			{
				reachedTop = true;
				moveWorld += playerBud.RealY - maxHeight;
				altitude += moveWorld * 0.005;
				blockTracker += moveWorld;
				if (blockTracker > 250)
				{
					CleanBelowScreen();
					objectDispatcher();
					blockTracker -= 250;
				}
			}
			else
			{
				if(!reachedTop)
					altitude = (playerBud.RealY * 0.005);
			}
				
			if (!intro)
			{
				for (i = 0; i < budList.length; i++)
				{
					playerBud = budList[i];
					playerBud.RealY -= moveWorld;
					if (playerBud.RealY < 0)
					{
						playerBud.myVine.isDead = true;
						playerBud.myVine.CleanMePlease = true;
						budList.splice(i, 1);
						removeChild(playerBud, true);
						i--;
						continue;
					}
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
			
			//Game Objects
			for (i = 0; i < plane0.length; i++)
			{
				spriteHolder = plane0[i];
				if (!intro)
					spriteHolder.RealY -= moveWorld;
				spriteHolder.visible = (hidden0)?false:true;
				//Adjusting in 2D
				if (spriteHolder.visible)
				{
					if (spriteHolder is obstacle)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,0));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;

						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 0));
						// Set distance points
						dx = v3d.x - spriteHolder.x;
						dy = v3d.y - spriteHolder.y;
						
						// Calculate angle between 2 points
						angle = Math.atan2(dy, dx);
						
						// Calculate distance between 2 points
						distance = Math.sqrt(dx * dx + dy * dy);
						
						spriteHolder.rotation = 0; //Reset rotation to zero before change width
						spriteHolder.width = Math.round(distance);
						spriteHolder.rotation = angle;
					}
					else
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,0));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;
						
						if (spriteHolder is window)
						{
							v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 0));
							// Set distance points
							dx = v3d.x - spriteHolder.x;
							dy = v3d.y - spriteHolder.y;
							
							// Calculate distance between 2 points
							distance = Math.sqrt(dx * dx + dy * dy);
							
							spriteHolder.width = Math.round(distance);
						}
					}
				}
			}
			for (i = 0; i < plane1.length; i++)
			{
				spriteHolder = plane1[i];
				if (!intro)
					spriteHolder.RealY -= moveWorld;
				spriteHolder.visible = (hidden1)?false:true;
				//Adjusting in 2D
				if (spriteHolder.visible)
				{
					if (spriteHolder is obstacle)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,1));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;

						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 1));
						// Set distance points
						dx = v3d.x - spriteHolder.x;
						dy = v3d.y - spriteHolder.y;
						
						// Calculate angle between 2 points
						angle = Math.atan2(dy, dx);
						
						// Calculate distance between 2 points
						distance = Math.sqrt(dx * dx + dy * dy);
						
						spriteHolder.rotation = 0; //Reset rotation to zero before change width
						spriteHolder.width = Math.round(distance);
						spriteHolder.rotation = angle;
					}
					else
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,1));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;
						
						if (spriteHolder is window)
						{
							v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 1));
							// Set distance points
							dx = v3d.x - spriteHolder.x;
							dy = v3d.y - spriteHolder.y;
							
							// Calculate distance between 2 points
							distance = Math.sqrt(dx * dx + dy * dy);
							
							spriteHolder.width = Math.round(distance);
						}
					}
				}
			}
			for (i = 0; i < plane2.length; i++)
			{
				spriteHolder = plane2[i];
				if (!intro)
					spriteHolder.RealY -= moveWorld;
				spriteHolder.visible = (hidden2)?false:true;
				//Adjusting in 2D
				if (spriteHolder.visible)
				{
					if (spriteHolder is obstacle)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,2));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;

						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 2));
						// Set distance points
						dx = v3d.x - spriteHolder.x;
						dy = v3d.y - spriteHolder.y;
						
						// Calculate angle between 2 points
						angle = Math.atan2(dy, dx);
						
						// Calculate distance between 2 points
						distance = Math.sqrt(dx * dx + dy * dy);
						
						spriteHolder.rotation = 0; //Reset rotation to zero before change width
						spriteHolder.width = Math.round(distance);
						spriteHolder.rotation = angle;
					}
					else
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,2));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;
						
						if (spriteHolder is window)
						{
							v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 2));
							// Set distance points
							dx = v3d.x - spriteHolder.x;
							dy = v3d.y - spriteHolder.y;
							
							// Calculate distance between 2 points
							distance = Math.sqrt(dx * dx + dy * dy);
							
							spriteHolder.width = Math.round(distance);
						}
					}
				}
			}
			for (i = 0; i < plane3.length; i++)
			{
				spriteHolder = plane3[i];
				if (!intro)
					spriteHolder.RealY -= moveWorld;
				spriteHolder.visible = (hidden3)?false:true;
				//Adjusting in 2D
				if (spriteHolder.visible)
				{
					if (spriteHolder is obstacle)
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,3));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;

						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 3));
						// Set distance points
						dx = v3d.x - spriteHolder.x;
						dy = v3d.y - spriteHolder.y;
						
						// Calculate angle between 2 points
						angle = Math.atan2(dy, dx);
						
						// Calculate distance between 2 points
						distance = Math.sqrt(dx * dx + dy * dy);
						
						spriteHolder.rotation = 0; //Reset rotation to zero before change width
						spriteHolder.width = Math.round(distance);
						spriteHolder.rotation = angle;
					}
					else
					{
						v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh,0,0,spriteHolder.RealX, spriteHolder.RealY,3));
						spriteHolder.x = v3d.x;
						spriteHolder.y = v3d.y;
						
						if (spriteHolder is window)
						{
							v3d = Main.Away3dView.project(Main.GetVerticeWorldPosition(Main.Away3dView.scene.getChildAt(0) as Mesh, 0, 0, spriteHolder.RealX + spriteHolder.RealWidth, spriteHolder.RealY, 3));
							// Set distance points
							dx = v3d.x - spriteHolder.x;
							dy = v3d.y - spriteHolder.y;
							
							// Calculate distance between 2 points
							distance = Math.sqrt(dx * dx + dy * dy);
							
							spriteHolder.width = Math.round(distance);
						}
					}
				}
			}
			
			if (!GameOff)
			{
				this.sortChildren(sortVIP);
			}
			
			if (budsDead)
			{
				if(!GameOff)
					gameOver();
			}
		}
		
		public function UpdateHUD():void
		{			
			_text.text = "Altitude: " +  altitude.toFixed(2) +"m";
		}
		
		private function gameOver():void
		{
			audioManager.stopAll();
			GameOff = true;
			_image.visible = false;
			_text.visible = false;
			_gameOverText.text += "But you managed to climb " + altitude.toFixed(2) + " meters";
			this.addChild(_gameOverDialog);
			this.addChild(_gameOverText);
			this.addChild(restartBttn);
			this.swapChildrenAt(getChildIndex(_gameOverDialog), this.numChildren -3);
			this.swapChildrenAt(getChildIndex(_gameOverText), this.numChildren -2);
			this.swapChildrenAt(getChildIndex(restartBttn), this.numChildren -1);
		}
		
		private function OnRestart(event:Event):void
		{
			RestartMe = true;
		}
		
		private function CheckCollision(list:Vector.<interactiveObject>):void
		{
			for (j = 0; j < list.length; j++)
			{
				ObjectHolder = list[j];
				if (ObjectHolder is food)
				{
					if (playerBud.RealX < (ObjectHolder.RealX + (ObjectHolder.width*0.5)) && playerBud.RealX > (ObjectHolder.RealX - (ObjectHolder.width*0.5)) && playerBud.RealY < (ObjectHolder.RealY + (ObjectHolder.height*0.5)) && playerBud.RealY > (ObjectHolder.RealY - (ObjectHolder.height*0.5)))
					{
						removeChild(ObjectHolder, true);
						list.splice(j, 1);
						audioManager.playEat();
						playerBud.Grow();
					}
				}
				else if (ObjectHolder is obstacle)
				{
					if (playerBud.RealX < (ObjectHolder.RealX + ObjectHolder.RealWidth) && playerBud.RealX > ObjectHolder.RealX && playerBud.RealY < (ObjectHolder.RealY + (ObjectHolder.height*0.5)) && playerBud.RealY > (ObjectHolder.RealY - (ObjectHolder.height*0.5)))
					{
						if (playerBud.whoHurtMe != ObjectHolder as obstacle)
						{
							playerBud.Hurt();
							if (playerBud.dead)
								audioManager.playDied();
							else
								audioManager.playHit();
							playerBud.whoHurtMe = ObjectHolder as obstacle;
						}
					}
				}
				else if (ObjectHolder is window)
				{
					if (playerBud.RealX < (ObjectHolder.RealX + (ObjectHolder.width*0.5)) && playerBud.RealX > (ObjectHolder.RealX - (ObjectHolder.width*0.5)) && playerBud.RealY < (ObjectHolder.RealY + (ObjectHolder.height*0.5)) && playerBud.RealY > (ObjectHolder.RealY - (ObjectHolder.height*0.5)))
					{
						if(!playerBud.dead)
						{
							audioManager.playDied();
							playerBud.Kill();
						}
					}
				}
			}
		}
		
		private function updateVines(list:Vector.<plantVine>,wall:int):void
		{
			for (i = 0; i < list.length; i++)
			{
				playerVine = list[i] as plantVine;
				if (playerVine.CleanMePlease)
				{
					list.splice(i, 1);
					removeChild(playerVine, true);
					i--;
					continue;
				}
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
		
		private function objectDispatcher():void
		{
			for (i = 0; i < 4; i++)
			{
				RandomNumber = Math.floor(Math.random() * 4);
				switch(RandomNumber)
				{
					case 0:
					case 1:
						obstaclePattern();
						break;
					case 2:
						windowPattern();
						break;
					case 3:
						foodPattern();
						break;
				}
			}
			
			if(intro)
				buildingBlock++;
		}
		
		private function foodPattern():void
		{
			RandomNumber = Math.floor(Math.random() * 4);
			switch(RandomNumber)
			{
				case 0:
					plantFood = new food(250, 125 + (buildingBlock * 250));
					addToPlane(plantFood);
					addChild(plantFood);
					break;
				case 1:
					plantFood = new food(125, 125 + (buildingBlock * 250));
					addToPlane(plantFood);
					addChild(plantFood);
					plantFood = new food(375, 125 + (buildingBlock * 250));
					addToPlane(plantFood);
					addChild(plantFood);
					break;
				case 2:
					plantFood = new food(100, 125 + (buildingBlock * 250));
					addToPlane(plantFood);
					addChild(plantFood);
					plantFood = new food(400, 125 + (buildingBlock * 250));
					addToPlane(plantFood);
					addChild(plantFood);
					break;
				case 3:
					plantFood = new food(100, 125 + (buildingBlock * 250));
					addToPlane(plantFood);
					addChild(plantFood);
					plantFood = new food(250, 125 + (buildingBlock * 250));
					addToPlane(plantFood);
					addChild(plantFood);
					plantFood = new food(400, 125 + (buildingBlock * 250));
					addToPlane(plantFood);
					addChild(plantFood);
					break;
				default:
					break;
			}
		}
		
		private function windowPattern():void
		{
			RandomNumber = Math.floor(Math.random() * 3);
			switch(RandomNumber)
			{
				case 0:
					hole = new window(250, 125 + (buildingBlock * 250));
					addToPlane(hole);
					addChild(hole);
					break;
				case 1:
					hole = new window(125, 125 + (buildingBlock * 250));
					addToPlane(hole);
					addChild(hole);
					hole = new window(375, 125 + (buildingBlock * 250));
					addToPlane(hole);
					addChild(hole);
					break;
				case 2:
					hole = new window(125, 125 + (buildingBlock * 250));
					addToPlane(hole);
					addChild(hole);
					hole = new window(250, 125 + (buildingBlock * 250));
					addToPlane(hole);
					addChild(hole);
					hole = new window(375, 125 + (buildingBlock * 250));
					addToPlane(hole);
					addChild(hole);
					break;
				default:
					break;
			}
		}
		
		private function obstaclePattern():void
		{
			RandomNumber = Math.floor(Math.random() * 4);
			switch(RandomNumber)
			{
				case 0:
					blockade = new obstacle(200, 125 + (buildingBlock * 250));
					addToPlane(blockade);
					addChild(blockade);
					break;
				case 1:
					blockade = new obstacle(150, 125 + (buildingBlock * 250));
					addToPlane(blockade);
					addChild(blockade);
					blockade = new obstacle(250, 125 + (buildingBlock * 250));
					addToPlane(blockade);
					addChild(blockade);
					break;
				case 2:
					blockade = new obstacle(0, 125 + (buildingBlock * 250));
					addToPlane(blockade);
					addChild(blockade);
					blockade = new obstacle(200, 125 + (buildingBlock * 250));
					addToPlane(blockade);
					addChild(blockade);
					blockade = new obstacle(400, 125 + (buildingBlock * 250));
					addToPlane(blockade);
					addChild(blockade);
					break;
				case 3:
					blockade = new obstacle(0, 125 + (buildingBlock * 250));
					addToPlane(blockade);
					addChild(blockade);
					blockade = new obstacle(100, 125 + (buildingBlock * 250));
					addToPlane(blockade);
					addChild(blockade);
					blockade = new obstacle(300, 125 + (buildingBlock * 250));
					addToPlane(blockade);
					addChild(blockade);
					blockade = new obstacle(400, 125 + (buildingBlock * 250));
					addToPlane(blockade);
					addChild(blockade);
					break;
				default:
					break;
			}
		}
		
		private function addToPlane(iObject:interactiveObject):void
		{
			switch(i)
			{
				case 0:
					plane0.push(iObject);
					iObject.visible = (hidden0)?false:true;
					break;
				case 1:
					plane1.push(iObject);
					iObject.visible = (hidden1)?false:true;
					break;
				case 2:
					plane2.push(iObject);
					iObject.visible = (hidden2)?false:true;
					break;
				case 3:
					plane3.push(iObject);
					iObject.visible = (hidden3)?false:true;
					break;
				default:
					break;
			}
		}
		
		private function CleanBelowScreen():void
		{
			for (i = 0; i < plane0.length; i++)
			{
				ObjectHolder = plane0[i];
				if (ObjectHolder.RealY < 0)
				{
					plane0.splice(i, 1);
					removeChild(ObjectHolder, true);
					i--;
				}
				else
					break;
			}
			for (i = 0; i < plane1.length; i++)
			{
				ObjectHolder = plane1[i];
				if (ObjectHolder.RealY < 0)
				{
					plane1.splice(i, 1);
					removeChild(ObjectHolder, true);
					i--;
				}
				else
					break;
			}
			for (i = 0; i < plane2.length; i++)
			{
				ObjectHolder = plane2[i];
				if (ObjectHolder.RealY < 0)
				{
					plane2.splice(i, 1);
					removeChild(ObjectHolder, true);
					i--;
				}
				else
					break;
			}
			for (i = 0; i < plane3.length; i++)
			{
				ObjectHolder = plane3[i];
				if (ObjectHolder.RealY < 0)
				{
					plane3.splice(i, 1);
					removeChild(ObjectHolder, true);
					i--;
				}
				else
					break;
			}
		}
		
		private function sortVIP(do1:DisplayObject,do2:DisplayObject):int
		{
			if (do1 is plantBud && !(do2 is plantBud)) return 1;
			if (do2 is plantBud) return -1;
			return 0;
		}
		
		private function ShowAndHideWalls():void
		{
			//Wall0
			if(buildingRotation > 75 && buildingRotation < 285)
			{
				if (!hidden0)
				{
					hidden0 = true;
				}
			}
			else if (hidden0)
				hidden0 = false;
			
			//Wall1
			if(buildingRotation > 165 || buildingRotation < 15)
			{
				if (!hidden1)
				{
					hidden1 = true;
				}
			}
			else if (hidden1)
				hidden1 = false;
			
			//Wall2
			if(buildingRotation > 255 || buildingRotation < 105)
			{
				if (!hidden2)
				{
					hidden2 = true;
				}
			}
			else if (hidden2)
				hidden2 = false;
			
			//Wall3
			if(buildingRotation > 345 || buildingRotation < 195)
			{
				if (!hidden3)
				{
					hidden3 = true;
				}
			}
			else if (hidden3)
				hidden3 = false;
		}
	}
}