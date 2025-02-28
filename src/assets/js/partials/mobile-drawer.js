
class MobileDrawer extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
        salla.onReady()
            .then(() => salla.lang.onLoaded())
            .then(() => {
                this.menus = [];
                this.displayAllText = salla.lang.get('blocks.home.display_all');

                return salla.api.component.getMenus()
                .then(({ data }) => {
                    this.menus = data;
                    return this.render()
                }).catch((error) => salla.logger.error('salla-menu::Error fetching menus', error));
            });
	}

    /** 
    * Check if the menu has children
    * @param {Object} menu
    * @returns {Boolean}
    */
    hasChildren(menu) {
        return menu?.children?.length > 0;
    }

	render() {
		this.innerHTML = `
		<details class="lg:hidden group h-full">
			<summary class="list-none [&::-webkit-details-marker]:hidden h-full flex justify-center items-center">
				<span class="group-open:hidden w-6 h-6">
					<i class="sicon-menu text-2xl"></i>
				</span>
				<span class="hidden group-open:block w-6 h-6">
					<i class="sicon-cancel text-2xl"></i>
				</span>
			</summary>

			<div class="mobile-drawer absolute bg-white end-0 p-3 border-s-2 border-t-2 border-bc z-10">
				propo
			</div>
		</details>
		`
	}
}

customElements.define('mobile-drawer', MobileDrawer);

