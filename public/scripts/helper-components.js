function fillWithHeaderContent(element, isEmpty) {
    element.setAttribute("id", "header");
    let div = createDiv({
        className: "logo-link"
    });
    div.appendChild(createTag("a", {
        href: "/profile",
        innerHTML: "Photodit"
    }));
    element.appendChild(div);
    if(!isEmpty) {
        let div1 = createDiv(), div2 = createDiv();
        let form1 = createTag("form", {
            id: "search-input-gl",
            action: "/search",
            method: "GET"
        });
        form1.appendChild(createInput("search", {
            id: "search-input-gl-input",
            name: "search",
            placeholder: "Search..."
        }));
        form1.appendChild(createInput("submit", {
            id: "search-input-gl-button",
            value: "Search"
        }));
        let form2 = createTag("form", {
            id: "log-out-form",
            action: "/logout",
            method: "POST"
        });
        form2.appendChild(createInput("submit", {value:"Log out"}));
        div1.appendChild(form1);
        div2.appendChild(form2);
        appendChildsArray(element, [div1, div2]);
    }
}

customElements.define("wc-custom-header-empty", class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        fillWithHeaderContent(this, true);
    }
});
customElements.define("wc-custom-header", class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        fillWithHeaderContent(this, false);
    }
});
