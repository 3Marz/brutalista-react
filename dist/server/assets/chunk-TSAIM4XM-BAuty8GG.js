import { F as rememberProductPreview, fn as queryOptions, or as api, ur as getActiveScope } from "./shared-home-v6c5Y3is.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/chunk-TSAIM4XM.js
var wishlist = {
	list: async (params = {}) => {
		const { page = 1, perPage = 15, filterable, signal } = params;
		const searchParams = new URLSearchParams();
		searchParams.set("source", "wishlist");
		searchParams.set("page", String(page));
		searchParams.set("per_page", String(perPage));
		if (filterable !== void 0) searchParams.set("filterable", filterable ? "1" : "0");
		const options = {};
		if (signal) options.signal = signal;
		const response = await api.get(`products?${searchParams.toString()}`, options).json();
		const items = response.data ?? [];
		for (const item of items) rememberProductPreview(item);
		return {
			items,
			next: response.cursor?.next ?? null
		};
	},
	queries: { list: (params) => queryOptions({
		queryKey: [
			"wishlist",
			"list",
			params,
			{ scope: getActiveScope() }
		],
		queryFn: ({ signal }) => wishlist.list({
			...params,
			signal
		})
	}) }
};
//#endregion
export { wishlist as t };
