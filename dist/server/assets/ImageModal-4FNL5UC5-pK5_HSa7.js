import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { R as Modal, ci as require_jsx_runtime, li as require_react } from "./shared-home-SqCEv5dE.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/ImageModal-4FNL5UC5.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function ModalImage({ src, alt, imgProps }) {
	const [isLoaded, setIsLoaded] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!isLoaded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse bg-gray-200 w-full h-64 rounded" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		className: `max-w-full max-h-[70vh] object-contain ${isLoaded ? "block" : "hidden"}`,
		onLoad: () => setIsLoaded(true),
		...imgProps
	})] });
}
function ImageModal({ isOpen, onClose, src, alt = "", title, imgProps }) {
	if (!src) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		isOpen,
		onClose,
		size: "lg",
		position: "center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal.Header, {
			onClose,
			showCloseButton: true,
			children: title || ""
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal.Body, {
			className: "flex items-center justify-center min-h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalImage, {
				src,
				alt,
				imgProps
			}, src)
		})]
	});
}
//#endregion
export { ImageModal };
