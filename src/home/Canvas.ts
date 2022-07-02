import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { DomSyncPlane } from '../modules/scripts/DomSyncPlane';
import { TCanvas } from '../modules/scripts/extends/TCanvas';
import { Flowmap } from '../modules/scripts/flowmap/Flowmap';
import { Mouse2D } from '../modules/scripts/Mouse2d';
import planeFrag from './shader/planeFrag.glsl';
import planeVert from './shader/planeVert.glsl';
import { datas } from './store';

export class Canvas extends TCanvas {
	private dsPlanes: DomSyncPlane<THREE.ShaderMaterial>[] = []
	private flowmap?: Flowmap
	private mousePos = new THREE.Vector2()
	private currentProgress = datas.scrollProgress.map(() => 0)
	private isLoaded: boolean[] = []

	constructor(private parentNode: ParentNode) {
		super(parentNode)

		this.setScene()
		this.setPlanes()
		this.setPostprocessing()
		this.animate(this.update)
	}

	private setScene = () => {
		this.setOrthographicCamera(-1, 1, 1, -1, 0.01, 10)
		this.camera.position.z = 1
	}

	private setPlanes = () => {
		const elements = this.parentNode.querySelectorAll<HTMLImageElement>('.work__image')

		const elementObjects: { element: HTMLImageElement; texture: THREE.Texture }[] = []

		elements.forEach((element, i) => {
			this.isLoaded.push(false)
			const texture = new THREE.TextureLoader().load(element.src, () => {
				this.isLoaded[i] = true
			})
			texture.encoding = THREE.sRGBEncoding
			elementObjects.push({ element, texture })
		})

		const createShaderMaterial = (texture: THREE.Texture) => {
			return new THREE.ShaderMaterial({
				uniforms: {
					u_texture: { value: texture },
					u_progress: { value: 0 }
				},
				vertexShader: planeVert,
				fragmentShader: planeFrag
			})
		}

		elementObjects.forEach(obj => {
			const dsPlane = new DomSyncPlane(obj.element, createShaderMaterial(obj.texture))
			this.scene.add(dsPlane.mesh)
			this.dsPlanes.push(dsPlane)
		})
	}

	private setPostprocessing = () => {
		const sRGBCorrectionPass = new ShaderPass(GammaCorrectionShader)
		this.effectComposer.addPass(sRGBCorrectionPass)

		this.flowmap = new Flowmap(this.renderer, this.size.width, this.size.height)
		this.effectComposer.addPass(this.flowmap!.pass)
	}

	private update = () => {
		if (!this.isLoaded.every(x => x)) return

		this.dsPlanes.forEach((plane, i) => {
			plane.update()
			this.currentProgress[i] = THREE.MathUtils.lerp(this.currentProgress[i], datas.scrollProgress[i], 0.01)
			plane.material.uniforms.u_progress.value = this.currentProgress[i]
		})

		const mousePosition = Mouse2D.instance.normalizedPosition
		this.flowmap?.update(this.mousePos.set(mousePosition.x, -mousePosition.y))
	}

	disposeCanvas = () => {
		this.dispose()
		Mouse2D.instance.dispose()
	}
}
