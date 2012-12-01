package away3d.events
{
	import away3d.library.assets.IAsset;

	import flash.events.Event;

	public class AssetEvent extends Event
	{
		public static const ASSET_COMPLETE : String = "assetComplete";
		public static const ENTITY_COMPLETE : String = "entityComplete";
		public static const MESH_COMPLETE : String = "meshComplete";
		public static const GEOMETRY_COMPLETE : String = "geometryComplete";
		public static const SKELETON_COMPLETE : String = "skeletonComplete";
		public static const SKELETON_POSE_COMPLETE : String = "skeletonPoseComplete";
		public static const CONTAINER_COMPLETE : String = "containerComplete";
		public static const TEXTURE_COMPLETE : String = "textureComplete";
		public static const MATERIAL_COMPLETE : String = "materialComplete";
		public static const ANIMATION_SET_COMPLETE : String = "animationSetComplete";
		public static const ANIMATION_STATE_COMPLETE : String = "animationStateComplete";
		public static const ANIMATION_NODE_COMPLETE : String = "animationNodeComplete";
		public static const STATE_TRANSITION_COMPLETE : String = "stateTransitionComplete";
		public static const SEGMENT_SET_COMPLETE : String = "segmentSetComplete";
		
		public static const ASSET_RENAME : String = 'assetRename';
		public static const ASSET_CONFLICT_RESOLVED : String = 'assetConflictResolved';
		
		private var _asset : IAsset;
		private var _prevName : String;
		
		public function AssetEvent(type : String, asset : IAsset = null, prevName : String = null)
		{
			super(type);
			
			_asset = asset;
			_prevName = prevName || (_asset? _asset.name : null);
		}
		
		
		public function get asset() : IAsset
		{
			return _asset;
		}
		
		
		public function get assetPrevName() : String
		{
			return _prevName;
		}
		
		
		public override function clone() : Event
		{
			return new AssetEvent(type, asset, assetPrevName);
		}
	}
}