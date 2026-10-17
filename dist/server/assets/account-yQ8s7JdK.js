import { ci as require_jsx_runtime } from "./shared-home-SqCEv5dE.js";
import { l as useMatches, u as Outlet } from "./vendor-router-26ypu02w.js";
import { t as LazyCustomerLayout } from "./chunk-B3EOUBP3-BX2NQN5S.js";
import "./router-qySiprZ6.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/.twilight/account.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function AccountLayoutComponent() {
	const page = useMatches().reduceRight((found, m) => found ?? (m.loaderData?.page ? m.loaderData.page : null), null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyCustomerLayout, {
		page,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
//#endregion
export { AccountLayoutComponent as component };
