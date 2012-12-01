package away3d.core.partition
{
	import away3d.arcane;
	import away3d.cameras.Camera3D;
	import away3d.core.traverse.PartitionTraverser;
	import away3d.entities.Entity;
	import away3d.primitives.WireframePrimitiveBase;

	use namespace arcane;

	/**
	 * The NodeBase class is an abstract base class for any type of space partition tree node. The concrete
	 * subtype will control the creation of its child nodes, which are necessarily of the same type. The exception is
	 * the creation of leaf entity nodes, which is handled by the Partition3D class.
	 *
	 * @see away3d.partition.EntityNode
	 * @see away3d.partition.Partition3D
	 * @see away3d.containers.Scene3D
	 */
	public class NodeBase
	{
		arcane var _parent : NodeBase;
		protected var _childNodes : Vector.<NodeBase>;
		protected var _numChildNodes : uint;
		protected var _debugPrimitive : WireframePrimitiveBase;

		arcane var _numEntities : int;
		arcane var _collectionMark : uint;

		/**
		 * Creates a new NodeBase object.
		 */
		public function NodeBase()
		{
			_childNodes = new Vector.<NodeBase>();
		}

		public function get showDebugBounds() : Boolean
		{
			return _debugPrimitive != null;
		}

		public function set showDebugBounds(value : Boolean) : void
		{
			if (Boolean(_debugPrimitive) == value) return;

			if (value) {
				_debugPrimitive = createDebugBounds();
			}
			else {
				_debugPrimitive.dispose();
				_debugPrimitive = null;
			}

			for (var i : uint = 0; i < _numChildNodes; ++i)  {
				_childNodes[i].showDebugBounds = value;
			}
		}

		/**
		 * The parent node. Null if this node is the root.
		 */
		public function get parent() : NodeBase
		{
			return _parent;
		}

		/**
		 * Adds a node to the tree. By default, this is used for both static as dynamic nodes, but for some data
		 * structures such as BSP trees, it can be more efficient to only use this for dynamic nodes, and add the
		 * static child nodes using custom links.
		 *
		 * @param node The node to be added as a child of the current node.
		 */
		arcane function addNode(node : NodeBase) : void
		{
			node._parent = this;
			_numEntities += node._numEntities;
			_childNodes[_numChildNodes++] = node;
			node.showDebugBounds = _debugPrimitive != null;

			// update numEntities in the tree
			var numEntities : int = node._numEntities;
			node = this;

			do {
				node._numEntities += numEntities;
			} while ((node = node._parent));
		}

		/**
		 * Removes a child node from the tree.
		 * @param node The child node to be removed.
		 */
		arcane function removeNode(node : NodeBase) : void
		{
			// a bit faster than splice(i, 1), works only if order is not important
			// override item to be removed with the last in the list, then remove that last one
			// Also, the "real partition nodes" of the tree will always remain unmoved, first in the list, so if there's
			// an order dependency for them, it's still okay
			var index : uint = _childNodes.indexOf(node);
			_childNodes[index] = _childNodes[--_numChildNodes];
			_childNodes.pop();

			// update numEntities in the tree
			var numEntities : int = node._numEntities;
			node = this;

			do {
				node._numEntities -= numEntities;
			} while ((node = node._parent));
		}

		/**
		 * Tests if the current node is at least partly inside the frustum.
		 * @param viewProjectionRaw The raw data of the view projection matrix
		 *
		 * @return Whether or not the node is at least partly inside the view frustum.
		 */
		public function isInFrustum(camera : Camera3D) : Boolean
		{
			var inFrustum : Boolean = isInFrustumImpl(camera);
			if (inFrustum && _debugPrimitive)
				_debugPrimitive.pushModelViewProjection(camera);
			return inFrustum;
		}

		protected function isInFrustumImpl(camera : Camera3D) : Boolean
		{
			return true;
		}

		/**
		 * Finds the partition that contains (or should contain) the given entity.
		 */
		public function findPartitionForEntity(entity : Entity) : NodeBase
		{
			return this;
		}

		/**
		 * Allows the traverser to visit the current node. If the traverser's enterNode method returns true, the
		 * traverser will be sent down the child nodes of the tree.
		 * This method should be overridden if the order of traversal is important (such as for BSP trees) - or if static
		 * child nodes are not added using addNode, but are linked to separately.
		 *
		 * @param traverser The traverser visiting the node.
		 *
		 * @see away3d.core.traverse.PartitionTraverser
		 */
		public function acceptTraverser(traverser : PartitionTraverser) : void
		{
			if (_numEntities == 0 && !_debugPrimitive) return;

			if (traverser.enterNode(this)) {
				var i : uint;
				while (i < _numChildNodes) _childNodes[i++].acceptTraverser(traverser);

				if (_debugPrimitive)
					traverser.applyRenderable(_debugPrimitive);
			}
		}

		protected function createDebugBounds() : WireframePrimitiveBase
		{
			return null;
		}

		protected function get numEntities() : int
		{
			return _numEntities;
		}

		protected function updateNumEntities(value : int) : void
		{
			var diff : int = value - _numEntities;
			var node : NodeBase = this;

			do {
				node._numEntities += diff;
			} while ((node = node._parent));
		}
	}
}