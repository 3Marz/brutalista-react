import { Gn as orThrow, dr as getAuthToken, fn as queryOptions, or as api } from "./shared-home-SqCEv5dE.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/chunk-IGD4G3SP.js
var loyalty = {
	get: async () => {
		const { data } = await api.get("loyalty").json();
		return data;
	},
	getOrThrow: () => orThrow(loyalty.get()),
	getPointsBalance: async () => {
		return (await api.get("balance/points").json()).balance;
	},
	queries: {
		detail: () => queryOptions({
			queryKey: ["loyalty"],
			queryFn: () => loyalty.get()
		}),
		points: () => queryOptions({
			queryKey: ["loyalty", "points"],
			queryFn: () => loyalty.getPointsBalance(),
			enabled: !!getAuthToken(),
			staleTime: 3e4
		})
	}
};
//#endregion
export { loyalty as t };
