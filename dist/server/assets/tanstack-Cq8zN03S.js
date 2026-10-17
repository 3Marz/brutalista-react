import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { Ar as resolveAddressedStore, Mr as resolveRequestVersionId, Tr as extractTokenFromCookies, ci as require_jsx_runtime, dt as rootHead, jr as resolveRequestScope, li as require_react, qr as runWithTwilightContext, xr as STORE_BASE_HEADER } from "./shared-home-SqCEv5dE.js";
import { _ as useRouter, a as Asset, i as useTags, o as useRouterState } from "./vendor-router-26ypu02w.js";
import { t as createMiddleware } from "./createMiddleware-bHELZO7i.js";
import { n as tsrStartManifest } from "./_tanstack-start-manifest_v-D6DGM9t_.js";
import { n as requestHostOf } from "./chunk-QTH6GGUH-BsBj8JgF.js";
import "./shared-product-DV8pwwqf.js";
//#endregion
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/tanstack.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var subscribeNothing = () => () => {};
function ThemeStylesheet({ href, critical = {} }) {
	const routeId = useRouterState({ select: (state) => state.matches.find((match) => Object.hasOwn(critical, match.routeId))?.routeId });
	const [criticalRoute] = (0, import_react.useState)(routeId);
	const hydrated = (0, import_react.useSyncExternalStore)(subscribeNothing, () => true, () => false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		criticalRoute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
			href: "salla-critical-css",
			precedence: "critical",
			children: critical[criticalRoute]
		}),
		(!criticalRoute || hydrated) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			id: "salla-theme-css",
			rel: "stylesheet",
			href,
			precedence: "default"
		}),
		criticalRoute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("noscript", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			rel: "stylesheet",
			href
		}) })
	] });
}
function ThemeHeadContent() {
	const tags = useTags();
	const nonce = useRouter().options.ssr?.nonce;
	return tags.filter((tag) => !(tag.tag === "link" && tag.attrs?.rel === "modulepreload")).map((tag) => /* @__PURE__ */ (0, import_react.createElement)(Asset, {
		...tag,
		key: `tsr-meta-${JSON.stringify(tag)}`,
		nonce
	}));
}
var twilightMiddleware = (options) => {
	const cookieName = options?.cookieName ?? "token";
	return createMiddleware().server(({ request, next }) => {
		const cookieHeader = request.headers.get("Cookie");
		const authToken = extractTokenFromCookies(cookieHeader, cookieName);
		const scope = resolveRequestScope(request.url, cookieHeader);
		const requestHost = requestHostOf(request);
		const { storeId, storeBase, storeBaseFollowsLocale } = resolveAddressedStore(request.url, cookieHeader, requestHost, request.headers.get(STORE_BASE_HEADER));
		const versionId = resolveRequestVersionId(request.url, cookieHeader, requestHost);
		return runWithTwilightContext({
			authToken,
			scope,
			storeId,
			storeBase,
			storeBaseFollowsLocale,
			versionId,
			requestHost
		}, () => next({ context: { authToken } }));
	});
};
var CRITICAL_ASSETS = [
	{
		rel: "preconnect",
		href: "https://api.salla.dev"
	},
	{
		rel: "preconnect",
		href: "https://cdn.salla.sa"
	},
	{
		rel: "preconnect",
		href: "https://cdn.assets.salla.network",
		crossOrigin: "anonymous"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous"
	}
];
function extractLocale(url) {
	return url.match(/^\/([a-z]{2})(\/|$)/)?.[1];
}
function buildLinkHeader(link) {
	const href = link.href;
	const rel = link.rel;
	if (!href || !rel) return null;
	if (rel === "stylesheet") {
		if (link.media === "print") return null;
		return `<${href}>; rel=preload; as=style`;
	}
	if (rel === "preload") {
		const asType = link.as;
		if (!asType) return null;
		const parts = [
			`<${href}>`,
			"rel=preload",
			`as=${asType}`
		];
		if (asType === "font" || link.crossOrigin) parts.push("crossorigin");
		return parts.join("; ");
	}
	if (rel === "modulepreload") return `<${href}>; rel=modulepreload`;
	return null;
}
var earlyHintsMiddleware = () => {
	let cachedManifestPaths = null;
	return createMiddleware().server(async ({ request, next }) => {
		const response = await next();
		const accept = request.headers.get("Accept") ?? "";
		if (!accept.includes("text/html") && accept !== "*/*") return response;
		if (!(response instanceof Response)) return response;
		const linkHeaders = [];
		try {
			const locale = extractLocale(new URL(request.url).pathname);
			if (locale) {
				const links = rootHead({ params: { locale } }).links ?? [];
				for (const link of links) {
					const header = buildLinkHeader(link);
					if (header) linkHeaders.push(header);
				}
			}
		} catch (e) {
			console.warn("[earlyHints] rootHead failed:", e instanceof Error ? e.message : e);
			for (const asset of CRITICAL_ASSETS) {
				const co = "crossOrigin" in asset ? asset.crossOrigin : void 0;
				linkHeaders.push(`<${asset.href}>; rel=${asset.rel}${co ? "; crossorigin" : ""}`);
			}
		}
		if (!cachedManifestPaths) try {
			const rootAssets = tsrStartManifest().routes["__root__"]?.assets ?? [];
			const seen = /* @__PURE__ */ new Set();
			cachedManifestPaths = [];
			for (const asset of rootAssets) if (asset.tag === "link" && asset.attrs?.href?.endsWith(".css")) {
				if (!seen.has(asset.attrs.href)) {
					seen.add(asset.attrs.href);
					cachedManifestPaths.push(asset.attrs.href);
				}
			}
		} catch (e) {
			console.warn("[earlyHints] tsrStartManifest failed:", e instanceof Error ? e.message : e);
		}
		if (cachedManifestPaths) for (const href of cachedManifestPaths) linkHeaders.push(`<${href}>; rel=preload; as=style`);
		if (linkHeaders.length === 0) {
			console.warn("[earlyHints] no critical assets found — no Link headers added");
			return response;
		}
		const headers = new Headers(response.headers);
		for (const linkHeader of linkHeaders) headers.append("Link", linkHeader);
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers
		});
	});
};
//#endregion
export { twilightMiddleware as i, ThemeStylesheet as n, earlyHintsMiddleware as r, ThemeHeadContent as t };
