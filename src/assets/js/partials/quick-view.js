
class QuickViewModal extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render()
		this.product = null
	}

	loadProduct(prodId) {

	}

	render() {
		this.setAttribute('id', 'quick-view-modal')
		this.innerHTML = `
		<salla-modal>
			${this.product != null ? 
					`loaded ${this.product}`
				:
					`Loading...`}
		</salla-modal>
		`
		
	}

}

customElements.define('quick-view', SearchBtn);
