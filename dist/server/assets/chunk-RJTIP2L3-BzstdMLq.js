import { Gn as orThrow, fn as queryOptions, or as api } from "./shared-home-SqCEv5dE.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/chunk-RJTIP2L3.js
var brand = {
	list: async (page) => {
		const { data, cursor } = await api.get(page ? `brands?page=${page}` : "brands").json();
		return {
			items: data ?? [],
			next: cursor?.next ?? null
		};
	},
	find: async (id) => {
		const { data } = await api.get(`brands/${id}`).json();
		return data;
	},
	findOrThrow: (id) => orThrow(brand.find(id)),
	queries: {
		list: (page) => queryOptions({
			queryKey: [
				"brands",
				"list",
				page ?? 1
			],
			queryFn: () => brand.list(page)
		}),
		detail: (id) => queryOptions({
			queryKey: [
				"brands",
				"detail",
				id
			],
			queryFn: () => brand.find(id)
		})
	}
};
//#endregion
export { brand as t };
