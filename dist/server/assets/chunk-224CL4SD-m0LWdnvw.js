import { Gn as orThrow, fn as queryOptions, or as api, ur as getActiveScope } from "./shared-home-v6c5Y3is.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/chunk-224CL4SD.js
var category = {
	find: async (id) => {
		const { data } = await api.get(`categories/${id}`).json();
		return data;
	},
	findOrThrow: (id) => orThrow(category.find(id)),
	list: async () => {
		const { data } = await api.get("categories").json();
		return data ?? [];
	},
	queries: {
		detail: (id) => queryOptions({
			queryKey: [
				"categories",
				"detail",
				id
			],
			queryFn: () => category.find(id)
		}),
		list: () => queryOptions({
			queryKey: [
				"categories",
				"list",
				{ scope: getActiveScope() }
			],
			queryFn: () => category.list()
		})
	}
};
//#endregion
export { category as t };
