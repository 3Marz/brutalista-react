import { ci as require_jsx_runtime } from "./shared-home-v6c5Y3is.js";
import { b as Route, n as ProductPage } from "./router-C6ew0-bF.js";
//#region app/routes/$slug.p$id.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function ProductComponent() {
	const data = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductPage, { ...data }, data.product.id);
}
//#endregion
export { ProductComponent as component };
