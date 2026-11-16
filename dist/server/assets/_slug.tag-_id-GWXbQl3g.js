import { ci as require_jsx_runtime } from "./shared-home-v6c5Y3is.js";
import { t as ProductListing } from "./product-listing-Cu-8oASz.js";
import { y as Route } from "./router-C6ew0-bF.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/.twilight/$slug.tag-$id.tsx?tsr-split=component
/**
* ProductListing route configuration.
* Loads page data via loader and renders the ProductListing component.
*/
var import_jsx_runtime = require_jsx_runtime();
/**
* ProductListing page component.
* Uses Route.useLoaderData() to access the data loaded by the route loader,
* following React best practices for data fetching in route components.
*/
function ProductListingComponent() {
	const data = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductListing.Component, { ...data });
}
//#endregion
export { ProductListingComponent as component };
