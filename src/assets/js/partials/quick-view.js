
class QuickViewModal extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		if (window.app?.status === 'ready') {
			this.onReady();
		} else {
			document.addEventListener('theme::ready', () => this.onReady())
		}
	}

	onReady() {
		this.product = null
		this.setAttribute('id', 'quick-view-modal')
		this.render()
	}

	loadProduct(prodId) {
		salla.product.getDetails(prodId, ["images", "sold_quantity", "category", "options"])
			.then((res) => {
				console.log(res)
				document.querySelector('#quick-view-inner-modal')?.open();	
				if (!res.success) {
					console.log("what")
					return
				}
				this.product = res.data
				this.render()
			})
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

	getProductOptions () {
		if (!this.product) { return }
		return `
			${this.product.options.length ? `
				<salla-product-options class="!px-0" options="${ this.product.options }" product-id="${ this.product.id }"></salla-product-options>
			` :	``}
		`
	}

	render() {

		this.innerHTML = `
			<div class="flex flex-col gap-4 xs:flex-row h-full">
				${this.product != null ? 
					`
						<div class="w-full h-full">
							<salla-slider
									id="details-slider-${this.product.id}"
									class="details-slider modal-slider rounded-neo image-slider"
									loop="true"
									auto-height
									show-thumbs-controls="false">
								${this.product.promotion_title ? `
									<div class="promotion-title">${ this.product.promotion_title }</div>
								` : ``}

								${ this.product.calories ? ` 
									<div class="absolute border border-base-200 z-[2] top-4 rtl:left-4 ltr:right-4 bg-base-50 shadow-sm flex flex-col justify-center items-center rounded-full w-20 h-20 md:w-24 md:h-24">
										<span class="text-red-500 text-xl leading-none font-bold">${ this.product.calories }</span>
										<span class="text-xs text-gray-500">${ salla.lang.get('pages.products.calories') }</span>
									</div>
								` : `` }

								<div slot="items">
									${ this.product.images.map((image) => `
										${ image.three_d_image_url ? `
											<model-viewer style="min-height: 500px;" class="swiper-slide model-entry w-full h-full"
												loading="eager" camera-controls
												touch-action="pan-y" auto-rotate
												poster="${ image.url }"
												src="${ image.three_d_image_url }"
												shadow-intensity="1" alt="${ image.alt }">
											</model-viewer>
											` 
												: 
											`
											<div class="w-full">
												<img width="100%" src="${image.url}" />
											</div>
											` }
									`) }
								</div>

							</salla-slider>
						</div>
						<div class="w-full h-full flex flex-col gap-4">
							<div class="flex rtl:space-x-reverse space-x-1">
								<salla-social-share class="inline-flex quick-view-share-button" aria-label="social share"></salla-social-share>

								<salla-button
										class="btn--wishlist animated no-background"
										data-id="${ this.product.id }"
										onclick="salla.wishlist.toggle(${ this.product.id })"
										shape="icon"
										fill="outline"
										color="light"
										aria-label="add to wishlist">
									<i class="sicon-heart"></i>
								</salla-button>
							</div>
							${ this.product.category ? `
								<a class="text-lg text-bc opacity-60" href="${this.product.category.url}">${ this.product.category.name }</a>
							` : ``}
							<a class="text-2xl" href="${this.product.url}">${this.product.name}</a>
							
							<form class="form product-form" enctype="multipart/form-data" method="post"
								  onsubmit="return salla.form.onSubmit('cart.addItem', event)" >
								<input type="hidden" name="id" value="{{ product.id }}">

								<div class="flex whitespace-nowrap price-wrapper gap-4 items-center">
								  <div class="${ this.product.is_on_sale ? '' : 'hidden' } price_is_on_sale space-x-2 rtl:space-x-reverse whitespace-nowrap">
									<h2 class="total-price text-red-800 font-bold text-xl inline-block">${ salla.money(this.product.sale_price) }</h2>
									<span class="before-price text-gray-500 line-through">${ salla.money(this.product.regular_price) }</span>
								  </div>
								  <div class="starting-or-normal-price gap-4 ${ this.product.is_on_sale ? 'hidden' : 'flex' }">
									${ this.product.starting_price ? `
										<span class="starting-price-title">${ salla.lang.get('pages.products.starting_price') }</span>
									`: `` } 
									<h2 class="total-price font-bold text-xl inline-block"> ${ this.product.starting_price ? salla.money(this.product.starting_price) : salla.money(this.product.price) }</h2>
								  </div>
								</div>

								${this.getProductOptions()}

								<div class="w-full">
									<salla-add-product-button width="wide"
										product-id="${this.product.id}"
										product-status="${this.product.status}"
										product-type="${this.product.type}"
										type="submit"
										loader-position="end"
									>
										${this.product.status == 'sale' ?
											`<i class="text-base sicon-${this.product.type == 'booking' ? 'calendar-time' : 'shopping-bag'}"></i>` : ``
										}
										<span>${this.product.add_to_cart_label ? this.product.add_to_cart_label : this.getAddButtonLabel()}</span>
									</salla-add-product-button>
								</div>

								<salla-installment price="${ this.product.price }"></salla-installment>

							</form>
						</div>
					`
					:
					`
						Loading...
					`
				}
			</div>
		`
		
	}

}

customElements.define('quick-view', QuickViewModal);
