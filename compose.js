function setFromQuery() {
    let params = new URLSearchParams(location.search.slice(1));
    if (params == null) {
        return;
    }

    let title = params.get("t") || "";
    let itemsSrc = params.get("l");
    let checklist;
    if (itemsSrc != null) {
        let items = SerDe.deserialize(itemsSrc);
        checklist = items.map((i) => i.content).join("\n");
    } else {
        checklist = "";
    }
    document.getElementById("title").value = title;
    document.getElementById("checklist-area").value = checklist;
}

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
        return { id: i.toString(), content: c, done: false };
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
    setFromQuery();
    document.getElementById("title").oninput = updateLink;
    document.getElementById("checklist-area").oninput = updateLink;
    updateLink();
}