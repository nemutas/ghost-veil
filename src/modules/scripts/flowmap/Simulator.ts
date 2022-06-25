import * as THREE from 'three';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';
import fragmentShader from './simulatorFrag.glsl';

export class Simulator {
	private _gpuCompute
	private _variables: Variable[] = []
	private _material = new THREE.ShaderMaterial()

	constructor(gl: THREE.WebGLRenderer, private _width: number, private _height: number) {
		this._gpuCompute = new GPUComputationRenderer(this._width, this._height, gl)
		this._setMotionTexture()
		this._setVariableDependencies()
		this._gpuCompute.init()
	}

	private _setMotionTexture = () => {
		// set the default position to texture
		const dataTexture = this._gpuCompute.createTexture()
		const theArray = dataTexture.image.data

		for (let i = 0; i < theArray.length; i += 4) {
			theArray[i + 0] = 0
			theArray[i + 1] = 0
			theArray[i + 2] = 0
			theArray[i + 3] = 0
		}

		// set fragment shader
		const variable = this._gpuCompute.addVariable('motionTexture', fragmentShader, dataTexture)
		variable.wrapS = THREE.RepeatWrapping
		variable.wrapT = THREE.RepeatWrapping

		// set uniforms
		this._material = variable.material
		this._material.uniforms['u_defaultTexture'] = { value: dataTexture.clone() }
		this._material.uniforms['u_mouse_pos'] = { value: new THREE.Vector2() }
		this._material.uniforms['u_range'] = { value: 0 }
		this._material.uniforms['u_viscosity'] = { value: 0 }

		// add variable
		this._variables.push(variable)
	}

	private _setVariableDependencies = () => {
		this._variables.forEach(variable => {
			this._gpuCompute.setVariableDependencies(variable, this._variables)
		})
		// it means.
		// this._gpuCompute.setVariableDependencies(positionVariable, [positionVariable, ...])
	}

	compute = (mouse: THREE.Vector2, range: number, viscosity: number) => {
		this._material.uniforms.u_mouse_pos.value.copy(mouse)
		this._material.uniforms.u_range.value = range
		this._material.uniforms.u_viscosity.value = viscosity
		this._gpuCompute.compute()
	}

	get texture() {
		const variable = this._variables.find(v => v.name === 'motionTexture')!
		const target = this._gpuCompute.getCurrentRenderTarget(variable) as THREE.WebGLRenderTarget
		return target.texture
	}
}
