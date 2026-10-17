import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { Bt as HookSlot, Ht as withDeferredHydration, St as LazyBreadcrumb, ci as require_jsx_runtime, li as require_react, sn as L } from "./shared-home-SqCEv5dE.js";
//#region node_modules/.pnpm/@salla.sa+twilight-components-react@3.0.0-beta.1_@salla.sa+twilight-components@3.0.0-be_b0c7742e0336882f3df5073cd2302776/node_modules/@salla.sa/twilight-components-react/dist/components/salla-loyalty-program.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var SallaLoyaltyProgramElement_runtime = typeof HTMLElement !== "undefined" ? HTMLElement : class {};
var defineSallaLoyaltyProgram_runtime = () => {};
var SallaLoyaltyProgramCore = /*@__PURE__*/ L({
	tagName: "salla-loyalty-program",
	elementClass: SallaLoyaltyProgramElement_runtime,
	react: import_react.default,
	events: {},
	defineCustomElement: defineSallaLoyaltyProgram_runtime
});
SallaLoyaltyProgramCore.displayName = "SallaLoyaltyProgramCore";
var SallaLoyaltyProgram = withDeferredHydration(SallaLoyaltyProgramCore, "SallaLoyaltyProgram");
//#endregion
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/LoyaltyPage-PBT32LV7.js
var import_jsx_runtime = require_jsx_runtime();
function LoyaltyPage({ page }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookSlot, { name: "loyalty:start" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mb-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyBreadcrumb, { page }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SallaLoyaltyProgram, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookSlot, { name: "loyalty:end" })
	] });
}
//#endregion
export { LoyaltyPage };
