import { ci as require_jsx_runtime } from "./shared-home-SqCEv5dE.js";
import { t as Reviews } from "./testimonials-DOqAAo3z.js";
import { T as Route } from "./router-qySiprZ6.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/.twilight/reviews.tsx?tsr-split=component
/**
* Reviews route configuration.
* Loads page data via loader and renders the Reviews component.
*/
var import_jsx_runtime = require_jsx_runtime();
/**
* Reviews page component.
* Uses Route.useLoaderData() to access the data loaded by the route loader,
* following React best practices for data fetching in route components.
*/
function ReviewsComponent() {
	const data = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews.Component, { ...data });
}
//#endregion
export { ReviewsComponent as component };
