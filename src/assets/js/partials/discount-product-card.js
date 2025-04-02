
class DiscountProductCard extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		// Parse product data
		this.product_id = this.getAttribute('product-id');

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
		this.classList.add('flex', 'flex-col', 'md:flex-row', 'w-full', 'h-full', 'gap-3')

		if (!this.product) {
			return
		}

		this.innerHTML = `
			<div class="w-full h-full">
				<img
					class="w-full h-full object-cover"
					src="${ this.product?.image?.url || this.product?.thumbnail }" />
			</div>

			<div class="w-full h-full">
			</div>
		`
	}

}

customElements.define('discount-product-card', DiscountProductCard);
