
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
		this.getProps()

		salla.api.component.getReviews({ per_page : this.limit, type: "store", items:[]})
			.then((res) => {
				if (!res.success) {
					console.log("failed to get reviews")
					console.log(res)
					return
				}
				this.reviews = res.data
				this.render()
			})
	}

	getProps() {
		this.title = this.getAttribute('title');

		this.hide_names = this.hasAttribute('hide-names');

		this.limit = this.getAttribute('limit');
	}

	render() {

		if (!this.reviews) {
			return
		}

		this.innerHTML = `
			<salla-slider 
				type="fullwidth"
				class="brutal-reviews-slider"
				show-controls="true"
				block-title=${this.title ? this.title : ""}
			>
				${this.reviews.map(review => `
					<div class="mx-8 flex rounded-neo shadow-neo min-h-80 border-2 border-bc bg-base-50 w-[80%] md:w-1/2 xl:w-1/3 relative">
						<div class="border-2 rounded-full border-bc w-20 h-20 md:w-24 md:h-24 absolute overflow-hidden -translate-x-1/2 -translate-y-1/2 top-0 left-1/2">
							<img class="w-full h-full object-cover" src=${review.avatar} />
						</div>

						<div class="w-full flex flex-col text-center gap-5 justify-between px-4 py-6">
							<div class="w-full h-10 flex justify-between px-6">
								<i class="sicon-quote text-bc text-3xl ltr:rotate-180"></i>
								<i class="sicon-quote text-bc text-3xl rtl:rotate-180"></i>
							</div>
							<div class="h-full flex justify-center items-center">
								<p class="text-base text-bc opacity-80 line-clamp-5">${review.content}</p>
							</div>
							<div class="flex flex-col">
								<salla-rating-stars value=${review.stars} ></salla-rating-stars>
								${this.hide_names ? `` : `<span class="text-lg">${review.name}</span>`}
							</div>
						</div>
					</div>
				`).join('')}
			</salla-slider>
		`

	}
}

customElements.define('brutal-reviews', BrutalReviews)
