import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { $r as RouteId, Gn as orThrow, Kn as orUnauthorized, Wr as getTwilightContext, Yn as unauthorized, dr as getAuthToken, ft as buildHreflangAlternates, li as require_react } from "./shared-home-SqCEv5dE.js";
import { t as order } from "./chunk-7OB2DG2K-DOXhMoCD.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/chunk-ICYJD26Y.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
async function ordersLoader(ctx, extend) {
	if (!getAuthToken()) throw unauthorized();
	const query = ctx.query;
	const isPending = query?.status === "pending";
	const response = await orUnauthorized(order.list({
		status: query?.status,
		...ctx.with_items ? { with_items: ctx.with_items } : {}
	}));
	const i18n = getTwilightContext().i18n;
	const pageData = {
		page: {
			title: isPending ? i18n.t("common.titles.pending_orders") : i18n.t("common.titles.orders"),
			slug: RouteId.CUSTOMER_ORDERS_INDEX
		},
		orders: response.data,
		cursor: response.cursor,
		query
	};
	if (extend) {
		const extra = await extend(pageData, { params: {} });
		return {
			...pageData,
			...extra
		};
	}
	return pageData;
}
async function orderSingleLoader({ params }) {
	if (!getAuthToken()) throw unauthorized();
	const [data, componentsOrder] = await Promise.all([order.findOrThrow(params.id), orThrow(orUnauthorized(order.findForComponents(params.id)))]);
	const i18n = getTwilightContext().i18n;
	return {
		page: {
			slug: RouteId.CUSTOMER_ORDERS_SINGLE,
			id: String(params.id),
			title: i18n.t("pages.orders.order_details").replace(":id", String(data.order.reference_id ?? params.id))
		},
		order: data.order,
		componentsOrder
	};
}
var LazyOrdersPage = (0, import_react.lazy)(() => import("./OrdersPage-AYYJBHOJ-B06JEr0X.js").then((m) => ({ default: m.OrdersPage })));
var LazyOrderSinglePage = (0, import_react.lazy)(() => import("./OrderSinglePage-TAVOOUEP-DPWuLWJG.js").then((m) => ({ default: m.OrderSinglePage })));
async function ordersLoaderWithExtend(ctx, extend) {
	const query = ctx.search;
	return ordersLoader({
		query,
		with_items: ctx.with_items
	}, extend);
}
function ordersHead(ctx, data) {
	const isPending = data.query?.status === "pending";
	return {
		title: ctx.i18n.t(isPending ? "common.titles.pending_orders" : "common.titles.orders"),
		description: data.page.description,
		alternateLanguages: buildHreflangAlternates(ctx.settings, ctx.location.pathname)
	};
}
async function orderSingleLoaderWithExtend(ctx, extend) {
	const data = await orderSingleLoader({ params: ctx.params });
	if (extend) {
		const extra = await extend(data, ctx);
		return {
			...data,
			...extra
		};
	}
	return data;
}
function orderSingleHead(ctx, data) {
	return {
		title: data.page.title,
		description: data.page.description,
		alternateLanguages: buildHreflangAlternates(ctx.settings, ctx.location.pathname)
	};
}
var Orders = {
	id: RouteId.CUSTOMER_ORDERS_INDEX,
	loader: ordersLoaderWithExtend,
	head: ordersHead,
	Component: LazyOrdersPage
};
var OrderSingle = {
	id: RouteId.CUSTOMER_ORDERS_SINGLE,
	loader: orderSingleLoaderWithExtend,
	head: orderSingleHead,
	Component: LazyOrderSinglePage
};
//#endregion
export { Orders as n, OrderSingle as t };
