import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { ci as require_jsx_runtime, li as require_react } from "./shared-home-v6c5Y3is.js";
import { L as SallaReviews } from "./router-C6ew0-bF.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/Testimonials-MZCVP66E.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var Testimonials = (0, import_react.memo)(function Testimonials2({ data }) {
	const limit = data.limit !== void 0 ? parseInt(String(data.limit), 10) : 10;
	const type = data.type || "store";
	const sort = data.sort || "latest";
	const hideCustomerInfo = data.hide_customer_info ?? false;
	const displayAllUrl = data.display_all_url;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SallaReviews, {
		limit,
		sort,
		type,
		...displayAllUrl ? { displayAllLink: true } : {},
		...hideCustomerInfo ? { hideCustomerInfo: true } : {}
	}) });
});
//#endregion
export { Testimonials };
