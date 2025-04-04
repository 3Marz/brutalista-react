
class BurtalReviews extends HTMLElement {
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

		salla.api.component.getReviews({ per_page :5, type: "product", items:"testimonials"})
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
			<div class="s-brutal-reviews">
				${this.reviews.map(review => `
					<h2>${review.content}</h2>
				`).join('')}
			</div>
		`

	}
}

customElements.define('brutal-reviews', BurtalReviews)
