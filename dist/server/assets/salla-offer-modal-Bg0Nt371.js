import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { Ht as withDeferredHydration, li as require_react, sn as L } from "./shared-home-v6c5Y3is.js";
//#region node_modules/.pnpm/@salla.sa+twilight-components-react@3.0.0-beta.1_@salla.sa+twilight-components@3.0.0-be_b0c7742e0336882f3df5073cd2302776/node_modules/@salla.sa/twilight-components-react/dist/components/salla-offer-modal.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var SallaOfferModalElement_runtime = class extends (typeof HTMLElement !== "undefined" ? HTMLElement : class {}) {
	get open() {
		return true;
	}
	get showOffer() {
		return true;
	}
};
var defineSallaOfferModal_runtime = () => {};
var SallaOfferModalCore = /*@__PURE__*/ L({
	tagName: "salla-offer-modal",
	elementClass: SallaOfferModalElement_runtime,
	react: import_react.default,
	events: {},
	defineCustomElement: defineSallaOfferModal_runtime
});
SallaOfferModalCore.displayName = "SallaOfferModalCore";
var SallaOfferModal = withDeferredHydration(SallaOfferModalCore, "SallaOfferModal");
//#endregion
export { SallaOfferModal };
