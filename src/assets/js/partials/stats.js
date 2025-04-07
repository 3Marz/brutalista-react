
const ease = {
  linear: t => t,
  inOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  // Find out more at: https://gist.github.com/gre/1650294
};

function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}

class StatCount extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		if (window.app?.status === 'ready') {
			this.onReady();
		} else {
			document.addEventListener('theme::ready', () => this.onReady())
		}
	}

	onReady() {
		document.addEventListener("scroll", () => {
			if (isScrolledIntoView(this)) {
				this.startCount()
				document.removeEventListener("scroll", this.startCount)
			}
		})
	}

	startCount() {
		this.duration = 1000;

		this.start = parseInt(this.textContent, 10); // Get start and end values
		this.end = parseInt(this.dataset.count, 10);

		if (this.start == this.end) return;

		this.range = this.end - this.start;
		this.curr = this.start;

		this.timeStart = Date.now();
		
		const loop = () => {
			this.elaps = Date.now() - this.timeStart;
			if (this.elaps > this.duration) {
				this.elaps = this.duration;
			}
			this.norm = ease.inOutQuad(this.elaps / this.duration);
			this.step = this.range * this.norm;
			this.curr = this.start + this.step;
			this.textContent = Math.trunc(this.curr);
			if (this.elaps < this.duration) {
				requestAnimationFrame(loop);
			}
		}

		requestAnimationFrame(loop);
	}

}

customElements.define('stat-count', StatCount)
