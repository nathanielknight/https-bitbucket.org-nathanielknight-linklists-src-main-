// Checklist loading, saving, rendering, and importing.

const APP_DIV = "app";

module Util {
    export function assertNever(x: never): never {
        throw new Error("Unexpected object" + x);
    }
}

interface ChecklistItem {
    id: string;
    content: string;
    done: boolean;
}

module Message {
    interface Toggle {
        kind: "toggle";
        itemId: string;
    }

    export type Command = Toggle;
}


module Render {
    function renderItem(item: ChecklistItem, appdata: AppData): HTMLDivElement {
        let element = document.createElement("div");
        element.classList.add("item-checkbox");
        element.id = item.id;
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.onclick = e => {
            e.preventDefault();
            appdata.handle({kind: "toggle", itemId: item.id});
            Render.into(APP_DIV, appdata);
        }
        if (item.done) {
            checkbox.setAttribute("checked", "checked");
        }
        element.appendChild(checkbox);
        let content = document.createElement("span");
        content.classList.add("item-content")
        content.innerText = item.content;
        element.appendChild(content);
        return element;
    }

    function renderChecklist(items: ChecklistItem[], appdata: AppData): HTMLDivElement {
        let element = document.createElement("div");
        element.id = "checklist";
        items.forEach(i => {
            let itemElement = renderItem(i, appdata);
            element.appendChild(itemElement);
        });
        return element;
    }

    function clearNode(node: HTMLElement): void {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    export function into(divId: string, appdata: AppData): void {
        let targetElement = document.getElementById(divId);
        if (targetElement == null) {
            throw "Target element not found";
        }
        clearNode(targetElement);
        targetElement.appendChild(renderChecklist(appdata.items, appdata))
    }
}



class AppData {
    private data: ChecklistItem[];

    constructor(items: ChecklistItem[]) {
        this.data = items;
    }

    private handleToggle(cmd: Message.Command) {
        this.data
            .filter(i => i.id === cmd.itemId)
            .forEach(i => i.done = !i.done);
    }

    public handle(cmd: Message.Command): boolean {
        switch (cmd.kind) {
            case "toggle":
                this.handleToggle(cmd);
                return true;
        }
    }

    public get items(): ChecklistItem[]{
        return JSON.parse(JSON.stringify(this.data));
    }
}

function appInit() {
    let items = <ChecklistItem[]>[
        {
            "id": "begin",
            "content": "Have idea for a thing",
            "done": true,
        },
        {
            "id": "asdfjkl",
            "content": "Make an app",
            "done": false,
        },
        {
            "id": "jklasdf",
            "content": "Publicize it widely",
            "done": false,
        },
    ];
    let appdata = new AppData(items);
    Render.into(APP_DIV,  appdata);
}