import * as THREE from 'three';

export class DomSyncPlane<T extends THREE.Material> {
	public mesh: THREE.Mesh

	constructor(private element: HTMLElement, public material: T) {
		this.mesh = this.createMesh()
	}

	private createMesh = () => {
		const geometry = new THREE.PlaneGeometry(2, 2)
		return new THREE.Mesh(geometry, this.material)
	}

	update = () => {
		const rect = this.element.getBoundingClientRect()
		const normalizeWidth = rect.width / window.innerWidth
		const normalizeHeight = rect.height / window.innerHeight
		const centerX = (rect.width / 2 + rect.left - window.innerWidth / 2) * 2
		const centerY = (window.innerHeight / 2 - (rect.height / 2 + rect.top)) * 2
		const normalizeCenterX = centerX / window.innerWidth
		const normalizeCenterY = centerY / window.innerHeight

		this.mesh.scale.set(normalizeWidth, normalizeHeight, 1)
		this.mesh.position.set(normalizeCenterX, normalizeCenterY, 0)
	}
}
