package away3d.tools.utils
{
	import away3d.arcane;
	import away3d.containers.ObjectContainer3D;
	import away3d.core.base.Geometry;
	import away3d.core.base.ISubGeometry;
	import away3d.core.base.SubGeometry;
	import away3d.entities.Mesh;

	use namespace arcane;
	/**
	 * Class Grid snaps vertexes or meshes according to a given grid unit.<code>Grid</code>
	 */
	public class Grid{
		
		private var _unit:Number;
		private var _objectSpace:Boolean;
		
		/**
		*  Grid snaps vertexes according to a given grid unit
		* @param	 unit						[optional] Number. The grid unit. Default is 1.
		* @param	 objectSpace			[optional] Boolean. Apply only to vertexes in geometry objectspace when Object3D are considered. Default is false.
		*/
		 
		function Grid(unit:Number = 1, objectSpace:Boolean = false):void
		{
			_objectSpace = objectSpace;
			_unit = Math.abs(unit);
		}

		/**
		*  Apply the grid code to a given object3D. If type ObjectContainer3D, all children Mesh vertices will be affected.
		* @param	 object3d		Object3D. The Object3d to snap to grid.
		* @param	 dovert			[optional]. If the vertices must be handled or not. When false only object position is snapped to grid. Default is false.
		*/
		public function snapObject(object3d:ObjectContainer3D, dovert:Boolean = false):void
		{
			parse(object3d, dovert);
		}
		
		/**
		*  Snaps to grid a given Vector.&lt;Number&gt; of vertices
		* @param	 vertices		Vector.&lt;Number&gt;. The vertices vector
		*/		
		public function snapVertices(vertices:Vector.<Number>):Vector.<Number>
		{
			for (var i:uint = 0; i < vertices.length;++i)
					vertices[i] -= vertices[i]%_unit;
				
			return vertices;
		}
		/**
		*  Apply the grid code to a single mesh
		* @param	 mesh		Mesh. The mesh to snap to grid. Vertices are affected by default. Mesh position is snapped if grid.objectSpace is true;
		*/		
		public function snapMesh(mesh:Mesh):void
		{
			if(!_objectSpace){
				mesh.scenePosition.x -= mesh.scenePosition.x%_unit;
				mesh.scenePosition.y -= mesh.scenePosition.y%_unit;
				mesh.scenePosition.z -= mesh.scenePosition.z%_unit;
			}
			snap(mesh);
		}
		
		/**
		* Defines if the grid unit.
		*/
		public function set unit(val:Number):void
		{
			_unit = Math.abs(val);
			_unit = (_unit ==0)? .001 : _unit;
		}
		
		public function get unit():Number
		{
			return _unit;
		}
		
		/**
		* Defines if the grid unit is applied in objectspace or worldspace. In worldspace, objects positions are affected.
		*/
		public function set objectSpace(b:Boolean):void
		{
			_objectSpace = b;
		}
		public function get objectSpace():Boolean
		{
			return _objectSpace;
		}
		
		private function parse(object3d:ObjectContainer3D, dovert:Boolean = true):void
		{
			var child:ObjectContainer3D;
			
			if(!_objectSpace){
				object3d.scenePosition.x -= object3d.scenePosition.x%_unit;
				object3d.scenePosition.y -= object3d.scenePosition.y%_unit;
				object3d.scenePosition.z -= object3d.scenePosition.z%_unit;
			}
				
			if(object3d is Mesh && object3d.numChildren == 0 && dovert)
				snap(Mesh(object3d));
				 
			for(var i:uint = 0;i<object3d.numChildren;++i){
				child = object3d.getChildAt(i);
				parse(child, dovert);
			}
		}
		
		private function snap(mesh:Mesh):void
		{
			var geometry:Geometry = mesh.geometry;
			var geometries:Vector.<ISubGeometry> = geometry.subGeometries;
			var numSubGeoms:int = geometries.length;
			
			var vertices:Vector.<Number>;
			var j : uint;
			var i : uint;
			var vecLength : uint;
			var subGeom:SubGeometry;
			var stride : uint;
			
			for (i = 0; i < numSubGeoms; ++i){
				subGeom = SubGeometry(geometries[i]);
				vertices = subGeom.vertexData;
				vecLength = vertices.length;
				stride = subGeom.vertexStride;

				for (j = subGeom.vertexOffset; j < vecLength; j += stride){
					vertices[j] -= vertices[j]%_unit;
					vertices[j+1] -= vertices[j+1]%_unit;
					vertices[j+2] -= vertices[j+2]%_unit;
				}
				
				subGeom.updateVertexData(vertices);
			}
		}
		 
	}
}