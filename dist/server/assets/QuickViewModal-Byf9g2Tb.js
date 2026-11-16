import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { B as useWishlist, Ct as LazyCurrencySymbol, E as WishlistHeartButton, L as Modal, P as product, ci as require_jsx_runtime, jt as SallaSlider, li as require_react, lr as getActiveCurrency, un as useTranslation, vt as Link, xt as Image, zt as SallaAddProductButton } from "./shared-home-v6c5Y3is.js";
import { C as SallaInstallment, b as SallaProductOptionsCore, m as SallaSocialShare } from "./shared-product-DGHTj6sF.js";
import "./router-C6ew0-bF.js";
//#region app/components/product/QuickViewModal.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* Quick view, reimplemented from the Twig theme's `<quick-view>` custom element
* (`src/assets/js/partials/quick-view.js`) on top of the engine's controlled
* `Modal`. It fetches the product details itself (`product.find`, same endpoint
* and `with[]` list the Twig called through `salla.product.getDetails`), then
* renders the gallery, price, options and add-to-cart in one panel.
*
* Mounted lazily by `QuickViewHost`; the fetch starts the moment it mounts.
*/
function QuickViewModal({ productId, onClose }) {
	const { t } = useTranslation();
	const [product$1, setProduct] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [attempt, setAttempt] = (0, import_react.useState)(0);
	const requestRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const request = ++requestRef.current;
		let active = true;
		setStatus("loading");
		setProduct(null);
		product.find(String(productId)).then((result) => {
			if (!active || request !== requestRef.current) return;
			if (!result) {
				setStatus("error");
				return;
			}
			setProduct(result);
			setStatus("ready");
		}).catch(() => {
			if (!active || request !== requestRef.current) return;
			setStatus("error");
		});
		return () => {
			active = false;
		};
	}, [productId, attempt]);
	const retry = (0, import_react.useCallback)(() => setAttempt((value) => value + 1), []);
	const dialogLabel = product$1?.name ?? t("pages.products.quick_view", "Quick view");
	(0, import_react.useEffect)(() => {
		const dialog = document.querySelector(".quick-view-modal")?.parentElement;
		if (!dialog) return;
		dialog.setAttribute("aria-label", dialogLabel);
		return () => dialog.removeAttribute("aria-label");
	}, [dialogLabel]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		isOpen: true,
		onClose,
		size: "full",
		position: "center",
		className: "quick-view-modal !max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "quick-view__close",
			onClick: onClose,
			"aria-label": t("common.close", "Close"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: "sicon-cancel",
				"aria-hidden": "true"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "quick-view",
			children: [
				status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewLoading, { label: t("pages.products.quick_view_loading", "Loading product...") }),
				status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewError, {
					message: t("pages.products.quick_view_error", "Could not load the product. Please try again."),
					retryLabel: t("common.elements.try_again", "Try again"),
					onRetry: retry
				}),
				status === "ready" && product$1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewContent, { product: product$1 })
			]
		})]
	});
}
function QuickViewLoading({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "quick-view__loading",
		role: "status",
		"aria-live": "polite",
		"aria-label": label,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "quick-view__skeleton aspect-square" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "quick-view__skeleton h-6 w-2/3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "quick-view__skeleton h-4 w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "quick-view__skeleton h-4 w-5/6" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "quick-view__skeleton mt-2 h-11 w-full" })
			]
		})]
	});
}
function QuickViewError({ message, retryLabel, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "quick-view__error",
		role: "alert",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: message }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "quick-view__retry",
			onClick: onRetry,
			children: retryLabel
		})]
	});
}
function QuickViewContent({ product }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "quick-view__gallery",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewGallery, { product })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "quick-view__details",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewActions, { product }),
			product.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: product.category.url,
				className: "text-lg text-text-color opacity-60",
				children: product.category.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: product.url,
				className: "text-2xl font-bold text-text-color hover:text-primary",
				children: product.name
			}),
			product.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
				className: "article article--main quick-view__description",
				dangerouslySetInnerHTML: { __html: product.description }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewForm, { product })
		]
	})] });
}
function QuickViewActions({ product }) {
	const { t } = useTranslation();
	const wishlist = useWishlist();
	const productId = Number(product.id);
	const inWishlist = wishlist.has(productId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "quick-view__actions",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SallaSocialShare, {
			className: "inline-flex",
			url: product.url,
			urlName: product.name,
			"aria-label": t("pages.wishlist.share", "Share")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistHeartButton, {
			productId,
			color: inWishlist ? "danger" : "dark",
			ariaLabel: t("pages.products.add_to_wishlist", "Add to wishlist"),
			className: `btn--wishlist animated ${inWishlist ? "is-added" : "not-added"}`,
			onClick: () => {
				wishlist.toggle(productId);
			}
		})]
	});
}
function imageKey(image, index) {
	return String(image.id ?? image.three_d_image_url ?? image.video_url ?? image.url ?? index);
}
function QuickViewGallery({ product }) {
	const { t } = useTranslation();
	const images = (0, import_react.useMemo)(() => product.images && product.images.length > 0 ? product.images : product.image?.url ? [product.image] : [], [product.images, product.image]);
	if (images.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "quick-view__image-placeholder",
		"aria-hidden": "true"
	});
	const hasMany = images.length > 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SallaSlider, {
		id: `quick-view-slider-${product.id}`,
		className: "details-slider modal-slider image-slider",
		type: "thumbs",
		loop: false,
		autoHeight: true,
		pagination: hasMany,
		showThumbsControls: false,
		listenToThumbnailsOption: true,
		sliderConfig: {
			watchOverflow: true,
			autoHeight: true
		},
		thumbsConfig: {
			slidesPerView: "auto",
			spaceBetween: 8
		},
		children: [
			product.promotion_title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "promotion-title",
				children: product.promotion_title
			}),
			product.calories ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute end-4 top-4 z-[3] flex h-20 w-20 flex-col items-center justify-center rounded-neo border-2 border-bc bg-base-50 shadow-neo md:h-24 md:w-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xl leading-none font-bold text-red-500",
					children: product.calories
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-my-gray",
					children: t("pages.products.calories", "Calories")
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				slot: "items",
				children: images.map((image, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "swiper-slide quick-view__slide",
					"data-img-id": image.id,
					"data-slid-index": index,
					children: image.three_d_image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("model-viewer", {
						style: { minHeight: "420px" },
						className: "model-entry h-full w-full",
						loading: "eager",
						"camera-controls": true,
						"touch-action": "pan-y",
						"auto-rotate": true,
						poster: image.url || void 0,
						src: image.three_d_image_url,
						"shadow-intensity": "1",
						alt: image.alt || product.name
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
						src: image.url,
						alt: image.alt || product.name,
						className: "h-full w-full object-cover",
						aspectRatio: "1/1",
						priority: index === 0,
						noWrapper: true
					})
				}, imageKey(image, index)))
			}),
			hasMany && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				slot: "thumbs",
				className: "hidden md:block",
				children: images.map((image, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "slide--one-fourth",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
						src: image.url,
						alt: image.alt || "",
						className: "h-full w-full object-cover",
						noWrapper: true
					})
				}, imageKey(image, index)))
			})
		]
	});
}
function QuickViewPrice({ product }) {
	const { t } = useTranslation();
	const currency = getActiveCurrency(product.currency);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "price-wrapper flex items-center gap-4 whitespace-nowrap py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `price_is_on_sale space-x-2 whitespace-nowrap rtl:space-x-reverse ${product.is_on_sale ? "" : "hidden"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "total-price inline-block text-xl font-bold text-red-800",
				children: [
					product.sale_price,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyCurrencySymbol, { currency })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "before-price text-my-gray line-through",
				children: [
					product.regular_price,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyCurrencySymbol, { currency })
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `starting-or-normal-price gap-4 ${product.is_on_sale ? "hidden" : "flex"}`,
			children: [product.starting_price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "starting-price-title",
				children: t("pages.products.starting_price", "Starting from")
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "total-price inline-block text-xl font-bold",
				children: [
					product.starting_price ?? product.price,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyCurrencySymbol, { currency })
				]
			})]
		})]
	});
}
/** Out-of-stock products show the availability control when the store offers it. */
function quickViewAddStatus(product) {
	if (product.status === "out-and-notify") return "out-and-notify";
	if (product.is_out_of_stock || product.status === "out" || product.status === "hidden") return product.notify_availability ? "out-and-notify" : "out";
	return "sale";
}
function notifyAvailabilityProps(product) {
	const notify = product.notify_availability;
	if (!notify) return {};
	return {
		channels: (notify.channels ?? []).join(","),
		...notify.subscribed ? { isSubscribed: true } : {},
		...notify.subscribed_options ? { subscribedOptions: JSON.stringify(notify.subscribed_options) } : {},
		...notify.options ? { notifyOptionsAvailability: true } : {}
	};
}
/** Submits the quick-view form through the SDK, like the Twig `salla.form.onSubmit`
*  and the product page: the form submit path is what carries the selected
*  options, donation amount and quantity (the quick-add path sends only the id). */
function handleQuickViewSubmit(event) {
	event.preventDefault();
	const button = event.currentTarget.querySelector(".quick-view__add")?.querySelector("salla-button");
	button?.load?.();
	window.setTimeout(() => button?.stop?.(), 8e3);
	window.salla?.form.onSubmit("cart.addItem", event);
}
function QuickViewForm({ product }) {
	const { t } = useTranslation();
	const options = product.options ?? [];
	const basePrice = product.base_currency_price;
	const installmentPrice = basePrice ? String(typeof basePrice === "object" ? basePrice.amount : basePrice) : "";
	const optionsRef = (0, import_react.useCallback)((el) => {
		if (!product.options?.length) return;
		el?.setOptionsData?.(product.options);
	}, [product.options]);
	const [optionsReady, setOptionsReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!options.length) {
			setOptionsReady(true);
			return;
		}
		const salla = window.salla;
		const previousPageId = salla?.config.get("page.id");
		salla?.config.set("page.id", product.id);
		setOptionsReady(true);
		return () => {
			if (salla && String(salla.config.get("page.id")) === String(product.id)) salla.config.set("page.id", previousPageId);
		};
	}, [options.length, product.id]);
	const addLabel = product.add_to_cart_label || (product.has_preorder_campaign ? t("pages.products.pre_order_now", "Pre-order now") : product.status === "sale" && product.type === "booking" ? t("pages.cart.book_now", "Book now") : product.status === "sale" ? t("pages.cart.add_to_cart", "Add to Cart") : product.type !== "donating" ? t("pages.products.out_of_stock", "Out of Stock") : t("pages.products.donation_exceed", "Donation amount exceeded"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "quick-view__form product-form",
		encType: "multipart/form-data",
		method: "post",
		onSubmit: handleQuickViewSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "hidden",
				name: "id",
				value: product.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewPrice, { product }),
			optionsReady && options.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SallaProductOptionsCore, {
				ref: optionsRef,
				options: JSON.stringify(options),
				productId: product.id,
				productAvailable: !product.is_out_of_stock,
				className: "quick-view__options",
				noPadding: true
			}, String(product.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SallaAddProductButton, {
				width: "wide",
				className: "quick-view__add",
				productId: product.id,
				productStatus: quickViewAddStatus(product),
				productType: product.type,
				loaderPosition: "end",
				type: "submit",
				hasPreOrder: Boolean(product.has_preorder_campaign),
				...notifyAvailabilityProps(product),
				children: [product.status === "sale" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: `text-base mx-2 sicon-${product.type === "booking" ? "calendar-time" : "shopping-bag"}` }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: addLabel })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SallaInstallment, { price: installmentPrice })
		]
	});
}
//#endregion
export { QuickViewModal };
