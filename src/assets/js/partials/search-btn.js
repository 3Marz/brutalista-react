
class SearchBtn extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.searchEle = this.querySelector('salla-search');
		this.render()
	}

	render() {
		this.innerHTML = `
		<button class="header-btn" onclick="document.querySelector('salla-search').open()">
			<i class="sicon-search header-btn__icon"></i>
		</button>
		
		`
		
	}

}

customElements.define('search-btn', SearchBtn);
