package away3d.primitives
{

	import away3d.animators.IAnimator;
	import away3d.arcane;
	import away3d.bounds.NullBounds;
	import away3d.cameras.Camera3D;
	import away3d.core.base.IRenderable;
	import away3d.core.base.SubGeometry;
	import away3d.core.managers.Stage3DProxy;
	import away3d.core.partition.EntityNode;
	import away3d.core.partition.SkyBoxNode;
	import away3d.entities.Entity;
	import away3d.errors.AbstractMethodError;
	import away3d.materials.MaterialBase;
	import away3d.materials.SkyBoxMaterial;
	import away3d.textures.CubeTextureBase;

	import flash.display3D.IndexBuffer3D;
	import flash.geom.Matrix;
	import flash.geom.Matrix3D;

	use namespace arcane;

	/**
	 * A SkyBox class is used to render a sky in the scene. It's always considered static and 'at infinity', and as
	 * such it's always centered at the camera's position and sized to exactly fit within the camera's frustum, ensuring
	 * the sky box is always as large as possible without being clipped.
	 */
	public class SkyBox extends Entity implements IRenderable
	{
		// todo: remove SubGeometry, use a simple single buffer with offsets
		private var _geometry : SubGeometry;
		private var _material : SkyBoxMaterial;
		private var _uvTransform : Matrix = new Matrix();
		private var _animator : IAnimator;

		public function get animator() : IAnimator
		{
			return _animator;
		}

		/**
		 * Create a new SkyBox object.
		 * @param cubeMap The CubeMap to use for the sky box's texture.
		 */
		public function SkyBox(cubeMap : CubeTextureBase)
		{
			super();
			_material = new SkyBoxMaterial(cubeMap);
			_material.addOwner(this);
			_geometry = new SubGeometry();
			_bounds = new NullBounds();
			buildGeometry(_geometry);
		}

		/**
		 * @inheritDoc
		 */
		public function activateVertexBuffer(index : int, stage3DProxy : Stage3DProxy) : void
		{
			_geometry.activateVertexBuffer(index, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public function activateUVBuffer(index : int, stage3DProxy : Stage3DProxy) : void
		{
		}

		/**
		 * @inheritDoc
		 */
		public function activateVertexNormalBuffer(index : int, stage3DProxy : Stage3DProxy) : void
		{
		}

		/**
		 * @inheritDoc
		 */
		public function activateVertexTangentBuffer(index : int, stage3DProxy : Stage3DProxy) : void
		{
		}

		public function activateSecondaryUVBuffer(index : int, stage3DProxy : Stage3DProxy) : void {}
		public function activateCustomBuffer(index : int, stage3DProxy : Stage3DProxy) : void {}



		/**
		 * @inheritDoc
		 */
		public function getIndexBuffer(stage3DProxy : Stage3DProxy) : IndexBuffer3D
		{
			return _geometry.getIndexBuffer(stage3DProxy);
		}

		/**
		 * The amount of triangles that comprise the SkyBox geometry.
		 */
		public function get numTriangles() : uint
		{
			return _geometry.numTriangles;
		}

		/**
		 * The entity that that initially provided the IRenderable to the render pipeline.
		 */
		public function get sourceEntity() : Entity
		{
			return null;
		}

		/**
		 * The material with which to render the object.
		 */
		public function get material() : MaterialBase
		{
			return _material;
		}

		public function set material(value : MaterialBase) : void
		{
			throw new AbstractMethodError("Unsupported method!");
		}

		/**
		 * @inheritDoc
		 */
		override public function pushModelViewProjection(camera : Camera3D, updateZIndex : Boolean = true) : void
		{
			var size : Number = camera.lens.far / Math.sqrt(2) * .5;
			if (++_mvpIndex == _stackLen) {
				_mvpTransformStack[_mvpIndex] = new Matrix3D();
				++_stackLen;
			}

			var mvp : Matrix3D = _mvpTransformStack[_mvpIndex];
			mvp.identity();
			mvp.appendScale(size, size, size);
			mvp.appendTranslation(camera.x, camera.y, camera.z);
			mvp.append(camera.viewProjection);
		}

		/**
		 * @inheritDoc
		 */
		override public function get zIndex() : Number
		{
			return 0;
		}

		/**
		 * @inheritDoc
		 */
		override protected function invalidateBounds() : void
		{
			// dead end
		}

		/**
		 * @inheritDoc
		 */
		override protected function createEntityPartitionNode() : EntityNode
		{
			return new SkyBoxNode(this);
		}

		/**
		 * @inheritDoc
		 */
		override protected function updateBounds() : void
		{
			_boundsInvalid = false;
		}

		/**
		 * Builds the geometry that forms the SkyBox
		 */
		private function buildGeometry(target : SubGeometry) : void
		{
			var vertices : Vector.<Number>;
			var indices : Vector.<uint>;

			vertices = new Vector.<Number>();
			indices = new Vector.<uint>();

			vertices.push(-1, 1, -1);	// top left near
			vertices.push(1, 1, -1);		// top right near
			vertices.push(1, 1, 1);		// top right far
			vertices.push(-1, 1, 1);		// top left far
			vertices.push(-1, -1, -1);	// bottom left near
			vertices.push(1, -1, -1);	// bottom right near
			vertices.push(1, -1, 1);		// bottom right far
			vertices.push(-1, -1, 1);	// bottom left far
			vertices.fixed = true;

			// top
			indices.push(0, 1, 2);
			indices.push(2, 3, 0);
			// bottom
			indices.push(6, 5, 4);
			indices.push(4, 7, 6);
			// far
			indices.push(2, 6, 7);
			indices.push(7, 3, 2);
			// near
			indices.push(4, 5, 1);
			indices.push(1, 0, 4);
			// left
			indices.push(4, 0, 3);
			indices.push(3, 7, 4);
			// right
			indices.push(2, 1, 5);
			indices.push(5, 6, 2);

			target.updateVertexData(vertices);
			target.updateIndexData(indices);
		}

		public function get castsShadows() : Boolean
		{
			return false;
		}

		public function get uvTransform() : Matrix
		{
			return _uvTransform;
		}

		public function get vertexData() : Vector.<Number>
		{
			return _geometry.vertexData;
		}

		public function get indexData() : Vector.<uint>
		{
			return _geometry.indexData;
		}

		public function get UVData() : Vector.<Number>
		{
			return _geometry.UVData;
		}

		public function get numVertices() : uint
		{
			return _geometry.numVertices;
		}

		public function get vertexStride() : uint
		{
			return _geometry.vertexStride;
		}

		public function get vertexNormalData() : Vector.<Number>
		{
			return _geometry.vertexNormalData;
		}

		public function get vertexTangentData() : Vector.<Number>
		{
			return _geometry.vertexTangentData;
		}

		public function get vertexOffset() : int
		{
			return _geometry.vertexOffset;
		}

		public function get vertexNormalOffset() : int
		{
			return _geometry.vertexNormalOffset;
		}

		public function get vertexTangentOffset() : int
		{
			return _geometry.vertexTangentOffset;
		}
	}
}
