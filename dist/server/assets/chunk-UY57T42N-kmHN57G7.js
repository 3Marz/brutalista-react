import { or as api } from "./shared-home-v6c5Y3is.js";
//#region node_modules/.pnpm/@salla.sa+twilight-theme-engine@1.0.102_32b4eb9d467e9723b9104948a3245870/node_modules/@salla.sa/twilight-theme-engine/dist/chunk-UY57T42N.js
var wallet = { list: async (params = {}) => {
	const { page = 1, perPage = 10, signal } = params;
	const searchParams = new URLSearchParams();
	searchParams.set("page", String(page));
	searchParams.set("per_page", String(perPage));
	const options = {};
	if (signal) options.signal = signal;
	const response = await api.get(`balance/wallet?${searchParams.toString()}`, options).json();
	const transactions = response.data.transactions;
	return {
		items: transactions.data ?? [],
		next: transactions.next_page_url,
		balance: response.data.balance
	};
} };
//#endregion
export { wallet as t };
