
class BrutalReviews extends HTMLElement {
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

		salla.api.component.getReviews({ per_page :5, type: "store", items:[]})
			.then((res) => {
				if (!res.success) {
					console.log("failed to get reviews")
					console.log(res)
					return
				}
				this.reviews = res.data
				console.log(res)
				this.render()
			})
	}

	render() {

		if (!this.reviews) {
			return
		}

		this.innerHTML = `
			<salla-slider 
			>
				${this.reviews.map(review => `
					<div class="mx-8 border-2 border-bc bg-base-50 w-full md:w-1/2 xl:w-1/3 h-96">
						
					</div>
				`).join('')}
			</salla-slider>
		`

	}
}

customElements.define('brutal-reviews', BrutalReviews)
