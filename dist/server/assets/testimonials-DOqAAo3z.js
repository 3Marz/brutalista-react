import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { $r as RouteId, Wr as getTwilightContext, ft as buildHreflangAlternates, li as require_react } from "./shared-home-SqCEv5dE.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/routes/testimonials.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
async function testimonialsLoader(_ctx) {
	const i18n = getTwilightContext().i18n;
	return { page: {
		slug: RouteId.TESTIMONIALS,
		title: i18n.t("blocks.home.testimonials") || "Customer Reviews"
	} };
}
async function reviewsLoader() {
	const { i18n } = getTwilightContext();
	const title = i18n.t("common.titles.reviews");
	return { page: {
		slug: RouteId.REVIEWS,
		title,
		breadcrumbs: [{
			name: i18n.t("common.titles.home"),
			url: "/"
		}, {
			name: title,
			url: "/reviews"
		}]
	} };
}
var LazyTestimonialsPage = (0, import_react.lazy)(() => import("./TestimonialsPage-JKNNN7PT-BVPDfeFl.js").then((m) => ({ default: m.TestimonialsPage })));
var LazyReviewsPage = (0, import_react.lazy)(() => import("./ReviewsPage-4BSQEFPW-ERK3BonV.js").then((m) => ({ default: m.ReviewsPage })));
async function loader(ctx, extend) {
	const data = await testimonialsLoader({ locale: ctx.locale ?? "ar" });
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
var Testimonials = {
	id: RouteId.TESTIMONIALS,
	loader,
	head,
	Component: LazyTestimonialsPage
};
async function loadReviews(_ctx, extend) {
	const data = await reviewsLoader();
	if (extend) {
		const extra = await extend(data, { params: {} });
		return {
			...data,
			...extra
		};
	}
	return data;
}
var Reviews = {
	id: RouteId.REVIEWS,
	loader: loadReviews,
	head: (ctx, data) => ({
		title: data.page.title,
		alternateLanguages: buildHreflangAlternates(ctx.settings, ctx.location.pathname)
	}),
	Component: LazyReviewsPage
};
//#endregion
export { Testimonials as n, Reviews as t };
