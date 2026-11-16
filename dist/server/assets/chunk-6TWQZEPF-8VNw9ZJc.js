import { Wr as getTwilightContext, fn as queryOptions, or as api } from "./shared-home-v6c5Y3is.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/chunk-6TWQZEPF.js
var menu = {
	header: async () => {
		const { locale } = getTwilightContext();
		const { data } = await api.get(`menus/header?lang=${locale}`).json();
		return data || [];
	},
	footer: async () => {
		const { locale } = getTwilightContext();
		const { data } = await api.get(`menus/footer?lang=${locale}`).json();
		return data || [];
	},
	queries: { header: () => queryOptions({
		queryKey: [
			"menus",
			"header",
			getTwilightContext().locale
		],
		queryFn: () => menu.header(),
		staleTime: 3e5
	}) }
};
//#endregion
export { menu as t };
