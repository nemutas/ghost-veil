export class Mouse2D {
	private static _instance: Mouse2D | null
	private _relativePosition: [number, number] = [0, 0]

	private constructor() {
		window.addEventListener('mousemove', this._handleMouseMove)
	}

	static get instance() {
		if (!this._instance) {
			this._instance = new Mouse2D()
		}
		return this._instance
	}

	private _handleMouseMove = (e: MouseEvent) => {
		this._relativePosition = [e.clientX, e.clientY]
	}

	get normalizedPosition() {
		const x = (this._relativePosition[0] / window.innerWidth) * 2 - 1
		const y = (this._relativePosition[1] / window.innerHeight) * 2 - 1
		return { x, y }
	}

	get relativePosition() {
		return { x: this._relativePosition[0], y: this._relativePosition[1] }
	}

	get absolutePosition() {
		const x = this._relativePosition[0] + window.pageXOffset
		const y = this._relativePosition[1] + window.pageYOffset
		return { x, y }
	}

	dispose = () => {
		window.removeEventListener('mousemove', this._handleMouseMove)
	}
}
