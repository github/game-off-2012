package 
{
	import away3d.cameras.Camera3D;
	import away3d.controllers.HoverController;
	import away3d.core.managers.Stage3DManager;
	import away3d.core.managers.Stage3DProxy;
	import away3d.containers.View3D;
	import away3d.entities.Mesh;
	import away3d.events.Stage3DEvent;
	import away3d.lights.DirectionalLight;
	import away3d.materials.lightpickers.StaticLightPicker;
	import away3d.materials.SkyBoxMaterial;
	import away3d.materials.TextureMaterial;
	import away3d.primitives.CubeGeometry;
	import away3d.primitives.PlaneGeometry;
	import away3d.textures.BitmapCubeTexture;
	import away3d.textures.BitmapTexture;
	import away3d.utils.*;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.TouchEvent;
	import flash.geom.Point;
	import flash.geom.Vector3D;	
	import starling.core.Starling;

	/**
	 * Branching
	 * @author Adrian Higareda
	 */
	
	[Frame(factoryClass="Preloader")]
	public class Main extends Sprite 
	{
		/* Textures */
		[Embed(source = "/../lib/WallTexture.jpg")] 
		private var WallImage:Class;
		
		private var WallMaterial:TextureMaterial;

		public static var Away3dView:View3D;
		private var _starlingBg:Starling;
		private var _starlingFg:Starling;
		
		private var _stage3DManager:Stage3DManager; 
		private var _stage3DProxy:Stage3DProxy;
		
		/* Settings */
		private var _antiAlias:Number = 1;
		
		private var _cube:Mesh;
		private var _light:DirectionalLight;
		private var _camera:Camera3D;
		private var _cameraController:HoverController;
		
		/* Functional vars */
		private var _data:Object;
		
		private var LetsRestart:Boolean = false;

		public function Main():void 
		{
			if (stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init);
		}

		private function init(e:Event = null):void 
		{
			removeEventListener(Event.ADDED_TO_STAGE, init);
			// entry point
			
			_data = new Object();
			
			InitProxies();
		}
		
		private function InitProxies():void
		{
			// Define a new Stage3DManager for the Stage3D objects 
			_stage3DManager = Stage3DManager.getInstance(stage); 
			
			// Create a new Stage3D proxy to contain the separate views 
			_stage3DProxy = _stage3DManager.getFreeStage3DProxy(); 
			_stage3DProxy.addEventListener(Stage3DEvent.CONTEXT3D_CREATED, OnContextCreated); 
			_stage3DProxy.antiAlias = 8; 
			_stage3DProxy.color = 0x45ABFF;
		}
		
		private function OnContextCreated(event:Stage3DEvent):void
		{
			InitAway3D();
			InitStarling();
			InitListeners();
		}
		
		private function InitStarling():void
		{
			// Setup starling
			_starlingBg = new Starling(Background, stage, _stage3DProxy.viewPort, _stage3DProxy.stage3D);
			_starlingBg.start();
			_starlingFg = new Starling(Foreground, stage, _stage3DProxy.viewPort, _stage3DProxy.stage3D);
			_starlingFg.start();
		}
		
		private function InitAway3D():void
		{
			// Setup camera
			_camera = new Camera3D();
			_camera.lens.far = 10000;
			
			// Setup view
			Away3dView = new View3D();
			Away3dView.backgroundColor = 0x000000;
			Away3dView.camera = _camera;
			Away3dView.antiAlias = _antiAlias;
			Away3dView.stage3DProxy = _stage3DProxy; 
			Away3dView.shareContext = true; 
			this.addChild(Away3dView); 
			
			// Setup HoverController
			_cameraController = new HoverController(_camera, null, 0, 0, -950);
			
			// Add cube
			_light = new DirectionalLight(0,-1,1);
			_light.ambient = 0.3;
			_light.diffuse = 0.6;
			_light.specular = 0.3;
			
			WallMaterial = new TextureMaterial(Cast.bitmapTexture(WallImage));
			WallMaterial.repeat = true;
			WallMaterial.animateUVs = true;
			WallMaterial.lightPicker = new StaticLightPicker([_light]);
			
			var geometry:CubeGeometry = new CubeGeometry(500, 1300, 500);
			_cube = new Mesh(geometry, WallMaterial);
			_cube.y = 350;
			_cube.geometry.scaleUV(3, 4);
			_cube.name = "cube";
			Away3dView.scene.addChild(_cube);
			
			_cube.subMeshes[0].offsetV = 1;		
		}
		
		private function InitListeners():void
		{
			// Setup event listeners
			stage.addEventListener(MouseEvent.MOUSE_DOWN, OnMouseDownHandler);
			stage.addEventListener(MouseEvent.MOUSE_UP, OnMouseUpHandler);
			
			addEventListener(Event.ENTER_FRAME, OnEnterFrame);
		}
		
		private function OnMouseDownHandler(event:MouseEvent):void
		{
			_data.panAngle = _cameraController.panAngle;
			_data.tiltAngle = _cameraController.tiltAngle;
			_data.mouseX = stage.mouseX;
			_data.mouseY = stage.mouseY;
			_data.move = true;
			
			stage.addEventListener(Event.MOUSE_LEAVE, OnStageMouseLeave);
		}

		private function OnMouseUpHandler(event:MouseEvent):void
		{
			_data.move = false;
			stage.removeEventListener(Event.MOUSE_LEAVE, OnStageMouseLeave);
		}

		private function OnStageMouseLeave(event:Event):void
		{
			_data.move = false;
			stage.removeEventListener(Event.MOUSE_LEAVE, OnStageMouseLeave);
		}
		
		private function OnEnterFrame(event:Event):void
		{
			_stage3DProxy.clear();
			
			/* Starling background */
			_starlingBg.nextFrame();			
			
			/* Starling foreground */
			var fg:Foreground = Foreground.GetInstance();
			if (fg != null)
			{
				// Rotate controller when mouse is down
				if (_data.move)
				{
					if(!fg.branching)
						_cube.rotationY -= 0.01 * (stage.mouseX - _data.mouseX) + _data.panAngle;
				}
				else
				{
					//_cameraController.panAngle += .1;
				}
				
				_light.x = _camera.x;
				_light.y = _camera.y;
				_light.z = _camera.z;
				
				if (fg.GameOn)
				{
					fg.UpdateHUD();
					fg.Update(_cube.rotationY);
				}
				else
					fg.waitStart(_cube.rotationY);
					
				if (fg.moveWorld > 0)
				{
					if (!fg.intro)
						_cube.subMeshes[0].offsetV -= fg.moveWorld / 640;
					else
					{
						_cube.y -= fg.moveWorld;
						if (_cube.y < 0)
							fg.intro = false;
					}
				}
				var bg:Background = Background.GetInstance();
				bg.rotatingWorld(_cube.rotationY);
				bg.MovingUp(fg.moveWorld);
				fg.moveWorld = 0;
				if (fg.RestartMe)
					LetsRestart = true;
			}
			
			Away3dView.render();
			
			_starlingFg.nextFrame();
			
			_stage3DProxy.present();
			if (LetsRestart)
				RestartGame();
		}
			
		public static function GetVerticeWorldPosition(mesh:Mesh, vtxIndex:uint, subgIndex:uint = 0, PosX:Number = 0, PosY:Number = 0, WorldPlane:int = 0):Vector3D
		{
			var iData:Vector.<uint> = mesh.geometry.subGeometries[subgIndex].indexData;
			var vData:Vector.<Number> = mesh.geometry.subGeometries[subgIndex].vertexData;
			var vtx:Vector3D = new Vector3D(vData[iData[vtxIndex] * 3], vData[iData[vtxIndex] * 3 + 1], vData[iData[vtxIndex] * 3 + 2]);
			switch(WorldPlane)
			{
				case 0:
					vtx.x += PosX;
					vtx.y += PosY;
					break
				case 1:
					vtx.z += PosX;
					vtx.x = 250;
					vtx.y += PosY;
					break;
				case 2:
					vtx.z += 500;
					vtx.x += 500-PosX;
					vtx.y += PosY;
					break;
				case 3:
					vtx.z += 500-PosX;
					vtx.x = -250;
					vtx.y += PosY;
					break;
				default:
					break;
			}
			vtx = mesh.sceneTransform.transformVector(vtx);
			return vtx;
		}
		
		private function RestartGame():void
		{
			_starlingBg.stop();
			_starlingBg.dispose();
			_starlingBg = null;
			_starlingBg = new Starling(Background, stage, _stage3DProxy.viewPort, _stage3DProxy.stage3D);
			_starlingBg.start();
			_starlingFg.stop();
			_starlingFg.dispose();
			_starlingFg = null;
			_starlingFg = new Starling(Foreground, stage, _stage3DProxy.viewPort, _stage3DProxy.stage3D);
			_starlingFg.start();
			_cube.y = 350;
			_cube.rotationY = 0;
			_cube.subMeshes[0].offsetV = 1;
			LetsRestart = false;
		}
	}

}