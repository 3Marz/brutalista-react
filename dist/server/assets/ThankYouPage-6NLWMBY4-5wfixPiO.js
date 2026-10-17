import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { Bt as HookSlot, Dt as SallaButton, ci as require_jsx_runtime, li as require_react, mr as onSallaEvent, nt as usePageConfig, sn as L, tr as useTwilight, un as useTranslation, vt as Link } from "./shared-home-SqCEv5dE.js";
import { t as SallaOrderBranch } from "./salla-order-branch-BTUlvASM.js";
import { t as useCopyToClipboard } from "./vendor-hooks-3KZb8oW5.js";
//#region node_modules/.pnpm/@salla.sa+twilight-components-react@3.0.0-beta.1_@salla.sa+twilight-components@3.0.0-be_b0c7742e0336882f3df5073cd2302776/node_modules/@salla.sa/twilight-components-react/dist/components/salla-next-order-coupon.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var SallaNextOrderCouponElement_runtime = typeof HTMLElement !== "undefined" ? HTMLElement : class {};
var defineSallaNextOrderCoupon_runtime = () => {};
var SallaNextOrderCoupon = /*@__PURE__*/ L({
	tagName: "salla-next-order-coupon",
	elementClass: SallaNextOrderCouponElement_runtime,
	react: import_react.default,
	events: {},
	defineCustomElement: defineSallaNextOrderCoupon_runtime
});
//#endregion
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/ThankYouPage-6NLWMBY4.js
var import_jsx_runtime = require_jsx_runtime();
var confetti_default = "./confetti-Y43LHJMI.svg";
var EMPTY_MESSAGES = [];
function ThankYouPage({ page, order, thank_you_title, messages = EMPTY_MESSAGES }) {
	const { store } = useTwilight();
	const { t } = useTranslation();
	usePageConfig(page);
	const title = thank_you_title ?? t("pages.thank_you.hero_title", "Thank you for shopping with us! 😊");
	const [invoiceSent, setInvoiceSent] = (0, import_react.useState)(order?.email_sent ?? false);
	const [invoiceMessage, setInvoiceMessage] = (0, import_react.useState)(null);
	const [, copyToClipboard] = useCopyToClipboard();
	(0, import_react.useEffect)(() => {
		const handleInvoiceSent = (res) => {
			setInvoiceMessage(res.data?.message || t("pages.thank_you.invoice_sent_success", "Invoice sent successfully"));
			setInvoiceSent(true);
		};
		return onSallaEvent("order::invoice.sent", handleInvoiceSent);
	}, [t]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookSlot, { name: "thank-you:start" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-52 -mb-52 w-full bg-primary rtl:right-0 ltr:left-0 relative -z-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "text-primary absolute top-full",
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: "0 0 1440 320",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					className: "fill-current",
					fillOpacity: "1",
					d: "M0,96L120,112C240,128,480,160,720,165.3C960,171,1200,149,1320,138.7L1440,128L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "w-full py-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "list-reset flex items-center text-sm text-primary-reverse",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "fix-align text-primary-reverse",
								children: t("common.titles.home", "Home")
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "sicon-keyboard_arrow_left mx-2" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "fix-align",
								children: title
							}) })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-4 md:p-8 rounded-md mb-6 md:mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center pt-16 pb-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: confetti_default,
									alt: title,
									className: "size-[140px] mb-8"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-bold text-lg mb-2.5",
									children: title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-500 max-w-xs text-center text-sm leading-6 mb-2.5",
									children: t("pages.thank_you.description", "Your order has been received and will be reviewed and confirmed shortly.")
								}),
								order && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-gray-500 max-w-xs text-center text-sm leading-6 mb-6",
									children: [
										t("pages.thank_you.order_id_label", "Order ID"),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SallaButton, {
											className: "relative",
											onClick: () => copyToClipboard(String(order.reference_id)),
											color: "dark",
											shape: "link",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["#", order.reference_id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "copy-icon sicon-swap-stroke pointer-events-none rtl:mr-1 ltr:ml-1" })]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: `/account/orders/${order.id}`,
									className: "bg-primary text-white text-sm font-bold h-10 px-4 rounded-md flex items-center justify-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "sicon-newspaper rtl:ml-1 ltr:mr-1" }), t("pages.thank_you.view_order_details", "View Order Details")]
								})] })
							]
						}),
						order?.instructions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
							className: "article article--main article--small text-center",
							dangerouslySetInnerHTML: { __html: order.instructions ?? "" }
						}),
						messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col items-center pt-1 pb-10 justify-start rtl:space-x-reverse space-x-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold",
								children: message
							})
						}, message)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookSlot, { name: "thank-you:items.start" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookSlot, { name: "thank-you:items.end" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SallaNextOrderCoupon, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SallaOrderBranch, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:flex rtl:space-x-reverse lg:space-x-8",
					children: [invoiceSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "duration-500 hover:shadow-default flex-1 bg-white p-8 rounded-md mb-6 md:mb-10 flex flex-col items-center justify-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-gray-100 rounded-icon w-12 h-12 mb-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "sicon-newspaper-alt text-xl" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm mb-2.5",
								children: t("pages.thank_you.email_sent_to", "Email sent to")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "text-sm",
								children: order?.customer?.email
							}),
							invoiceMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-green-600 mt-2",
								children: invoiceMessage
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "invoice-form",
						className: invoiceMessage ? "thankyou-block sent" : "thankyou-block",
						children: invoiceMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-gray-100 rounded-icon w-12 h-12 mb-2.5 mx-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "sicon-newspaper-alt text-xl" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								dangerouslySetInnerHTML: { __html: invoiceMessage }
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-gray-100 rounded-icon w-12 h-12 mb-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "sicon-newspaper-alt text-xl" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm mb-2.5",
								children: t("pages.thank_you.resend_invoice", "Resend invoice email")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
								onSubmit: (e) => {
									e.preventDefault();
									window.salla?.form.onSubmit("order.sendInvoice", e);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex max-w-3xl w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										className: "form-input rtl:rounded-l-none ltr:rounded-r-none rtl:border-l-0 ltr:border-r-0 !w-[160px] sm:!w-[220px]",
										placeholder: "your@email.com",
										required: true,
										name: "email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SallaButton, {
										type: "submit",
										loaderPosition: "center",
										className: "rtl:rounded-r-none ltr:rounded-l-none lg:w-24 h-10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "btn__text",
											children: t("pages.thank_you.send", "Send")
										})
									})]
								})
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "thankyou-block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-gray-100 rounded-icon w-12 h-12 mb-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "sicon-mail-letter text-xl" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm mb-2.5",
								children: t("pages.thank_you.support", "Support")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex rtl:space-x-reverse space-x-6",
								children: [store.contacts.mobile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm unicode flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "sicon-phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `tel:${store.contacts.mobile}`,
										className: "hover:text-primary transition",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
											className: "unicode mx-1.5",
											children: store.contacts.mobile
										})
									})]
								}), store.contacts.whatsapp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm unicode flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "sicon-whatsapp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `https://wa.me/${store.contacts.whatsapp.replace(/[\s+-]/g, "")}`,
										className: "hover:text-primary transition",
										target: "_blank",
										rel: "noopener noreferrer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
											className: "unicode mx-1.5",
											children: store.contacts.whatsapp
										})
									})]
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookSlot, { name: "thank-you:end" })
			]
		})
	] });
}
//#endregion
export { ThankYouPage };
