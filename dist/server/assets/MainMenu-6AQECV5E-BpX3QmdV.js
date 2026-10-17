import { i as __toESM } from "./rolldown-runtime-DbVrKiKs.js";
import { ci as require_jsx_runtime, li as require_react, pn as useQuery, tr as useTwilight, un as useTranslation, vt as Link } from "./shared-home-SqCEv5dE.js";
import { t as menu } from "./chunk-6TWQZEPF-Lmy0d3lU.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/MainMenu-6AQECV5E.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var SKELETON_ITEMS = [
	{
		id: "first",
		width: "w-16"
	},
	{
		id: "second",
		width: "w-20"
	},
	{
		id: "third",
		width: "w-24"
	},
	{
		id: "fourth",
		width: "w-16"
	},
	{
		id: "fifth",
		width: "w-20"
	}
];
var MainMenuSkeleton = (0, import_react.memo)(function MainMenuSkeleton2() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "main-menu",
		children: SKELETON_ITEMS.map(({ id, width }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "!hidden lg:!block root-level",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "#",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block animate-pulse rounded bg-gray-200 h-4 ${width}` })
			})
		}, id))
	}) });
});
function MainMenu() {
	const { theme } = useTwilight();
	const { data: menus = [], isLoading } = useQuery(menu.queries.header());
	const { t } = useTranslation();
	const { visibleMenus, hiddenMenus } = (0, import_react.useMemo)(() => {
		const enableMore = theme?.settings?.is_more_button_enabled;
		const visibleCount = 7;
		if (enableMore && menus.length > visibleCount) return {
			visibleMenus: menus.slice(0, visibleCount),
			hiddenMenus: menus.slice(visibleCount)
		};
		return {
			visibleMenus: menus,
			hiddenMenus: []
		};
	}, [
		menus,
		theme?.settings?.enable_more_menu,
		theme?.settings?.is_more_button_enabled
	]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainMenuSkeleton, {});
	const renderItem = (item, isChild = false, inMoreMenu = false) => {
		const hasChildren = item.has_children && item.children && item.children.length > 0;
		const showDropdown = hasChildren && !inMoreMenu;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: `${isChild ? "relative" : "!hidden lg:!block root-level"} ${hasChildren ? "has-children" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: item.url,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title })
			}), showDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sub-menu w-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: item?.children?.map((child) => renderItem(child, true)) })
			})]
		}, item.id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "main-menu",
		children: [visibleMenus.map((item) => renderItem(item)), hiddenMenus.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			id: "more-menu-dropdown",
			className: "!hidden lg:!block root-level has-children",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "#",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("common.titles.more", "More") })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sub-menu w-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: hiddenMenus.map((item) => renderItem(item, true, true)) })
			})]
		})]
	}) });
}
//#endregion
export { MainMenu };
