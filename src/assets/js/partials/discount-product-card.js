
class DiscountProductCard extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		// Parse product data
		this.product_id = this.getAttribute('product-id');
		this.offer_title = this.getAttribute('offer-title');

		if (!this.product_id) {
			return
		}

		salla.product.getDetails(this.product_id, ["images", "sold_quantity", "category", "options"])
			.then((res) => {
				if (!res.success) {
					console.log("what")
					return
				}
				this.product = res.data
				this.render()
			})
	}

	render() {
		this.classList.add('flex', 'flex-col', 'md:flex-row', 'w-full', 'gap-3', 'md:max-h-96', 'border-2', 'border-bc', 'rounded-neo', 'shadow-neo')

		if (!this.product) {
			return
		}

		this.innerHTML = `
			<div class="w-full border-b-2 md:border-b-0 md:border-s-2 border-bc">
				<img
					class="w-full h-full object-cover"
					src="${ this.product?.image?.url || this.product?.thumbnail }" 
				/>
			</div>

			<div class="w-full flex flex-col gap-3 justify-center items-center">
				<h2 class="text-lg md:text-xl font-bold">${ this.offer_title }</h2>
				<a href="${ this.product?.url }" class="text-base md:text-lg font-normal hover:underline underline-offset-4">${ this.product?.name }</a>
			</div>
		`
	}

}

customElements.define('discount-product-card', DiscountProductCard);
