
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
		this.all_url = salla.url.get('testimonials')

		salla.api.component.getReviews({ per_page : 20, type: "store", items:[]})
			.then((res) => {
				if (!res.success) {
					console.log("failed to get reviews")
					console.log(res)
					return
				}
				this.reviews = res.data
				this.orderReviews()
				this.render()
			})
	}

	getProps() {
		this.title = this.getAttribute('title');

		this.hide_names = this.getAttribute('hide-names');

		this.limit = this.getAttribute('limit');

		this.order_by = this.getAttribute('order-by')

		this.display_all_url = this.getAttribute('display-all-url')

		this.position = this.getAttribute('slider-pos')
	}

	orderReviews() {
		if (!this.reviews) { return }

		switch (this.order_by) {
			case "highest":
				this.reviews.sort((a, b) => b.stars - a.stars)
				break
			case "newest":
				this.reviews.sort((a, b) => b.date - a.date)
		}
	}

	render() {

		if (!this.reviews) {
			return
		}

		if (this.limit) {
			this.reviews = this.reviews.slice(0, this.limit)
		}

		if (!this.reviews.length) {
			return
		}

		this.innerHTML = `
			<salla-slider 
				id="brutal-reviews-${this.position ? this.position : Math.floor(Math.random() * 100000)}"
				type="fullwidth"
				class="brutal-reviews-slider"
				show-controls="true"
				block-title="${this.title ? this.title : ' '}"
				auto-play
				${this.display_all_url ? 
					`display-all-url="${this.all_url}"` 
				: ``}
			>
				<div slot="items">
				${this.reviews.map(review => `
					<div class="mx-6 flex rounded-neo shadow-neo min-h-80 border-2 border-bc bg-base-50 w-[80%] md:w-1/2 xl:w-1/3 relative">
						<div class="border-2 rounded-full border-bc w-20 h-20 md:w-24 md:h-24 absolute overflow-hidden -translate-x-1/2 -translate-y-1/2 top-0 left-1/2">
							<img class="w-full h-full object-cover" src=${review.avatar} />
						</div>

						<div class="w-full flex flex-col text-center gap-5 justify-between px-4 py-6">
							<div class="w-full h-10 flex justify-between px-6">
								<i class="sicon-quote text-bc text-3xl ltr:rotate-180"></i>
								<i class="sicon-quote text-bc text-3xl rtl:rotate-180"></i>
							</div>
							<div class="h-full flex justify-center items-center">
								<p class="text-base text-text-color opacity-80 line-clamp-5">${review.content}</p>
							</div>
							<div class="flex flex-col">
								<salla-rating-stars value=${review.stars} ></salla-rating-stars>
								${this.hide_names ? `` : `<span class="text-lg">${review.name}</span>`}
							</div>
						</div>
					</div>
				`).join('\n')}
				</div>
			</salla-slider>
		`

	}
}

customElements.define('brutal-reviews', BrutalReviews)
