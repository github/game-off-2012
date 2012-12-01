﻿package away3d.materials
{
	import away3d.arcane;
	import away3d.cameras.Camera3D;
	import away3d.core.managers.Stage3DProxy;
	import away3d.materials.lightpickers.LightPickerBase;
	import away3d.materials.lightpickers.StaticLightPicker;
	import away3d.materials.methods.BasicAmbientMethod;
	import away3d.materials.methods.BasicDiffuseMethod;
	import away3d.materials.methods.BasicNormalMethod;
	import away3d.materials.methods.BasicSpecularMethod;
	import away3d.materials.methods.EffectMethodBase;
	import away3d.materials.methods.ShadowMapMethodBase;
	import away3d.materials.passes.CompiledPass;
	import away3d.materials.passes.LightingPass;
	import away3d.materials.passes.ShadowCasterPass;
	import away3d.materials.passes.SuperShaderPass;
	import away3d.textures.Texture2DBase;

	import flash.display.BlendMode;

	import flash.display3D.Context3D;
	import flash.display3D.Context3DBlendFactor;
	import flash.display3D.Context3DCompareMode;
	import flash.events.Event;

	use namespace arcane;

	/**
	 * DefaultMaterialBase forms an abstract base class for the default materials provided by Away3D and use methods
	 * to define their appearance.
	 */
	public class MultiPassMaterialBase extends MaterialBase
	{
		protected var _casterLightPass : ShadowCasterPass;
		protected var _nonCasterLightPasses : Vector.<LightingPass>;
		protected var _effectsPass : SuperShaderPass;

		private var _alphaThreshold : Number = 0;
		private var _specularLightSources : uint = 0x01;
		private var _diffuseLightSources : uint = 0x03;

		private var _ambientMethod : BasicAmbientMethod = new BasicAmbientMethod();
		private var _shadowMethod : ShadowMapMethodBase;
		private var _diffuseMethod : BasicDiffuseMethod = new BasicDiffuseMethod();
		private var _normalMethod : BasicNormalMethod = new BasicNormalMethod();
		private var _specularMethod : BasicSpecularMethod = new BasicSpecularMethod();

		private var _screenPassesInvalid : Boolean = true;

		/**
		 * Creates a new DefaultMaterialBase object.
		 */
		public function MultiPassMaterialBase()
		{
			super();
		}

		/**
		 * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
		 * invisible or entirely opaque, often used with textures for foliage, etc.
		 * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
		 */
		public function get alphaThreshold() : Number
		{
			return _alphaThreshold;
		}

		public function set alphaThreshold(value : Number) : void
		{
			_alphaThreshold = value;
			_diffuseMethod.alphaThreshold = value;
			_depthPass.alphaThreshold = value;
			_distancePass.alphaThreshold = value;
		}

		override public function set depthCompareMode(value : String) : void
		{
			super.depthCompareMode = value;
			invalidateScreenPasses();
		}

		override public function set blendMode(value : String) : void
		{
			super.blendMode = value;
			invalidateScreenPasses();
		}

		arcane override function activateForDepth(stage3DProxy : Stage3DProxy, camera : Camera3D, distanceBased : Boolean = false, textureRatioX : Number = 1, textureRatioY : Number = 1) : void
		{
			if (distanceBased)
				_distancePass.alphaMask = _diffuseMethod.texture;
			else
				_depthPass.alphaMask = _diffuseMethod.texture;

			super.activateForDepth(stage3DProxy, camera, distanceBased, textureRatioX, textureRatioY);
		}

		public function get specularLightSources() : uint
		{
			return _specularLightSources;
		}

		public function set specularLightSources(value : uint) : void
		{
			_specularLightSources = value;
		}

		public function get diffuseLightSources() : uint
		{
			return _diffuseLightSources;
		}

		public function set diffuseLightSources(value : uint) : void
		{
			_diffuseLightSources = value;
		}

		override public function set lightPicker(value : LightPickerBase) : void
		{
			if (_lightPicker) _lightPicker.removeEventListener(Event.CHANGE, onLightsChange);
			super.lightPicker = value;
			if (_lightPicker) _lightPicker.addEventListener(Event.CHANGE, onLightsChange);
			invalidateScreenPasses();
		}

		/**
		 * @inheritDoc
		 */
		override public function get requiresBlending() : Boolean
		{
			return false;
		}

		/**
		 * The method to perform ambient shading. Note that shading methods cannot
		 * be reused across materials.
		 */
		public function get ambientMethod() : BasicAmbientMethod
		{
			return _ambientMethod;
		}

		public function set ambientMethod(value : BasicAmbientMethod) : void
		{
			value.copyFrom(_ambientMethod);
			_ambientMethod = value;
			invalidateScreenPasses();
		}

		/**
		 * The method to render shadows cast on this surface. Note that shading methods can not
		 * be reused across materials.
		 */
		public function get shadowMethod() : ShadowMapMethodBase
		{
			return _shadowMethod;
		}

		public function set shadowMethod(value : ShadowMapMethodBase) : void
		{
			if (value && _shadowMethod) value.copyFrom(_shadowMethod);
			_shadowMethod = value;
			invalidateScreenPasses();
		}

		/**
		 * The method to perform diffuse shading. Note that shading methods can not
		 * be reused across materials.
		 */
		public function get diffuseMethod() : BasicDiffuseMethod
		{
			return _diffuseMethod;
		}

		public function set diffuseMethod(value : BasicDiffuseMethod) : void
		{
			value.copyFrom(_diffuseMethod);
			_diffuseMethod = value;
			invalidateScreenPasses();
		}

		/**
		 * The method to generate the (tangent-space) normal. Note that shading methods can not
		 * be reused across materials.
		 */
		public function get normalMethod() : BasicNormalMethod
		{
			return _normalMethod;
		}

		public function set normalMethod(value : BasicNormalMethod) : void
		{
			value.copyFrom(_normalMethod);
			_normalMethod = value;
			invalidateScreenPasses();
		}

		/**
		 * The method to perform specular shading. Note that shading methods can not
		 * be reused across materials.
		 */
		public function get specularMethod() : BasicSpecularMethod
		{
			return _specularMethod;
		}

		public function set specularMethod(value : BasicSpecularMethod) : void
		{
			if (value && _specularMethod) value.copyFrom(_specularMethod);
			_specularMethod = value;
			invalidateScreenPasses();
		}

 		/**
		 * Adds a shading method to the end of the shader. Note that shading methods can
		 * not be reused across materials.
		*/
		public function addMethod(method : EffectMethodBase) : void
		{
			_effectsPass ||= new SuperShaderPass(this);
			_effectsPass.addMethod(method);
			invalidateScreenPasses();
		}

		public function get numMethods() : int
		{
			return _effectsPass? _effectsPass.numMethods : 0;
		}

		public function hasMethod(method : EffectMethodBase) : Boolean
		{
			return _effectsPass? _effectsPass.hasMethod(method) : false;
		}

		public function getMethodAt(index : int) : EffectMethodBase
		{
			return _effectsPass.getMethodAt(index);
		}

		/**
		 * Adds a shading method to the end of a shader, at the specified index amongst
		 * the methods in that section of the shader. Note that shading methods can not
		 * be reused across materials.
		*/
		public function addMethodAt(method : EffectMethodBase, index : int) : void
		{
			_effectsPass ||= new SuperShaderPass(this);
			_effectsPass.addMethodAt(method, index);
			invalidateScreenPasses();
		}

		public function removeMethod(method : EffectMethodBase) : void
		{
			if (_effectsPass) return;
			_effectsPass.removeMethod(method);

			// reconsider
			if (_effectsPass.numMethods == 0)
				invalidateScreenPasses();
		}

		/**
		 * @inheritDoc
		 */
		override public function set mipmap(value : Boolean) : void
		{
			if (_mipmap == value) return;
			super.mipmap = value;
		}

		/**
		 * The tangent space normal map to influence the direction of the surface for each texel.
		 */
		public function get normalMap() : Texture2DBase
		{
			return _normalMethod.normalMap;
		}

		public function set normalMap(value : Texture2DBase) : void
		{
			_normalMethod.normalMap = value;
		}

		/**
		 * A specular map that defines the strength of specular reflections for each texel in the red channel, and the gloss factor in the green channel.
		 * You can use SpecularBitmapTexture if you want to easily set specular and gloss maps from greyscale images, but prepared images are preffered.
		 */
		public function get specularMap() : Texture2DBase
		{
			return _specularMethod.texture;
		}

		public function set specularMap(value : Texture2DBase) : void
		{
			if (_specularMethod) _specularMethod.texture = value;
			else throw new Error("No specular method was set to assign the specularGlossMap to");
		}

		/**
		 * The sharpness of the specular highlight.
		 */
		public function get gloss() : Number
		{
			return _specularMethod? _specularMethod.gloss : 0;
		}

		public function set gloss(value : Number) : void
		{
			if (_specularMethod) _specularMethod.gloss = value;
		}

		/**
		 * The strength of the ambient reflection.
		 */
		public function get ambient() : Number
		{
			return _ambientMethod.ambient;
		}

		public function set ambient(value : Number) : void
		{
			_ambientMethod.ambient = value;
		}

		/**
		 * The overall strength of the specular reflection.
		 */
		public function get specular() : Number
		{
			return _specularMethod? _specularMethod.specular : 0;
		}

		public function set specular(value : Number) : void
		{
			if (_specularMethod) _specularMethod.specular = value;
		}

		/**
		 * The colour of the ambient reflection.
		 */
		public function get ambientColor() : uint
		{
			return _ambientMethod.ambientColor;
		}

		public function set ambientColor(value : uint) : void
		{
			_ambientMethod.ambientColor = value;
		}

		/**
		 * The colour of the specular reflection.
		 */
		public function get specularColor() : uint
		{
			return _specularMethod.specularColor;
		}

		public function set specularColor(value : uint) : void
		{
			_specularMethod.specularColor = value;
		}

		/**
		 * @inheritDoc
		 */
		arcane override function updateMaterial(context : Context3D) : void
		{
			var passesInvalid : Boolean;

			if (_screenPassesInvalid) {
				updateScreenPasses();
				passesInvalid = true;
			}

			if (passesInvalid || isAnyScreenPassInvalid()) {
				clearPasses();

				addChildPassesFor(_casterLightPass);
				if (_nonCasterLightPasses)
					for (var i : int = 0; i < _nonCasterLightPasses.length; ++i)
						addChildPassesFor(_nonCasterLightPasses[i]);
				addChildPassesFor(_effectsPass);

				addScreenPass(_casterLightPass);
				if (_nonCasterLightPasses)
					for (i = 0; i < _nonCasterLightPasses.length; ++i)
						addScreenPass(_nonCasterLightPasses[i]);
				addScreenPass(_effectsPass);
			}
		}

		private function addScreenPass(pass : CompiledPass) : void
		{
			if (pass) {
				addPass(pass);
				pass._passesDirty = false;
			}
		}

		private function isAnyScreenPassInvalid() : Boolean
		{
			if	((_casterLightPass && _casterLightPass._passesDirty) ||
				(_effectsPass && _effectsPass._passesDirty))
				return true;

			if (_nonCasterLightPasses)
				for (var i : int = 0; i < _nonCasterLightPasses.length; ++i)
					if (_nonCasterLightPasses[i]._passesDirty) return true;

			return false;
		}

		private function addChildPassesFor(pass : CompiledPass) : void
		{
			if (!pass) return;

			if (pass._passes) {
				var len : uint = pass._passes.length;
				for (var i : uint = 0; i < len; ++i)
					addPass(pass._passes[i]);
			}
		}

		override arcane function activatePass(index : uint, stage3DProxy : Stage3DProxy, camera : Camera3D, textureRatioX : Number, textureRatioY : Number) : void
		{
			if (index == 0)
				stage3DProxy._context3D.setBlendFactors(Context3DBlendFactor.ONE, Context3DBlendFactor.ZERO);
			super.activatePass(index, stage3DProxy, camera, textureRatioX, textureRatioY);
		}

		override arcane function deactivate(stage3DProxy : Stage3DProxy) : void
		{
			super.deactivate(stage3DProxy);
			stage3DProxy._context3D.setBlendFactors(Context3DBlendFactor.ONE, Context3DBlendFactor.ZERO);
		}

		protected function updateScreenPasses() : void
		{
			initPasses();
			setBlendAndCompareModes();

			_screenPassesInvalid = false;
		}

		private function initPasses() : void
		{
// effects pass will be used to render unshaded diffuse
			if (numLights == 0 || numMethods > 0)
				initEffectsPass();
			else if (_effectsPass && numMethods == 0)
				removeEffectsPass();

			if (_shadowMethod)
				initCasterLightPass();
			else
				removeCasterLightPass();

			if (numNonCasters > 0)
				initNonCasterLightPasses();
			else
				removeNonCasterLightPasses();
		}

		private function setBlendAndCompareModes() : void
		{
			if (_casterLightPass) {
				_casterLightPass.setBlendMode(BlendMode.NORMAL, false);
				_casterLightPass.depthCompareMode = depthCompareMode;
			}

			if (_nonCasterLightPasses) {
				var firstAdditiveIndex : int = 0;
				if (!_casterLightPass) {
					_nonCasterLightPasses[0].setBlendMode(BlendMode.NORMAL, false);
					_nonCasterLightPasses[0].depthCompareMode = depthCompareMode;
					firstAdditiveIndex = 1;
				}
				for (var i : int = firstAdditiveIndex; i < _nonCasterLightPasses.length; ++i) {
					_nonCasterLightPasses[i].setBlendMode(BlendMode.ADD, false);
					_nonCasterLightPasses[i].depthCompareMode = Context3DCompareMode.EQUAL;
				}
			}

			if (_casterLightPass || _nonCasterLightPasses) {
				if (_effectsPass) {
					_effectsPass.depthCompareMode = Context3DCompareMode.EQUAL;
					_effectsPass.setBlendMode(BlendMode.NORMAL, true);
				}
			}
			else if (_effectsPass) {
				_effectsPass.depthCompareMode = depthCompareMode;
				_effectsPass.setBlendMode(BlendMode.NORMAL, false);
			}
		}

		private function initCasterLightPass() : void
		{
			_casterLightPass ||= new ShadowCasterPass(this);
			_casterLightPass.diffuseMethod = null;
			_casterLightPass.ambientMethod = null;
			_casterLightPass.normalMethod = null;
			_casterLightPass.specularMethod = null;
			_casterLightPass.shadowMethod = null;
			_casterLightPass.lightPicker = new StaticLightPicker([_shadowMethod.castingLight]);
			_casterLightPass.shadowMethod = _shadowMethod;
			_casterLightPass.diffuseMethod = _diffuseMethod;
			_casterLightPass.ambientMethod = _ambientMethod;
			_casterLightPass.normalMethod = _normalMethod;
			_casterLightPass.specularMethod = _specularMethod;
			_casterLightPass.diffuseLightSources = _diffuseLightSources;
			_casterLightPass.specularLightSources = _specularLightSources;
		}

		private function removeCasterLightPass() : void
		{
			if (!_casterLightPass) return;
			_casterLightPass.dispose();
			removePass(_casterLightPass);
			_casterLightPass = null;
		}

		private function initNonCasterLightPasses() : void
		{
			removeNonCasterLightPasses();
			var pass : LightingPass;
			var numDirLights : int = _lightPicker.numDirectionalLights;
			var numPointLights : int = _lightPicker.numPointLights;
			var numLightProbes : int = _lightPicker.numLightProbes;
			var dirLightOffset : int = 0;
			var pointLightOffset : int = 0;
			var probeOffset : int = 0;

			if (!_casterLightPass) {
				numDirLights += _lightPicker.numCastingDirectionalLights;
				numPointLights += _lightPicker.numCastingPointLights;
			}

			_nonCasterLightPasses = new Vector.<LightingPass>();
			while (dirLightOffset < numDirLights || pointLightOffset < numPointLights || probeOffset < numLightProbes) {
				pass = new LightingPass(this);
				pass.includeCasters = _shadowMethod == null;
				pass.directionalLightsOffset = dirLightOffset;
				pass.pointLightsOffset = pointLightOffset;
				pass.lightProbesOffset = probeOffset;
				pass.diffuseMethod = null;
				pass.ambientMethod = null;
				pass.normalMethod = null;
				pass.specularMethod = null;
				pass.lightPicker = _lightPicker;
				pass.diffuseMethod = _diffuseMethod;
				pass.ambientMethod = _ambientMethod;
				pass.normalMethod = _normalMethod;
				pass.specularMethod = _specularMethod;
				pass.diffuseLightSources = _diffuseLightSources;
				pass.specularLightSources = _specularLightSources;
				_nonCasterLightPasses.push(pass);

				dirLightOffset += pass.numDirectionalLights;
				pointLightOffset += pass.numPointLights;
				probeOffset += pass.numLightProbes;
			}
		}

		private function removeNonCasterLightPasses() : void
		{
			if (!_nonCasterLightPasses) return;
			for (var i : int = 0; i < _nonCasterLightPasses.length; ++i) {
				removePass(_nonCasterLightPasses[i]);
				_nonCasterLightPasses[i].dispose();
			}
			_nonCasterLightPasses = null;
		}

		private function removeEffectsPass() : void
		{
			if (_effectsPass.diffuseMethod != _diffuseMethod)
				_effectsPass.diffuseMethod.dispose();
			removePass(_effectsPass);
			_effectsPass.dispose();
			_effectsPass = null;
		}

		private function initEffectsPass() : SuperShaderPass
		{
			_effectsPass ||= new SuperShaderPass(this);
			if (numLights == 0) {
				_effectsPass.diffuseMethod = null;
				_effectsPass.diffuseMethod = _diffuseMethod;
			}
			else {
				_effectsPass.diffuseMethod = null;
				_effectsPass.diffuseMethod = new BasicDiffuseMethod();
				_effectsPass.diffuseMethod.diffuseColor = 0x000000;
				_effectsPass.diffuseMethod.diffuseAlpha = 0;
			}
			_effectsPass.preserveAlpha = false;
			_effectsPass.normalMethod = null;
			_effectsPass.normalMethod = _normalMethod;

			return _effectsPass;
		}

		private function get numLights() : int
		{
			return _lightPicker ? 	_lightPicker.numLightProbes + _lightPicker.numDirectionalLights + _lightPicker.numPointLights +
									_lightPicker.numCastingDirectionalLights + _lightPicker.numCastingPointLights : 0;
		}

		private function get numNonCasters() : int
		{
			return _lightPicker? _lightPicker.numLightProbes + _lightPicker.numDirectionalLights + _lightPicker.numPointLights : 0;
		}

		protected function invalidateScreenPasses() : void
		{
			_screenPassesInvalid = true;
		}

		private function onLightsChange(event : Event) : void
		{
			invalidateScreenPasses();
		}
	}
}