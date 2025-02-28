
class MobileDrawer extends HTMLElement {
	constructor() {
		super()
		this.open = false;
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
		//this.innerHTML = `
		//<details class="lg:hidden group h-full ${this.open ? `drawer-open` : `drawer-closed`}">
		//	<summary onclick="this.open = !this.open" class="list-none [&::-webkit-details-marker]:hidden h-full flex justify-center items-center">
		//		<span class="group-open:hidden w-6 h-6">
		//			<i class="sicon-menu text-2xl"></i>
		//		</span>
		//		<span class="hidden group-open:block w-6 h-6">
		//			<i class="sicon-cancel text-2xl"></i>
		//		</span>
		//	</summary>
		//
		//	<div class="mobile-drawer">
		//		propo
		//	</div>
		//</details>
		//`
		this.innerHTML = `
			<div class="drawer-container lg:hidden drawer-closed w-full h-full">
				<input type="checkbox" 
					class="hidden peer" 
					id="mobile-drawer-toggle" 
					onchange="document.querySelector('.drawer-container').classList.toggle('drawer-open'); document.querySelector('.drawer-container').classList.toggle('drawer-closed')" 
				/>
				<label for="mobile-drawer-toggle" class="w-full h-full flex justify-center items-center">
					<span class="peer-checked:hidden w-6 h-6">
						<i class="sicon-menu text-2xl"></i>
					</span>
					<span class="hidden peer-checked:block w-6 h-6">
						<i class="sicon-cancel text-2xl"></i>
					</span>
				</label>
				<div class="drawer-background">
					<div class="drawer-content">
						Content
					</div>
				</div>
			</div>
		`
	}
}

customElements.define('mobile-drawer', MobileDrawer);

