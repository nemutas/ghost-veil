import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { lerp } from '../modules/scripts/math';
import { Canvas } from './Canvas';
import { datas } from './store';

gsap.registerPlugin(ScrollTrigger)

class Home {
	private parentElement: HTMLElement
	private scrollElement: HTMLDivElement
	private imageElements: HTMLImageElement[]

	private scrollAnimeId?: number
	private scrollCurrent = 0
	private scrollTarget = 0

	private gsapTimelines: gsap.core.Timeline[] = []

	private canvas: Canvas

	constructor() {
		this.parentElement = document.querySelector<HTMLElement>('.home-main')!
		this.scrollElement = document.querySelector<HTMLDivElement>('.home-contents')!
		this.imageElements = Array.from(document.querySelectorAll<HTMLImageElement>('.work__image'))

		this.setStoreDatas()
		this.setSmoothScroll()
		this.setGsapAnimation()
		this.setLifecycle()

		this.canvas = new Canvas(this.parentElement)
	}

	private setStoreDatas = () => {
		datas.scrollProgress = this.imageElements.map(() => 0)
	}

	private setSmoothScroll = () => {
		this.scrollElement.onwheel = e => {
			let scroll = this.scrollElement.scrollLeft + e.deltaY * 3
			scroll = Math.min(scroll, this.scrollElement.scrollWidth - this.scrollElement.offsetWidth)
			this.scrollTarget = scroll
		}

		this.scrollElement.onscroll = () => {
			if (Math.abs(this.scrollCurrent - this.scrollTarget) < 1) {
				this.scrollCurrent = this.scrollElement.scrollLeft
				this.scrollTarget = this.scrollElement.scrollLeft
			}
		}

		const anime = () => {
			this.scrollAnimeId = requestAnimationFrame(anime)

			this.scrollCurrent = lerp(this.scrollCurrent, this.scrollTarget, 0.08)
			this.scrollElement.scrollTo({ left: this.scrollCurrent })
		}

		anime()
	}

	private setGsapAnimation = () => {
		this.gsapTimelines = this.imageElements.map((el, i) => {
			el.style.setProperty('--clip-height', '0%')

			const tl = gsap.timeline({
				scrollTrigger: {
					scroller: this.scrollElement,
					trigger: el,
					scrub: 0.5,
					start: '0 100%',
					end: '0 51%',
					horizontal: true,
					once: true,
					onUpdate: self => (datas.scrollProgress[i] = self.progress)
				}
			})
			tl.set(el, { '--clip-height': '0%' })
			tl.to(el, { '--clip-height': '100%', duration: 1, ease: 'none' })
			return tl
		})
	}

	private setLifecycle = () => {
		window.addEventListener('beforeunload', () => {
			this.dispose()
		})
	}

	private dispose = () => {
		this.scrollAnimeId && cancelAnimationFrame(this.scrollAnimeId)

		this.gsapTimelines.forEach(tl => {
			tl.scrollTrigger?.kill()
			tl.kill()
		})

		this.canvas.disposeCanvas()
	}
}

new Home()
