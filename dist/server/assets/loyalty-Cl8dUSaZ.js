import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { $r as RouteId, Kn as orUnauthorized, Wr as getTwilightContext, Yn as unauthorized, dr as getAuthToken, ft as buildHreflangAlternates, li as require_react, qn as redirect } from "./shared-home-v6c5Y3is.js";
import { t as loyalty } from "./chunk-IGD4G3SP-DSE28_Ci.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/routes/loyalty.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
async function getProgramOrGoHome(locale) {
	try {
		return await loyalty.get();
	} catch (error) {
		if (error?.response?.status === 400) throw redirect(`/${locale || "ar"}`);
		throw error;
	}
}
async function loyaltyLoader(locale) {
	const data = await getProgramOrGoHome(locale);
	const { i18n } = getTwilightContext();
	return {
		page: {
			slug: RouteId.LOYALTY,
			title: data.name,
			breadcrumbs: [{
				name: i18n.t("common.titles.home"),
				url: "/"
			}, {
				name: i18n.t("common.titles.loyalty_program"),
				url: "/loyalty"
			}]
		},
		loyalty: data
	};
}
async function loyaltyPointsLoader(locale) {
	if (!getAuthToken()) throw unauthorized();
	await orUnauthorized(getProgramOrGoHome(locale));
	const { i18n } = getTwilightContext();
	const title = i18n.t("pages.loyalty_program.loyalty_points");
	return { page: {
		slug: RouteId.CUSTOMER_LOYALTY_POINTS,
		title,
		breadcrumbs: [
			{
				name: i18n.t("common.titles.home"),
				url: "/"
			},
			{
				name: i18n.t("common.titles.profile"),
				url: "/account/profile"
			},
			{
				name: title,
				url: "/loyalty_points"
			}
		]
	} };
}
var LazyLoyaltyPage = (0, import_react.lazy)(() => import("./LoyaltyPage-PBT32LV7-FDp0GnVi.js").then((m) => ({ default: m.LoyaltyPage })));
var LazyLoyaltyPointsPage = (0, import_react.lazy)(() => import("./LoyaltyPointsPage-6LJF7ZFO-CTKjrct2.js").then((m) => ({ default: m.LoyaltyPointsPage })));
async function loader(ctx, extend) {
	const data = await loyaltyLoader(ctx?.locale);
	if (extend) {
		const extra = await extend(data, { params: {} });
		return {
			...data,
			...extra
		};
	}
	return data;
}
function head(ctx, data) {
	return {
		title: data.page.title,
		description: data.page.description,
		alternateLanguages: buildHreflangAlternates(ctx.settings, ctx.location.pathname)
	};
}
var Loyalty = {
	id: RouteId.LOYALTY,
	loader,
	head,
	Component: LazyLoyaltyPage
};
async function pointsLoader(ctx, extend) {
	const data = await loyaltyPointsLoader(ctx?.locale);
	if (extend) {
		const extra = await extend(data, { params: {} });
		return {
			...data,
			...extra
		};
	}
	return data;
}
var LoyaltyPoints = {
	id: RouteId.CUSTOMER_LOYALTY_POINTS,
	loader: pointsLoader,
	head: (ctx, data) => ({
		title: data.page.title,
		alternateLanguages: buildHreflangAlternates(ctx.settings, ctx.location.pathname)
	}),
	Component: LazyLoyaltyPointsPage
};
//#endregion
export { LoyaltyPoints as n, Loyalty as t };
