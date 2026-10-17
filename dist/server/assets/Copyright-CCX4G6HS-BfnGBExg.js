import { ci as require_jsx_runtime, un as useTranslation, vt as Link } from "./shared-home-SqCEv5dE.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/Copyright-CCX4G6HS.js
var import_jsx_runtime = require_jsx_runtime();
function Copyright({ storeName = "" }) {
	const { t } = useTranslation();
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		t("blocks.footer.copyright", "Copyright"),
		" | ",
		year,
		" ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "hover:text-primary",
			children: storeName
		}),
		" "
	] });
}
//#endregion
export { Copyright };
