import { ci as require_jsx_runtime } from "./shared-home-SqCEv5dE.js";
import { b as Route, n as ProductPage } from "./router-qySiprZ6.js";
//#region app/routes/$slug.p$id.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function ProductComponent() {
	const data = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductPage, { ...data }, data.product.id);
}
//#endregion
export { ProductComponent as component };
