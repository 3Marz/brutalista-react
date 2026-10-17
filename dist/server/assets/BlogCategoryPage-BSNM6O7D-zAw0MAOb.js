import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { Bt as HookSlot, Qn as useLocation, St as LazyBreadcrumb, Tt as LazyNoContent, ci as require_jsx_runtime, li as require_react, un as useTranslation } from "./shared-home-SqCEv5dE.js";
import { t as ItemsList } from "./ItemsList-B0b3lFuv.js";
import { t as blog } from "./chunk-6LRTCW27-B-XCedeX.js";
import { n as BlogListLayout, t as BlogArticleCard } from "./chunk-ZE4EZOXQ-DgybzwUC.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/BlogCategoryPage-BSNM6O7D.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_CATEGORIES = [];
var EMPTY_ARTICLES = [];
function BlogCategoryPage({ page, blogCategory, categories = EMPTY_CATEGORIES, articles = EMPTY_ARTICLES, cursor }) {
	const { t } = useTranslation();
	const { pathname, searchStr } = useLocation();
	const nextCursorRef = (0, import_react.useRef)(cursor?.next ?? null);
	const loader = (0, import_react.useCallback)(async () => {
		const nextUrl = nextCursorRef.current;
		const cursorMatch = nextUrl?.match(/[?&]cursor=([^&]+)/);
		const cursorValue = cursorMatch ? decodeURIComponent(cursorMatch[1]) : nextUrl ?? void 0;
		const result = await blog.articles.list({
			category: blogCategory.id,
			cursor: cursorValue
		});
		nextCursorRef.current = result.cursor?.next ?? null;
		return {
			items: result.data,
			next: result.cursor?.next ?? null
		};
	}, [blogCategory.id]);
	if (articles.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container mb-8 sm:mb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyBreadcrumb, { page }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BlogListLayout, {
			categories,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookSlot, { name: "blog:category.start" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyNoContent, {
					icon: "sicon-inbox",
					message: t("pages.blog_categories.no_articles")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookSlot, { name: "blog:category.end" })
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container mb-8 sm:mb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyBreadcrumb, { page }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BlogListLayout, {
			categories,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookSlot, { name: "blog:category.start" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-bold text-xl",
						children: blogCategory.name
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemsList, {
					items: articles,
					loader: cursor?.next ? loader : void 0,
					mode: cursor?.next ? "infinite" : "static",
					pageUrl: pathname + searchStr,
					className: "s-blog-list",
					itemsClassName: "grid md:grid-cols-2 gap-2.5 md:gap-8",
					empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyNoContent, {
						icon: "sicon-inbox",
						message: t("pages.blog_categories.no_articles")
					}),
					t: (key, fallback) => t(key, fallback || key),
					children: (items) => items.map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlogArticleCard, {
						article,
						showAuthor: true
					}, article.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HookSlot, { name: "blog:category.end" })
			]
		})]
	});
}
//#endregion
export { BlogCategoryPage };
