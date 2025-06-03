import BasePage from '../base-page';
class ProductCard extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		// Parse product data
		this.product = this.product || JSON.parse(this.getAttribute('product'));

		if (window.app?.status === 'ready') {
			this.onReady();
		} else {
			document.addEventListener('theme::ready', () => this.onReady())
		}
	}

	onReady() {
		this.fitImageHeight = salla.config.get('store.settings.product.fit_type');
		this.placeholder = salla.url.asset(salla.config.get('theme.settings.placeholder'));
		this.getProps()

		this.source = salla.config.get("page.slug");
		// If the card is in the landing page, hide the add button and show the quantity
		if (this.source == "landing-page") {
			this.hideAddBtn = true;
			this.showQuantity = window.showQuantity;
		}

		salla.lang.onLoaded(() => {
			// Language
			this.remained = salla.lang.get('pages.products.remained');
			this.donationAmount = salla.lang.get('pages.products.donation_amount');
			this.startingPrice = salla.lang.get('pages.products.starting_price');
			this.addToCart = salla.lang.get('pages.cart.add_to_cart');
			this.outOfStock = salla.lang.get('pages.products.out_of_stock');

			// re-render to update translations
			this.render();
		})

		this.render()
	}

	initCircleBar() {
		let qty = this.product.quantity,
			total = this.product.quantity > 100 ? this.product.quantity * 2 : 100,
			roundPercent = (qty / total) * 100,
			bar = this.querySelector('.s-product-card-content-pie-svg-bar'),
			strokeDashOffsetValue = 100 - roundPercent;
		bar.style.strokeDashoffset = strokeDashOffsetValue;
	}

	formatDate(date) {
		let d = new Date(date);
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	}

	getProductBadge() {
		if (this.product.promotion_title) {
			return `
				<div class="promotion-title pointer-events-none">
					${this.product.promotion_title}
				</div>`
		}
		//if (this.showQuantity && this.product?.quantity) {
		//	return `<div class="s-product-card-quantity">${this.remained} ${salla.helpers.number(this.product?.quantity)}</div>`
		//}
		if (this.product?.is_out_of_stock) {
			return `
				<div class="absolute top-0 right-0 z-[3] w-32 h-32 overflow-hidden flex items-center justify-center pointer-events-none">
					<span class="text-center outline-2 outline outline-[#7a0000] border-y-2 border-yellow-50 border-dashed text-xs md:text-sm rotate-45 translate-x-6 -translate-y-6 px-4 py-1 w-[200%] bg-[#7a0000] text-yellow-50 absolute">
						${this.outOfStock}
					</span>
				</div>`
		}
		return '';
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
						<span class="${this.fullImage ? "!text-base-100" : ""}">${this.getPriceFormat(this.product?.regular_price)}</span>
					</div>`;
		}
		else if (this.product.starting_price) {
			price = `<div class="s-product-card-starting-price">
						<p>${this.startingPrice}</p>
						<h4> ${this.getPriceFormat(this.product?.starting_price)} </h4>
					</div>`
		}
		else {
			price = `<h4 class="s-product-card-price ${this.fullImage ? "!text-base-100" : ""}">${this.getPriceFormat(this.product?.price)}</h4>`
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

	getProps() {

		/**
		 *  Horizontal card.
		 */
		this.horizontal = this.hasAttribute('horizontal');

		/**
		 *  Support shadow on hover.
		 */
		this.shadowOnHover = this.hasAttribute('shadowOnHover');

		/**
		 *  Hide add to cart button.
		 */
		this.hideAddBtn = this.hasAttribute('hideAddBtn');

		/**
		 *  Full image card.
		 */
		this.fullImage = this.hasAttribute('fullImage');

		/**
		 *  Minimal card.
		 */
		this.minimal = this.hasAttribute('minimal');

		/**
		 *  Special card.
		 */
		this.isSpecial = this.hasAttribute('isSpecial');

		/**
		 *  Show quantity.
		 */
		this.showQuantity = this.hasAttribute('showQuantity');

		this.notBoxedCountDown = this.hasAttribute('notBoxedCountDown');
		this.deadline_text = this.getAttribute('deadline-text');
	}

	render() {
		this.classList.add('h-full', 'w-full', 'flex', `${this.minimal || this.horizontal ? "flex-row" : "flex-col"}`, 'gap-3', 'group', 'overflow-visible', 'relative', 'px-0.5', 'pb-5');
		this.setAttribute('id', this.product.id);
		!this.horizontal && !this.fullImage && !this.minimal ? this.classList.add('s-product-card-vertical') : '';
		this.horizontal && !this.fullImage && !this.minimal ? this.classList.add('s-product-card-horizontal') : '';
		//this.isHorizontal = this.horizontal && !this.fullImage && !this.minimal
		this.fitImageHeight && !this.isSpecial && !this.fullImage && !this.minimal ? this.classList.add('s-product-card-fit-height') : '';
		this.isSpecial ? this.classList.add('s-product-card-special') : '';
		//this.fullImage ? this.classList.add('s-product-card-full-image') : '';
		this.minimal ? this.classList.add('s-product-card-minimal') : '';
		this.product?.donation ? this.classList.add('s-product-card-donation') : '';
		this.shadowOnHover ? this.classList.add('s-product-card-shadow') : '';
		this.product?.is_out_of_stock ? this.classList.add('s-product-card-out-of-stock') : '';
		this.isInWishlist = !salla.config.isGuest() && salla.storage.get('salla::wishlist', []).includes(this.product.id);

		this.innerHTML = `
			${this.minimal || this.horizontal ? `` : `
				${this.getProductBadge()}		
			`}
			<div class="group/img ${this.fullImage ? `h-full` : `aspect-square`}  w-full border-2 border-bc shadow-neo rounded-neo overflow-hidden relative">
				<a class="w-full h-full flex items-center justify-center overflow-hidden" href="${this.product?.url}">
					<img class="${this.fullImage ? 'brightness-75' : ''} group-hover/img:scale-110 transition-transform w-full h-full duration-500 bg-base-300 object-${salla.url.is_placeholder(this.product?.image?.url)
						? 'contain'
						: this.fitImageHeight
							? this.fitImageHeight
							: 'cover'} lazy"
					  src=${this.placeholder}
					  alt=${this.product?.image?.alt}
					  data-src=${this.product?.image?.url || this.product?.thumbnail}
					/>
				</a>
				
				<div class="absolute ${this.fullImage ? "top-2" : "bottom-2"} left-1 flex flex-col gap-2 group-hover:opacity-100 md:opacity-0 transition">
					<salla-button
						size="medium"
						shape="icon"
						fill="outline"
						color="${this.isInWishlist ? 'danger' : 'dark'}"
						name="product-name-${this.product.id}"
						aria-label="Add or remove to wishlist"
						class="group-hover:pointer-events-auto duration-300 pointer-events-none group-hover:translate-x-0 md:-translate-x-8 transition-all"
						onclick="salla.wishlist.toggle(${this.product.id})"
						data-id="${this.product.id}"
					>
						<i class="sicon-heart"></i>
					</salla-button>

					<salla-button
						size="medium"
						shape="icon"
						fill="outline"
						color="dark"
						name="product-name-${this.product.id}"
						aria-label="Quick view product"
						class="group-hover:pointer-events-auto duration-300 pointer-events-none group-hover:translate-x-0 md:-translate-x-16 transition-all"
						onclick="document.getElementById('quick-view-modal')?.loadProduct(${this.product.id})"
					>
						<i class="sicon-eye"></i>
					</salla-button>
				</div>

			</div>
			<div class="${this.fullImage ? "absolute bottom-0 p-4" : ""} flex flex-grow justify-between w-full flex-col gap-3">
				<div class="h-full w-full flex flex-col gap-2 ${this.isSpecial ? `lg:gap-4` : ``} px-2 ">
					<h5 class="${this.isSpecial ? `lg:text-xl` : ``}">
						<a class="hover:underline underline-offset-2 ${this.fullImage ? `text-base-100` : `text-bc`}" href="${this.product?.url}">${this.product?.name}</a>
					</h5>
					${this.isSpecial && this.product?.subtitle ? `
						<p class="text-sm opacity-80">${this.product?.subtitle}</p>
					` : ``}
					${this.getProductPrice()}
				</div>

				${this.isSpecial && this.product.discount_ends
					? `
					<div class="h-full w-full text-center">
						${this.deadline_text ? `
							<p class="text-sm opacity-65">${this.deadline_text}</p>
						` : ``}
						<salla-count-down size="sm" date="${this.formatDate(this.product.discount_ends)}" boxed=${!this.notBoxedCountDown} labeled=${true} />
					</div>
					`
				: ``}
				
				<div class="w-full custom-add-to-cart-button">
					<salla-add-product-button width="wide"
						class="no-background"
						product-id="${this.product.id}"
						product-status="${this.product.status}"
						product-type="${this.product.type}"
					>
						${this.product.status == 'sale' ?
							`<i class="text-base sicon-${this.product.type == 'booking' ? 'calendar-time' : 'shopping-bag'}"></i>` : ``
						}
						<span>${this.product.add_to_cart_label ? this.product.add_to_cart_label : this.getAddButtonLabel()}</span>
					</salla-add-product-button>
				</div>
			</div>
		`
		
		//this.innerHTML = `
		//      <div class="${!this.fullImage ? 's-product-card-image' : 's-product-card-image-full'} 
		//			${!this.horizontal && !this.fullImage && !this.minimal ? 
		//					'' : 
		//					!this.fullImage ? 
		//						'': ''} border-2 border-bc shadow-neo !rounded-[var(--br)] group"
		//	>
		//	<a href="${this.product?.url}">
		//		<img class="s-product-card-image-${salla.url.is_placeholder(this.product?.image?.url)
		//			? 'contain'
		//			: this.fitImageHeight
		//				? this.fitImageHeight
		//				: 'cover'} lazy"
		//		  src=${this.placeholder}
		//		  alt=${this.product?.image?.alt}
		//		  data-src=${this.product?.image?.url || this.product?.thumbnail}
		//		/>
		//		${!this.fullImage && !this.minimal ? this.getProductBadge() : ''}
		//	</a>
		//	${this.fullImage ? `<a href="${this.product?.url}" aria-label=${this.product.name} class="s-product-card-overlay"></a>` : ''}
		//	${!this.horizontal && !this.fullImage ? `
		//		<salla-button
		//			size="${this.minimal ? "small" : "medium"}"
		//			shape="icon"
		//			fill="outline"
		//			color="dark"
		//			name="product-name-${this.product.id}"
		//			aria-label="Add or remove to wishlist"
		//			class="group-hover:flex group-hover:!opacity-100 !opacity-0 transition-all hidden s-product-card-wishlist-btn animated ${this.isInWishlist ? 's-product-card-wishlist-added pulse-anime' : 'not-added un-favorited'}"
		//			onclick="salla.wishlist.toggle(${this.product.id})"
		//			data-id="${this.product.id}"
		//		>
		//			<i class="sicon-heart"></i>
		//		</salla-button>` : ``
		//	}
		//      </div>
		//<div class="s-product-card-content">
		//	${this.isSpecial && this.product?.quantity ?
		//		`<div class="s-product-card-content-pie">
		//			<span>
		//				<b>${salla.helpers.number(this.product?.quantity)}</b>
		//				${this.remained}
		//			</span>
		//			<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -1 36 34" class="s-product-card-content-pie-svg">
		//				<circle cx="16" cy="16" r="15.9155" class="s-product-card-content-pie-svg-base" />
		//				<circle cx="16" cy="16" r="15.9155" class="s-product-card-content-pie-svg-bar" />
		//			</svg>
		//		</div>`
		//	: ``}
		//
		//	<div class="s-product-card-content-main ${this.isSpecial ? 's-product-card-content-extra-padding' : ''}">
		//		<h3 class="s-product-card-content-title">
		//			<a href="${this.product?.url}">${this.product?.name}</a>
		//		</h3>
		//
		//		${this.product?.subtitle && !this.minimal ?
		//			`<p class="s-product-card-content-subtitle opacity-80">${this.product?.subtitle}</p>`
		//		: ``}
		//	</div>
		//
		//	${this.product?.donation && !this.minimal && !this.fullImage ?
		//			`<salla-progress-bar donation=${JSON.stringify(this.product?.donation)}></salla-progress-bar>
		//
		//	<div class="s-product-card-donation-input">
		//		${this.product?.donation?.can_donate ?
		//			`<label for="donation-amount-${this.product.id}">${this.donationAmount} <span>*</span></label>
		//
		//		  <input
		//			type="text"
		//			onInput="${e => {
		//					salla.helpers.inputDigitsOnly(e.target);
		//					this.addBtn.donatingAmount = (e.target).value;
		//				}}"
		//			id="donation-amount-${this.product.id}"
		//			name="donating_amount"
		//			class="s-form-control"
		//			placeholder="${this.donationAmount}" />`
		//				: ``}
		//	</div>`
		//		: ''}
		//
		//	<div class="s-product-card-content-sub ${this.isSpecial ? 's-product-card-content-extra-padding' : ''}">
		//		${this.product?.donation?.can_donate ? '' : this.getProductPrice()}
		//		${this.product?.rating?.stars ? `
		//			<div class="s-product-card-rating">
		//				<i class="sicon-star2 before:text-orange-300"></i>
		//				<span>${this.product.rating.stars}</span>
		//			</div>`
		//			: ``}
		//	</div>
		//
		//	${this.isSpecial && this.product.discount_ends
		//		? `<salla-count-down date="${this.formatDate(this.product.discount_ends)}" end-of-day=${true} boxed=${true} labeled=${true} />`
		//		: ``}
		//
		//
		//	${!this.hideAddBtn ?
		//		`<div class="s-product-card-content-footer gap-2">
		//			<salla-add-product-button width="wide"
		//				class="no-background"
		//				product-id="${this.product.id}"
		//				product-status="${this.product.status}"
		//				product-type="${this.product.type}"
		//			>
		//				${this.product.status == 'sale' ?
		//					`<i class="text-base sicon-${this.product.type == 'booking' ? 'calendar-time' : 'shopping-bag'}"></i>` : ``
		//				}
		//				<span>${this.product.add_to_cart_label ? this.product.add_to_cart_label : this.getAddButtonLabel()}</span>
		//			</salla-add-product-button>
		//
		//			${this.horizontal || this.fullImage ?
		//				`<salla-button 
		//					shape="icon" 
		//					color="dark" 
		//					id="card-wishlist-btn-${this.product.id}-horizontal"
		//					aria-label="Add or remove to wishlist"
		//					class="${this.isInWishlist ? 's-product-card-wishlist-added pulse-anime' : 'not-added un-favorited'}"
		//					onclick="salla.wishlist.toggle(${this.product.id})"
		//					data-id="${this.product.id}"
		//				>
		//					<i class="sicon-heart"></i> 
		//				</salla-button>`
		//			: ``}
		//		</div>`
		//		: ``}
		//      </div>
		//    `

		this.querySelectorAll('[name="donating_amount"]').forEach((element) => {
			element.addEventListener('input', (e) => {
				e.target
					.closest(".s-product-card-content")
					.querySelector("salla-add-product-button")
					.setAttribute("donating-amount", e.target.value);
			});
		})

		document.lazyLoadInstance?.update(this.querySelectorAll('.lazy'));

		if (this.product?.quantity && this.isSpecial) {
			// this.initCircleBar();
		}
	}
}

customElements.define('custom-salla-product-card', ProductCard);
