import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { ci as require_jsx_runtime, li as require_react, sn as L } from "./shared-home-v6c5Y3is.js";
import { t as LazyCustomerLayout } from "./chunk-B3EOUBP3-CDXPxMGH.js";
//#region node_modules/.pnpm/@salla.sa+twilight-components-react@3.0.0-beta.1_@salla.sa+twilight-components@3.0.0-be_b0c7742e0336882f3df5073cd2302776/node_modules/@salla.sa/twilight-components-react/dist/components/salla-loyalty-points-history.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var SallaLoyaltyPointsHistoryElement_runtime = typeof HTMLElement !== "undefined" ? HTMLElement : class {};
var defineSallaLoyaltyPointsHistory_runtime = () => {};
var SallaLoyaltyPointsHistory = /*@__PURE__*/ L({
	tagName: "salla-loyalty-points-history",
	elementClass: SallaLoyaltyPointsHistoryElement_runtime,
	react: import_react.default,
	events: {},
	defineCustomElement: defineSallaLoyaltyPointsHistory_runtime
});
//#endregion
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/LoyaltyPointsPage-6LJF7ZFO.js
var import_jsx_runtime = require_jsx_runtime();
function LoyaltyPointsPage({ page }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyCustomerLayout, {
		page,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SallaLoyaltyPointsHistory, {})
	});
}
//#endregion
export { LoyaltyPointsPage };
