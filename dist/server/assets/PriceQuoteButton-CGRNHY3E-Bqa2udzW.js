import { Dt as SallaButton, ci as require_jsx_runtime, un as useTranslation } from "./shared-home-v6c5Y3is.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/PriceQuoteButton-CGRNHY3E.js
var import_jsx_runtime = require_jsx_runtime();
var handlePriceQuote = async () => {
	await window.salla?.cart.api.priceQuote?.();
};
function PriceQuoteButton() {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SallaButton, {
		id: "request-price-quote-btn",
		className: "btn--oval btn--md",
		fill: "outline",
		onClick: handlePriceQuote,
		children: t("pages.cart.request_price_quote", "Request for Quotation")
	});
}
//#endregion
export { PriceQuoteButton };
