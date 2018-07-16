function getTitle() {
    let titleElement = document.getElementById("title");
    return titleElement.value;
}

function getItems() {

    function itemList(src) {
        return src.split("\n").filter(p => p);
    }



    let composeArea = document.getElementById("checklist-area");
    let src = composeArea.value;
    return itemList(src).map((c, i) => {
        return {id: i.toString(), content: c, done: false};
    });
}

function getParams() {
    let title = getTitle();
    let items = getItems();
    return {
        title: title,
        items: SerDe.serialize(items),
    }
}

function updateLink(e) {
    let params = getParams();
    var p = new URLSearchParams();
    p.set("l", params.items);
    p.set("t", params.title);

    function linkString(qryParams) {
        const base = "./?";
        return base + qryParams;
    }

    let link = document.getElementById("checklist-link");

    link.setAttribute("href", linkString(p.toString()));
}

function initCompose() {
    document.getElementById("title").oninput = updateLink;
    document.getElementById("checklist-area").oninput = updateLink;
    updateLink();
}