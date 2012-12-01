package away3d.core.base
{

	import away3d.animators.data.AnimationSubGeometry;
	import away3d.animators.IAnimator;
	import away3d.arcane;
	import away3d.bounds.BoundingVolumeBase;
	import away3d.core.managers.Stage3DProxy;
	import away3d.entities.Entity;
	import away3d.entities.Mesh;
	import away3d.materials.MaterialBase;

	import flash.display3D.IndexBuffer3D;
	import flash.display3D.VertexBuffer3D;
	import flash.geom.Matrix;
	import flash.geom.Matrix3D;

	use namespace arcane;

	/**
	 * SubMesh wraps a SubGeometry as a scene graph instantiation. A SubMesh is owned by a Mesh object.
	 *
	 * @see away3d.core.base.SubGeometry
	 * @see away3d.scenegraph.Mesh
	 */
	public class SubMesh implements IRenderable
	{
		arcane var _material : MaterialBase;
		private var _parentMesh : Mesh;
		private var _subGeometry : ISubGeometry;
		arcane var _index : uint;
		private var _uvTransform : Matrix;
		private var _uvTransformDirty : Boolean;
		private var _uvRotation : Number = 0;
		private var _scaleU : Number = 1;
		private var _scaleV : Number = 1;
		private var _offsetU : Number = 0;
		private var _offsetV : Number = 0;
		
		public var animationSubGeometry : AnimationSubGeometry;
		
		public var animatorSubGeometry : AnimationSubGeometry;
		
		/**
		 * Creates a new SubMesh object
		 * @param subGeometry The SubGeometry object which provides the geometry data for this SubMesh.
		 * @param parentMesh The Mesh object to which this SubMesh belongs.
		 * @param material An optional material used to render this SubMesh.
		 */
		public function SubMesh(subGeometry : ISubGeometry, parentMesh : Mesh, material : MaterialBase = null)
		{
			_parentMesh = parentMesh;
			_subGeometry = subGeometry;
			this.material = material;
		}

		public function get shaderPickingDetails() : Boolean
		{
			return sourceEntity.shaderPickingDetails;
		}

		public function get offsetU() : Number
		{
			return _offsetU;
		}

		public function set offsetU(value : Number) : void
		{
			if (value == _offsetU) return;
			_offsetU = value;
			_uvTransformDirty = true;
		}

		public function get offsetV() : Number
		{
			return _offsetV;
		}

		public function set offsetV(value : Number) : void
		{
			if (value == _offsetV) return;
			_offsetV = value;
			_uvTransformDirty = true;
		}

		public function get scaleU() : Number
		{
			return _scaleU;
		}

		public function set scaleU(value : Number) : void
		{
			if (value == _scaleU) return;
			_scaleU = value;
			_uvTransformDirty = true;
		}

		public function get scaleV() : Number
		{
			return _scaleV;
		}

		public function set scaleV(value : Number) : void
		{
			if (value == _scaleV) return;
			_scaleV = value;
			_uvTransformDirty = true;
		}

		public function get uvRotation() : Number
		{
			return _uvRotation;
		}

		public function set uvRotation(value : Number) : void
		{
			if (value == _uvRotation) return;
			_uvRotation = value;
			_uvTransformDirty = true;
		}

		/**
		 * The entity that that initially provided the IRenderable to the render pipeline (ie: the owning Mesh object).
		 */
		public function get sourceEntity() : Entity
		{
			return _parentMesh;
		}

		/**
		 * The SubGeometry object which provides the geometry data for this SubMesh.
		 */
		public function get subGeometry() : ISubGeometry
		{
			return _subGeometry;
		}

		public function set subGeometry(value : ISubGeometry) : void
		{
			_subGeometry = value;
		}

		/**
		 * The material used to render the current SubMesh. If set to null, its parent Mesh's material will be used instead.
		 */
		public function get material() : MaterialBase
		{
			return _material || _parentMesh.material;
		}

		public function set material(value : MaterialBase) : void
		{
			if (_material) _material.removeOwner(this);

			_material = value;

			if (_material) _material.addOwner(this);
		}

		/**
		 * The distance of the SubMesh object to the view, used to sort per object.
		 */
		public function get zIndex() : Number
		{
			return _parentMesh.zIndex;
		}

		/**
		 * The scene transform object that transforms from model to world space.
		 */
		public function get sceneTransform() : Matrix3D
		{
			return _parentMesh.sceneTransform;
		}

		/**
		 * The inverse scene transform object that transforms from world to model space.
		 */
		public function get inverseSceneTransform() : Matrix3D
		{
			return _parentMesh.inverseSceneTransform;
		}

		/**
		 * @inheritDoc
		 */
		public function activateVertexBuffer(index : int, stage3DProxy : Stage3DProxy) : void
		{
			_subGeometry.activateVertexBuffer(index, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public function activateVertexNormalBuffer(index : int, stage3DProxy : Stage3DProxy) : void
		{
			_subGeometry.activateVertexNormalBuffer(index, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public function activateVertexTangentBuffer(index : int, stage3DProxy : Stage3DProxy) : void
		{
			_subGeometry.activateVertexTangentBuffer(index, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public function activateUVBuffer(index : int, stage3DProxy : Stage3DProxy) : void
		{
			_subGeometry.activateUVBuffer(index, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public function activateSecondaryUVBuffer(index : int, stage3DProxy : Stage3DProxy) : void
		{
			_subGeometry.activateSecondaryUVBuffer(index, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public function getIndexBuffer(stage3DProxy : Stage3DProxy) : IndexBuffer3D
		{
			return _subGeometry.getIndexBuffer(stage3DProxy);
		}

		/**
		 * The model-view-projection (MVP) matrix used to transform from model to homogeneous projection space.
		 */
		public function get modelViewProjection() : Matrix3D
		{
			return _parentMesh.modelViewProjection;
		}

		/**
		 * The model-view-projection (MVP) matrix used to transform from model to homogeneous projection space.
		 *
		 * @private
		 */
		public function getModelViewProjectionUnsafe() : Matrix3D
		{
			return _parentMesh.getModelViewProjectionUnsafe();
		}

		/**
		 * The amount of triangles that make up this SubMesh.
		 */
		public function get numTriangles() : uint
		{
			return _subGeometry.numTriangles;
		}

		/**
		 * The animator object that provides the state for the SubMesh's animation.
		 */
		public function get animator() : IAnimator
		{
			return _parentMesh.animator;
		}

		/**
		 * Indicates whether the SubMesh should trigger mouse events, and hence should be rendered for hit testing.
		 */
		public function get mouseEnabled() : Boolean
		{
			return _parentMesh.mouseEnabled || _parentMesh._ancestorsAllowMouseEnabled;
		}

		public function get castsShadows() : Boolean
		{
			return _parentMesh.castsShadows;
		}

		/**
		 * A reference to the owning Mesh object
		 *
		 * @private
		 */
		arcane function get parentMesh() : Mesh
		{
			return _parentMesh;
		}

		arcane function set parentMesh(value : Mesh) : void
		{
			_parentMesh = value;
		}

		public function get uvTransform() : Matrix
		{
			if (_uvTransformDirty) updateUVTransform();
			return _uvTransform;
		}

		private function updateUVTransform() : void
		{
			_uvTransform ||= new Matrix();
			_uvTransform.identity();
			if (_uvRotation != 0) _uvTransform.rotate(_uvRotation);
			if (_scaleU != 1 || _scaleV != 1) _uvTransform.scale(_scaleU, _scaleV);
			_uvTransform.translate(_offsetU, _offsetV);
			_uvTransformDirty = false;
		}

		public function dispose() : void
		{
			material = null;
		}

		public function get vertexData() : Vector.<Number>
		{
			return _subGeometry.vertexData;
		}

		public function get indexData() : Vector.<uint>
		{
			return _subGeometry.indexData;
		}

		public function get UVData() : Vector.<Number>
		{
			return _subGeometry.UVData;
		}

		public function get bounds() : BoundingVolumeBase
		{
			return _parentMesh.bounds; // TODO: return smaller, sub mesh bounds instead
		}

		public function get visible() : Boolean
		{
			return _parentMesh.visible;
		}

		public function get numVertices() : uint
		{
			return _subGeometry.numVertices;
		}

		public function get vertexStride() : uint
		{
			return _subGeometry.vertexStride;
		}

		public function get UVStride() : uint
		{
			return _subGeometry.UVStride;
		}

		public function get vertexNormalData() : Vector.<Number>
		{
			return _subGeometry.vertexNormalData;
		}

		public function get vertexTangentData() : Vector.<Number>
		{
			return _subGeometry.vertexTangentData;
		}

		public function get UVOffset() : uint
		{
			return _subGeometry.UVOffset;
		}

		public function get vertexOffset() : uint
		{
			return _subGeometry.vertexOffset;
		}

		public function get vertexNormalOffset() : uint
		{
			return _subGeometry.vertexNormalOffset;
		}

		public function get vertexTangentOffset() : uint
		{
			return _subGeometry.vertexTangentOffset;
		}
	}
}