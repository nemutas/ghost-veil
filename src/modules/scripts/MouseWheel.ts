export type WheelDirection = 'increase' | 'decrease' | 'none'

export class MouseWheel {
	private prevWheel = { x: 0, y: 0, z: 0 }
	callback?: (direction: { x: WheelDirection; y: WheelDirection; z: WheelDirection }) => void

	constructor(private eventTarget?: HTMLElement) {
		if (eventTarget) {
			eventTarget.onwheel = this.handleWheel
		} else {
			window.addEventListener('wheel', this.handleWheel)
		}
	}

	private handleWheel = (e: WheelEvent) => {
		const direction: { x: WheelDirection; y: WheelDirection; z: WheelDirection } = { x: 'none', y: 'none', z: 'none' }

		const absDeltaX = Math.abs(e.deltaX)
		if (0 <= absDeltaX - this.prevWheel.x) direction.x = 0 < e.deltaX ? 'increase' : 'decrease'
		this.prevWheel.x = absDeltaX

		const absDeltaY = Math.abs(e.deltaY)
		if (0 <= absDeltaY - this.prevWheel.y) direction.y = 0 < e.deltaY ? 'increase' : 'decrease'
		this.prevWheel.y = absDeltaY

		const absDeltaZ = Math.abs(e.deltaZ)
		if (0 <= absDeltaZ - this.prevWheel.z) direction.z = 0 < e.deltaZ ? 'increase' : 'decrease'
		this.prevWheel.z = absDeltaZ

		this.callback && this.callback(direction)
	}

	dispose = () => {
		if (!this.eventTarget) {
			window.removeEventListener('wheel', this.handleWheel)
		}
	}
}
