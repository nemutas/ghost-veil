import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { lerp } from '../modules/scripts/math';
import { Canvas } from './Canvas';
import { datas } from './store';

gsap.registerPlugin(ScrollTrigger)

class Home {
	private parentElement: HTMLElement
	private scrollElement: HTMLDivElement
	private imageElements: NodeListOf<HTMLImageElement>

	private scrollCurrent = 0
	private scrollTarget = 0

	constructor() {
		this.parentElement = document.querySelector<HTMLElement>('.home-main')!
		this.scrollElement = document.querySelector<HTMLDivElement>('.home-contents')!
		this.imageElements = document.querySelectorAll<HTMLImageElement>('.work__image')

		this.setStoreDatas()
		this.setSmoothScroll()
		this.setGsapAnimation()

		new Canvas(this.parentElement)
	}

	private setStoreDatas = () => {
		this.imageElements.forEach(() => {
			datas.scrollProgress.push(0)
		})
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
			requestAnimationFrame(anime)

			this.scrollCurrent = lerp(this.scrollCurrent, this.scrollTarget, 0.08)
			this.scrollElement.scrollTo({ left: this.scrollCurrent })
		}

		anime()
	}

	private setGsapAnimation = () => {
		this.imageElements.forEach((el, i) => {
			gsap.to(el, {
				'--clip-height': '100%',
				scrollTrigger: {
					scroller: this.scrollElement,
					trigger: el,
					scrub: true,
					start: '0 100%',
					end: '0 51%',
					horizontal: true,
					once: true,
					onUpdate: self => (datas.scrollProgress[i] = self.progress)
				}
			})
		})
	}
}

new Home()
