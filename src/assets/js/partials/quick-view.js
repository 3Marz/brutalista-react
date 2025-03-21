
class QuickViewModal extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		if (window.app?.status === 'ready') {
			this.onReady();
		} else {
			document.addEventListener('theme::ready', () => this.onReady())
		}
	}

	onReady() {
		this.product = null
		this.setAttribute('id', 'quick-view-modal')
		//this.render()
	}

	loadProduct(prodId) {
		salla.product.getDetails(prodId, ["images", "sold_quantity", "category"])
			.then((res) => {
				console.log(res)
				document.querySelector('#quick-view-inner-modal')?.open();	
				if (!res.success) {
					console.log("what")
					return
				}
				this.product = res.data
				//this.render()
			})
	}

	render() {

		//this.innerHTML = `
		//	<salla-modal id='quick-view-inner-modal'>
		//		${this.product != null ? 
		//			`
		//				<div>
		//					Done
		//				</div>
		//			`
		//			:
		//			`
		//				Loading...
		//			`
		//		}
		//	</salla-modal>
		//`
		
	}

}

customElements.define('quick-view', QuickViewModal);
