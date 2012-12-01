package away3d.materials.methods
{
	import away3d.arcane;
	import away3d.core.managers.Stage3DProxy;
	import away3d.materials.compilation.ShaderRegisterCache;
	import away3d.materials.compilation.ShaderRegisterElement;
	import away3d.textures.Texture2DBase;
	
	import flash.display3D.Context3DProgramType;

	use namespace arcane;

	/**
	 * WrapDiffuseMethod is an alternative to BasicDiffuseMethod in which the light is allowed to be "wrapped around" the normally dark area, to some extent.
	 * It can be used as a crude approximation to Oren-Nayar or subsurface scattering.
	 */
	public class WrapDiffuseMethod extends BasicDiffuseMethod
	{
		private var _wrapDataRegister : ShaderRegisterElement;
		private var _scatterTextureRegister : ShaderRegisterElement;
		private var _scatterTexture : Texture2DBase;
		private var _wrapFactor : Number;

		/**
		 * Creates a new WrapDiffuseMethod object.
		 * @param wrap A factor to indicate the amount by which the light is allowed to wrap
		 * @param scatterTexture A texture that contains the light colour based on the angle. This can be used to change the light colour due to subsurface scattering when dot &lt; 0
		 */
		public function WrapDiffuseMethod(wrapFactor : Number = .5, scatterTexture : Texture2DBase = null)
		{
			super();
			this.wrapFactor = wrapFactor;
			this.scatterTexture = scatterTexture;
		}


		override arcane function initConstants(vo : MethodVO) : void
		{
			super.initConstants(vo);
			vo.fragmentData[vo.secondaryFragmentConstantsIndex+2] = .5;
		}

		public function get scatterTexture() : Texture2DBase
		{
			return _scatterTexture;
		}

		public function set scatterTexture(value : Texture2DBase) : void
		{
			if (Boolean(_scatterTexture) != Boolean(value) ||
				(value && _scatterTexture && (value.hasMipMaps != _scatterTexture.hasMipMaps || value.format != _scatterTexture.format)))
				invalidateShaderProgram();
			_scatterTexture = value;
		}

		arcane override function cleanCompilationData() : void
		{
			super.cleanCompilationData();
			_wrapDataRegister = null;
			_scatterTextureRegister = null;
		}

		public function get wrapFactor() : Number
		{
			return _wrapFactor
		}

		public function set wrapFactor(value : Number) : void
		{
			_wrapFactor = value;
			_wrapFactor = 1/(value+1);
		}

		arcane override function getFragmentPreLightingCode(vo : MethodVO, regCache : ShaderRegisterCache) : String
		{
			var code : String = super.getFragmentPreLightingCode(vo, regCache);
			_isFirstLight = true;
			_wrapDataRegister = regCache.getFreeFragmentConstant();
			vo.secondaryFragmentConstantsIndex = _wrapDataRegister.index*4;

			if (_scatterTexture) {
				_scatterTextureRegister = regCache.getFreeTextureReg();
				vo.secondaryTexturesIndex = _scatterTextureRegister.index;
			}
			return code;
		}

		arcane override function getFragmentCodePerLight(vo : MethodVO, lightDirReg : ShaderRegisterElement, lightColReg : ShaderRegisterElement, regCache : ShaderRegisterCache) : String
		{
			var code : String = "";
			var t : ShaderRegisterElement;

			// write in temporary if not first light, so we can add to total diffuse colour
			if (_isFirstLight)
				t = _totalLightColorReg;
			else {
				t = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(t, 1);
			}

			code += "dp3 " + t + ".x, " + lightDirReg + ".xyz, " + _sharedRegisters.normalFragment + ".xyz\n" +
					"add " + t + ".y, " + t + ".x, " + _wrapDataRegister + ".x\n" +
					"mul " + t + ".y, " + t + ".y, " + _wrapDataRegister + ".y\n" +
					"sat " + t + ".w, " + t + ".y\n" +
					"mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

			if (_modulateMethod != null) code += _modulateMethod(vo, t, regCache, _sharedRegisters);

			if (_scatterTexture) {
				code += "mul " + t + ".x, " + t + ".w, " + _wrapDataRegister + ".z\n" +
						"add " + t + ".x, " + t + ".x, " + t + ".x\n" +
						getTex2DSampleCode(vo, t, _scatterTextureRegister, _scatterTexture, t, "clamp") +
						"mul " + t + ".xyz, " + t + ".xyz, " + t + ".w\n" +
						"mul " + t + ".xyz, " + t + ".xyz, " + lightColReg + ".xyz\n";

			}
			else {
				code += "mul " + t + ", " + t + ".w, " + lightColReg + "\n";
			}


			if (!_isFirstLight) {
				code += "add " + _totalLightColorReg + ".xyz, " + _totalLightColorReg + ".xyz, " + t + ".xyz\n";
				regCache.removeFragmentTempUsage(t);
			}

			_isFirstLight = false;

			return code;
		}


		arcane override function activate(vo : MethodVO, stage3DProxy : Stage3DProxy) : void
		{
			super.activate(vo, stage3DProxy);
			var index : int = vo.secondaryFragmentConstantsIndex;
			var data : Vector.<Number> = vo.fragmentData;
			data[index] = _wrapFactor;
			data[index+1] = 1/(_wrapFactor+1);

			if (_scatterTexture)
				stage3DProxy.setTextureAt(vo.secondaryTexturesIndex, _scatterTexture.getTextureForStage3D(stage3DProxy));
		}
	}
}
