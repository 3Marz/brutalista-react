
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
		<details class="lg:hidden">
			<summary>
				open
			</summary>

			<div>
				propo
			</div>
		</details>
		`
	}
}

customElements.define('mobile-drawer', MobileDrawer);

