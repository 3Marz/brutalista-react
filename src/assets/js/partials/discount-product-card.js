
class DiscountProductCard extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		// Parse product data
		this.product_id = this.getAttribute('product-id');
		this.offer_title = this.getAttribute('offer-title');

		if (window.app?.status === 'ready') {
			this.onReady();
		} else {
			document.addEventListener('theme::ready', () => this.onReady())
		}
	}

	onReady() {

		salla.lang.onLoaded(() => {
			// Language
			this.remained = salla.lang.get('pages.products.remained');
			this.donationAmount = salla.lang.get('pages.products.donation_amount');
			this.startingPrice = salla.lang.get('pages.products.starting_price');
			this.addToCart = salla.lang.get('pages.cart.add_to_cart');
			this.outOfStock = salla.lang.get('pages.products.out_of_stock');
			this.discountEnds = salla.lang.get('pages.product_card.discount_ends');

			// re-render to update translations
			this.render();
		})


		salla.product.api.fetchOptions([this.product_id])
			.then((res) => {
				if (!res.success) {
					console.log("what")
					return
				}
				this.product = res.data[0]
				this.render()
			})
	}

	formatDate(date) {
		let d = new Date(date * 1000) // this "* 1000" toke alot of time relize;
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	}

	getPriceFormat(price) {
		if (!price || price == 0) {
			return salla.config.get('store.settings.product.show_price_as_dash') ? '-' : '';
		}

		return salla.money(price);
	}

	getProductPrice() {
		let price = '';
		if (this.product.is_on_sale) {
			price = `<div class="s-product-card-sale-price">
						<h4>${this.getPriceFormat(this.product.sale_price)}</h4>
						<span>${this.getPriceFormat(this.product?.regular_price)}</span>
					</div>`;
		}
		else if (this.product.starting_price) {
			price = `<div class="s-product-card-starting-price">
						<p>${this.startingPrice}</p>
						<h4> ${this.getPriceFormat(this.product?.starting_price)} </h4>
					</div>`
		}
		else {
			price = `<h4 class="s-product-card-price">${this.getPriceFormat(this.product?.price)}</h4>`
		}

		return price;
	}
	
	getAddButtonLabel() {
		if (this.product.status === 'sale' && this.product.type === 'booking') {
			return salla.lang.get('pages.cart.book_now');
		}

		if (this.product.status === 'sale') {
			return salla.lang.get('pages.cart.add_to_cart');
		}

		if (this.product.type !== 'donating') {
			return salla.lang.get('pages.products.out_of_stock');
		}

		// donating
		return salla.lang.get('pages.products.donation_exceed');
	}

	render() {
		this.classList.add('overflow-hidden', 'flex', 'flex-col', 'md:flex-row', 'w-full', 'md:h-96', 'border-2', 'border-bc', 'rounded-neo', 'shadow-neo')

		if (!this.product) {
			this.innerHTML = `
				<div class="w-full h-full flex justify-center items-center p-5 md:p-0">
					<span class="w-10 h-10 rounded-full border-4 border-b-bc border-base-300 animate-spin"></span>
				</div>
			`
			return
		}

		this.innerHTML = `
			<a href="${ this.product?.url }" class="w-full h-80 md:h-auto border-b-2 md:border-b-0 md:border-s-2 border-bc">
				<img
					class="w-full h-full object-cover"
					src="${ this.product?.image?.url || this.product?.thumbnail }" 
				/>
			</a>

			<div class="w-full h-72 md:h-auto p-3 md:p-0 flex flex-col gap-2 md:gap-3 justify-center items-center">
				<a href="${ this.product?.url }" class="text-base md:text-lg font-normal hover:underline underline-offset-4">${ this.product?.name }</a>
				${ this.getProductPrice() }

				${this.product.discount_ends
					? `
					<div class="w-full text-center">
						<salla-count-down class="*:!my-0" size="sm" date="${this.formatDate(this.product.discount_ends)}" boxed="false" labeled=${true}></salla-count-down>
					</div>
					`
				: ``}

				<div class="flex gap-2 w-5/6">
					<salla-add-product-button 
						width="wide"
						product-id="${this.product.id}"
						product-status="${this.product.status}"
						product-type="${this.product.type}"
					>
						${this.product.status == 'sale' ?
							`<i class="text-base sicon-${this.product.type == 'booking' ? 'calendar-time' : 'shopping-bag'}"></i>` : ``
						}
						<span>${this.product.add_to_cart_label ? this.product.add_to_cart_label : this.getAddButtonLabel()}</span>
					</salla-add-product-button>
					<salla-button
						size="medium"
						shape="icon"
						color="light"
						name="product-name-${this.product.id}"
						aria-label="Quick view product"
						class="no-background"
						onclick="document.getElementById('quick-view-modal')?.loadProduct(${this.product.id})"
					>
						<i class="sicon-eye"></i>
					</salla-button>
				</div>
			</div>
		`
	}

}

customElements.define('discount-product-card', DiscountProductCard);
