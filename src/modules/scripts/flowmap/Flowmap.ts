import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import flowmapFrag from './flowmapFrag.glsl';
import flowmapVert from './flowmapVert.glsl';
import { Simulator } from './simulator';

export class Flowmap {
	public pass: ShaderPass
	private simulator: Simulator
	private centeredMousePos = new THREE.Vector2()

	private datas = {
		power: 0.3,
		range: 0.1,
		viscosity: 0.04,
		isPixel: false,
		pixel: 20
	}

	constructor(gl: THREE.WebGLRenderer, width: number, height: number) {
		this.pass = this.createPass(width / height)
		this.simulator = new Simulator(gl, width, height)
	}

	private createPass = (aspect: number) => {
		const shader: THREE.Shader = {
			uniforms: {
				tDiffuse: { value: null },
				u_motionTexture: { value: null },
				u_powar: { value: this.datas.power },
				u_aspect: { value: aspect },
				u_pixelMode: { value: this.datas.isPixel },
				u_pixel: { value: this.datas.pixel }
			},
			vertexShader: flowmapVert,
			fragmentShader: flowmapFrag
		}

		return new ShaderPass(shader)
	}

	update = (mouse: THREE.Vector2) => {
		this.centeredMousePos.set((mouse.x + 1) / 2, (mouse.y + 1) / 2)
		this.simulator.compute(this.centeredMousePos, this.datas.range, this.datas.viscosity)

		this.pass.uniforms.u_motionTexture.value = this.simulator.texture
		this.pass.uniforms.u_powar.value = this.datas.power
		this.pass.uniforms.u_pixelMode.value = this.datas.isPixel
		this.pass.uniforms.u_pixel.value = this.datas.pixel
	}
}
