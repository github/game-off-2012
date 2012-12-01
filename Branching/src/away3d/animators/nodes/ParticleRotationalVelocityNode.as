package away3d.animators.nodes
{
	import flash.geom.*;
	
	import away3d.*;
	import away3d.animators.*;
	import away3d.animators.data.*;
	import away3d.animators.states.*;
	import away3d.materials.compilation.*;
	import away3d.materials.passes.*;
	
	use namespace arcane;
	
	/**
	 * A particle animation node used to set the starting rotational velocity of a particle.
	 */
	public class ParticleRotationalVelocityNode extends ParticleNodeBase
	{
		/** @private */
		arcane static const ROTATIONALVELOCITY_INDEX:uint = 0;
		
		/** @private */
		arcane var _rotationalVelocity:Vector3D;
		
		/**
		 * Reference for rotational velocity node properties on a single particle (when in local property mode).
		 * Expects a <code>Vector3D</code> object representing the rotational velocity around an axis of the particle.
		 */
		public static const ROTATIONALVELOCITY_VECTOR3D:String = "RotationalVelocityVector3D";
		
		/**
		 * Creates a new <code>ParticleRotationalVelocityNode</code>
		 *
		 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
		 */
		public function ParticleRotationalVelocityNode(mode:uint, rotationalVelocity:Vector3D = null)
		{
			_stateClass = ParticleRotationalVelocityState;
			
			super("ParticleRotationalVelocity", mode, 4);
			
			_rotationalVelocity = rotationalVelocity || new Vector3D();
		}
		
		/**
		 * @inheritDoc
		 */
		override public function getAGALVertexCode(pass:MaterialPassBase, animationRegisterCache:AnimationRegisterCache) : String
		{
			var rotationRegister:ShaderRegisterElement = (_mode == ParticlePropertiesMode.GLOBAL)? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
			animationRegisterCache.setRegisterIndex(this, ROTATIONALVELOCITY_INDEX, rotationRegister.index);
			
			var nrmVel:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
			animationRegisterCache.addVertexTempUsages(nrmVel, 1);
			
			var xAxis:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
			animationRegisterCache.addVertexTempUsages(xAxis, 1);
			
			
			var temp:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
			animationRegisterCache.addVertexTempUsages(temp, 1);
			var R:ShaderRegisterElement = new ShaderRegisterElement(temp.regName, temp.index, "xyz");
			var R_rev:ShaderRegisterElement = animationRegisterCache.getFreeVertexVectorTemp();
			R_rev = new ShaderRegisterElement(R_rev.regName, R_rev.index, "xyz");
			
			var cos:ShaderRegisterElement = new ShaderRegisterElement(R.regName, R.index, "w");
			var sin:ShaderRegisterElement = new ShaderRegisterElement(R_rev.regName, R_rev.index, "w");
			
			animationRegisterCache.removeVertexTempUsage(nrmVel);
			animationRegisterCache.removeVertexTempUsage(xAxis);
			animationRegisterCache.removeVertexTempUsage(temp);
			
			var code:String = "";
			code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
			code += "mov " + nrmVel + ".w," + animationRegisterCache.vertexZeroConst + "\n";
			
			code += "mul " + cos + "," + animationRegisterCache.vertexTime + "," + rotationRegister + ".w\n";
			
			code += "sin " + sin + "," + cos + "\n";
			code += "cos " + cos + "," + cos + "\n";
			
			code += "mul " + R + "," + sin +"," + nrmVel + ".xyz\n";
			
			code += "mul " + R_rev + "," + sin + "," + nrmVel + ".xyz\n";
			code += "neg " + R_rev + "," + R_rev + "\n";
			
			//nrmVel and xAxis are used as temp register
			code += "crs " + nrmVel + ".xyz," + R + ".xyz," +animationRegisterCache.scaleAndRotateTarget + ".xyz\n";

			code += "mul " + xAxis + ".xyz," + cos +"," + animationRegisterCache.scaleAndRotateTarget + "\n";
			code += "add " + nrmVel + ".xyz," + nrmVel +".xyz," + xAxis + ".xyz\n";
			code += "dp3 " + xAxis + ".w," + R + "," +animationRegisterCache.scaleAndRotateTarget + "\n";
			code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
			
			
			code += "crs " + R + "," + nrmVel + ".xyz," +R_rev + "\n";

			//use cos as R_rev.w
			code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," +cos + "\n";
			code += "add " + R + "," + R + "," + xAxis + ".xyz\n";
			code += "mul " + xAxis + ".xyz," + nrmVel + ".w," +R_rev + "\n";
			
			code += "add " + animationRegisterCache.scaleAndRotateTarget + "," + R + "," + xAxis + ".xyz\n";
			
			var len:int = animationRegisterCache.rotationRegisters.length;
			for (var i:int = 0; i < len; i++)
			{
				code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
				code += "mov " + nrmVel + ".w," + animationRegisterCache.vertexZeroConst + "\n";
				code += "mul " + cos + "," + animationRegisterCache.vertexTime + "," + rotationRegister + ".w\n";
				code += "sin " + sin + "," + cos + "\n";
				code += "cos " + cos + "," + cos + "\n";
				code += "mul " + R + "," + sin +"," + nrmVel + ".xyz\n";
				code += "mul " + R_rev + "," + sin + "," + nrmVel + ".xyz\n";
				code += "neg " + R_rev + "," + R_rev + "\n";
				code += "crs " + nrmVel + ".xyz," + R + ".xyz," +animationRegisterCache.rotationRegisters[i] + ".xyz\n";
				code += "mul " + xAxis + ".xyz," + cos +"," + animationRegisterCache.rotationRegisters[i] + "\n";
				code += "add " + nrmVel + ".xyz," + nrmVel +".xyz," + xAxis + ".xyz\n";
				code += "dp3 " + xAxis + ".w," + R + "," +animationRegisterCache.rotationRegisters[i] + "\n";
				code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
				code += "crs " + R + "," + nrmVel + ".xyz," +R_rev + "\n";
				code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," +cos + "\n";
				code += "add " + R + "," + R + "," + xAxis + ".xyz\n";
				code += "mul " + xAxis + ".xyz," + nrmVel + ".w," +R_rev + "\n";
				code += "add " + animationRegisterCache.rotationRegisters[i] + "," + R + "," + xAxis + ".xyz\n";
			}
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public function getAnimationState(animator:IAnimator):ParticleRotationalVelocityState
		{
			return animator.getAnimationState(this) as ParticleRotationalVelocityState;
		}
		
		/**
		 * @inheritDoc
		 */
		override arcane function generatePropertyOfOneParticle(param:ParticleProperties):void
		{
			//(Vector3d.x,Vector3d.y,Vector3d.z) is rotation axis,Vector3d.w is cycle duration
			var rotate:Vector3D = param[ROTATIONALVELOCITY_VECTOR3D];
			if (!rotate)
				throw(new Error("there is no " + ROTATIONALVELOCITY_VECTOR3D + " in param!"));
			
			_oneData[0] = rotate.x;
			_oneData[1] = rotate.y;
			_oneData[2] = rotate.z;
			if (rotate.w <= 0)
				throw(new Error("the cycle duration must greater than zero"));
			// it's used as angle/2 in agal
			_oneData[3] = Math.PI / rotate.w;
		}
	}
}