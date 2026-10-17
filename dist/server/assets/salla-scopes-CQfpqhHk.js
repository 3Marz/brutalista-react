import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { Ht as withDeferredHydration, li as require_react, sn as L } from "./shared-home-SqCEv5dE.js";
//#region node_modules/.pnpm/@salla.sa+twilight-components-react@3.0.0-beta.1_@salla.sa+twilight-components@3.0.0-be_b0c7742e0336882f3df5073cd2302776/node_modules/@salla.sa/twilight-components-react/dist/components/salla-scopes.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var SallaScopesElement_runtime = class extends (typeof HTMLElement !== "undefined" ? HTMLElement : class {}) {
	get close() {
		return true;
	}
	get handleSubmit() {
		return true;
	}
	get open() {
		return true;
	}
	get searchDisplayLimit() {
		return true;
	}
	get selection() {
		return true;
	}
};
var defineSallaScopes_runtime = () => {};
var SallaScopesCore = /*@__PURE__*/ L({
	tagName: "salla-scopes",
	elementClass: SallaScopesElement_runtime,
	react: import_react.default,
	events: {},
	defineCustomElement: defineSallaScopes_runtime
});
SallaScopesCore.displayName = "SallaScopesCore";
var SallaScopes = withDeferredHydration(SallaScopesCore, "SallaScopes");
//#endregion
export { SallaScopes };
