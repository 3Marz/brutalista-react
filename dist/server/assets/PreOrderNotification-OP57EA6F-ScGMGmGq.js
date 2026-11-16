import { ci as require_jsx_runtime, un as useTranslation } from "./shared-home-v6c5Y3is.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/PreOrderNotification-OP57EA6F.js
var import_jsx_runtime = require_jsx_runtime();
function PreOrderNotification() {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("salla-alert", {
		className: "mb-5",
		message: t("pages.cart.pre_order_shipping", "Your order will be shipped when the pre-order product becomes available in the store."),
		variant: "info"
	});
}
//#endregion
export { PreOrderNotification };
