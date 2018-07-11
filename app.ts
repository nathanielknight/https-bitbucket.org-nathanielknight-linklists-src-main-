// Checklist loading, saving, rendering, and importing.

const APP_DIV = "app";

interface ChecklistItem {
  id: string;
  content: string;
  done: boolean;
}

class AppData {
  private data: ChecklistItem[];

  constructor(items: ChecklistItem[]) {
    this.data = items;
  }

  private newId(): string {
    let candidate = Math.random().toString(36).substring(7);
    if (this.data.some(i => i.id == candidate)) {
        return this.newId();
    } else {
        return candidate;
    }
  }

  public toggle(itemId: string) {
      this.data.filter(i => i.id === itemId).forEach(i => i.done = !i.done);
  }

  public get items(): ChecklistItem[] {
    return JSON.parse(JSON.stringify(this.data));
  }
}

namespace Render {
  function itemElement(item: ChecklistItem, appdata: AppData): HTMLDivElement {
    let element = document.createElement("div");
    element.classList.add("item-checkbox");
    element.id = item.id;

    let toggle = (e: Event) => {
      appdata.toggle(element.id);
      Render.into(APP_DIV, appdata);
    }

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", item.id);
    checkbox.onclick = toggle;
    if (item.done) {
      checkbox.setAttribute("checked", "checked");
    }
    element.appendChild(checkbox);

    let content = document.createElement("label");
    content.classList.add("item-content");
    content.setAttribute("for", item.id);
    content.onclick = toggle;
    content.innerText = item.content;
    element.appendChild(content);

    return element;
  }

  function checklistElement(
    items: ChecklistItem[],
    appdata: AppData
  ): HTMLDivElement {
    let element = document.createElement("div");
    element.id = "checklist";
    items.forEach(i => {
      let e = itemElement(i, appdata);
      element.appendChild(e);
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
    targetElement.appendChild(checklistElement(appdata.items, appdata));
  }
}

let ad: AppData | null = null;

function appInit() {
  let items = <ChecklistItem[]>[
    {
      id: "begin",
      content: "Have idea for a thing",
      done: true
    },
    {
      id: "asdfjkl",
      content: "Start making the thing",
      done: true
    },
    {
        id: "asdfjklasdf",
        content: "Reconsider the thing",
        done: true,
    },
    {
        id: "continue",
        content: "Continue making the thing",
        done: false,
    },
    {
      id: "jklasdf",
      content: "Publicize it widely",
      done: false
    }
  ];
  let appdata = new AppData(items);
  ad = appdata;
  Render.into(APP_DIV, appdata);
}
