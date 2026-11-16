import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { Ht as withDeferredHydration, li as require_react, sn as L } from "./shared-home-v6c5Y3is.js";
//#region node_modules/.pnpm/@salla.sa+twilight-components-react@3.0.0-beta.1_@salla.sa+twilight-components@3.0.0-be_b0c7742e0336882f3df5073cd2302776/node_modules/@salla.sa/twilight-components-react/dist/components/salla-comments.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var SallaCommentsElement_runtime = class extends (typeof HTMLElement !== "undefined" ? HTMLElement : class {}) {
	get blockTitle() {
		return true;
	}
	get hideBought() {
		return true;
	}
	get hideForm() {
		return true;
	}
	get hideTitle() {
		return true;
	}
	get itemId() {
		return true;
	}
	get loadMoreText() {
		return true;
	}
	get reload() {
		return true;
	}
	get showFormAvatar() {
		return true;
	}
	get sort() {
		return true;
	}
	get testimonials() {
		return true;
	}
	get type() {
		return true;
	}
};
var defineSallaComments_runtime = () => {};
var SallaCommentsCore = /*@__PURE__*/ L({
	tagName: "salla-comments",
	elementClass: SallaCommentsElement_runtime,
	react: import_react.default,
	events: {},
	defineCustomElement: defineSallaComments_runtime
});
SallaCommentsCore.displayName = "SallaCommentsCore";
var SallaComments = withDeferredHydration(SallaCommentsCore, "SallaComments");
//#endregion
export { SallaComments as t };
