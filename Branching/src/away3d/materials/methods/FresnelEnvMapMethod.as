package away3d.materials.methods
{
	import away3d.arcane;
	import away3d.core.managers.Stage3DProxy;
	import away3d.materials.compilation.ShaderRegisterCache;
	import away3d.materials.compilation.ShaderRegisterElement;
	import away3d.textures.CubeTextureBase;
	import away3d.textures.Texture2DBase;

	use namespace arcane;

	public class FresnelEnvMapMethod extends EffectMethodBase
	{
		private var _cubeTexture : CubeTextureBase;
		private var _fresnelPower : Number = 5;
		private var _normalReflectance : Number = 0;
		private var _alpha : Number;
		private var _mask : Texture2DBase;

		public function FresnelEnvMapMethod(envMap : CubeTextureBase, alpha : Number = 1)
		{
			super();
			_cubeTexture = envMap;
			_alpha = alpha;
		}

		override arcane function initVO(vo : MethodVO) : void
		{
			vo.needsNormals = true;
			vo.needsView = true;
			vo.needsUV = _mask != null;
		}

		override arcane function initConstants(vo : MethodVO) : void
		{
			vo.fragmentData[vo.fragmentConstantsIndex+3] = 1;
		}

		public function get mask() : Texture2DBase
		{
			return _mask;
		}

		public function set mask(value : Texture2DBase) : void
		{
			if (Boolean(value) != Boolean(_mask) ||
				(value && _mask && (value.hasMipMaps != _mask.hasMipMaps || value.format != _mask.format)))
				invalidateShaderProgram();
			_mask = value;
		}

		public function get fresnelPower() : Number
		{
			return _fresnelPower;
		}

		public function set fresnelPower(value : Number) : void
		{
			_fresnelPower = value;
		}

		/**
		 * The cube environment map to use for the diffuse lighting.
		 */
		public function get envMap() : CubeTextureBase
		{
			return _cubeTexture;
		}

		public function set envMap(value : CubeTextureBase) : void
		{
			_cubeTexture = value;
		}

		/**
		 * @inheritDoc
		 */
		override public function dispose() : void
		{
		}

		public function get alpha() : Number
		{
			return _alpha;
		}

		public function set alpha(value : Number) : void
		{
			_alpha = value;
		}

		/**
		 * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
		 */
		public function get normalReflectance() : Number
		{
			return _normalReflectance;
		}

		public function set normalReflectance(value : Number) : void
		{
			_normalReflectance = value;
		}

		arcane override function activate(vo : MethodVO, stage3DProxy : Stage3DProxy) : void
		{
			var data : Vector.<Number> = vo.fragmentData;
			var index : int = vo.fragmentConstantsIndex;
			data[index] = _alpha;
			data[index+1] = _normalReflectance;
			data[index+2] = _fresnelPower;
			stage3DProxy.setTextureAt(vo.texturesIndex, _cubeTexture.getTextureForStage3D(stage3DProxy));
			if (_mask)
				stage3DProxy.setTextureAt(vo.texturesIndex+1, _mask.getTextureForStage3D(stage3DProxy));
		}

		arcane override function getFragmentCode(vo : MethodVO, regCache : ShaderRegisterCache, targetReg : ShaderRegisterElement) : String
		{
			var dataRegister : ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var temp : ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			var code : String = "";
			var cubeMapReg : ShaderRegisterElement = regCache.getFreeTextureReg();
			var viewDirReg : ShaderRegisterElement = _sharedRegisters.viewDirFragment;
			var normalReg : ShaderRegisterElement = _sharedRegisters.normalFragment;

			vo.texturesIndex = cubeMapReg.index;
			vo.fragmentConstantsIndex = dataRegister.index*4;

			regCache.addFragmentTempUsages(temp,  1);
			var temp2 : ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();

			// r = V - 2(V.N)*N
			code += "dp3 " + temp + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz		\n" +
					"add " + temp + ".w, " + temp + ".w, " + temp + ".w											\n" +
					"mul " + temp + ".xyz, " + normalReg + ".xyz, " + temp + ".w						\n" +
					"sub " + temp + ".xyz, " + temp + ".xyz, " + viewDirReg + ".xyz					\n" +
					getTexCubeSampleCode(vo, temp, cubeMapReg, _cubeTexture, temp) +
					"sub " + temp2 + ".w, " + temp + ".w, fc0.x									\n" +               	// -.5
					"kil " + temp2 + ".w\n" +	// used for real time reflection mapping - if alpha is not 1 (mock texture) kil output
					"sub " + temp + ", " + temp + ", " + targetReg + "											\n";

			// calculate fresnel term
			code += "dp3 " + viewDirReg+".w, " + viewDirReg+".xyz, " + normalReg+".xyz\n" +   // dot(V, H)
            		"sub " + viewDirReg+".w, " + dataRegister+".w, " + viewDirReg+".w\n" +             // base = 1-dot(V, H)

					"pow " + viewDirReg+".w, " + viewDirReg+".w, " + dataRegister+".z\n" +             // exp = pow(base, 5)

					"sub " + normalReg+".w, " + dataRegister+".w, " + viewDirReg+".w\n" +             // 1 - exp
					"mul " + normalReg+".w, " + dataRegister+".y, " + normalReg+".w\n" +             // f0*(1 - exp)
					"add " + viewDirReg+".w, " + viewDirReg+".w, " + normalReg+".w\n" +          // exp + f0*(1 - exp)

					// total alpha
					"mul " + viewDirReg+".w, " + dataRegister+".x, " + viewDirReg+".w\n";

			if (_mask) {
				var maskReg : ShaderRegisterElement = regCache.getFreeTextureReg();
				code += getTex2DSampleCode(vo, temp2, maskReg, _mask, _sharedRegisters.uvVarying) +
						"mul " + viewDirReg + ".w, " + temp2 + ".x, " + viewDirReg + ".w\n";
			}

					// blend
			code +=	"mul " + temp + ", " + temp + ", " + viewDirReg + ".w						\n" +
					"add " + targetReg + ", " + targetReg+", " + temp + "						\n";

			regCache.removeFragmentTempUsage(temp);

			return code;
		}
	}
}
