import { ci as require_jsx_runtime } from "./shared-home-v6c5Y3is.js";
import { k as Route, r as CartPage } from "./router-C6ew0-bF.js";
//#region app/routes/cart.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function CartComponent() {
	const data = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartPage, { ...data });
}
//#endregion
export { CartComponent as component };
