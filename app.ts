declare const FNV: any;  // Global module because I can't figure out JS

interface ChecklistItem {
  id: string;
  content: string;
  done: boolean;
}

function itemsEqual(item1: ChecklistItem, item2: ChecklistItem): boolean {
  if (item1.id == undefined || item2.id == undefined || item1.id !== item2.id) {
    return false;
  }
  if (item1.content == undefined || item2.content == undefined || item1.content !== item2.content) {
    return false;
  }
  if (item1.done == undefined || item2.done == undefined || item1.done !== item2.done) {
    return false;
  }
  return true;
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
      Render.into(appdata);
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

  let divId: string = "app";

  export function into(appdata: AppData): void {
    let targetElement = document.getElementById(divId);
    if (targetElement == null) {
      throw "Target element not found";
    }
    clearNode(targetElement);
    targetElement.appendChild(checklistElement(appdata.items, appdata));
  }

  let titleId: string = "title";

  export function title(title: string): void {
    let targetElement = document.getElementById(titleId);
    if (targetElement == null) {
      throw "Target element not found";
    }
    clearNode(targetElement);
    targetElement.innerText = title;

  }
}

let ad: AppData | null = null;

function appInit() {
  let params = paramsFromUrl();
  if (params == null) {
    return
  } else {
    let appdata = params.data;
    let title = params.title;
    ad = appdata;
    if (title != null) {
      Render.title(title);
    }
    Render.into(appdata);
  }
}

function paramsFromUrl(): {data: AppData, title: string | null} | null {
  let params = new URLSearchParams(location.search.slice(1));
  let serialized: string | null = params.get("l");
  if (serialized == null) {
    return null;
  }

  var items: ChecklistItem[];
  try {
    items = SerDe.deserialize(serialized);
  } catch(e) {
    console.error(e);
    return null;
  }

  let title = params.get("t");

  return {
    data: new AppData(items),
    title: title
  };
}

namespace SerDe {
  export function serialize(items: ChecklistItem[]): string {
    let stringified = JSON.stringify(items);
    let encoded = btoa(stringified);
    return encoded;
  }

  export function deserialize(serialized: string): ChecklistItem[] {
    let decoded = atob(serialized);
    let parsed = JSON.parse(decoded);
    if (!Array.isArray(parsed)) {
      throw new Error("deserialize was passed an encoded object other than an array");
    }
    let result: ChecklistItem[] = [];
    for (var idx=0; idx<parsed.length; idx++) {
      // WARNING: Type of src is only notional until it's beenverified.
      // It's an annotation to keep the compiler happy, not an indication
      // of src's actual type at runtime.
      let src: ChecklistItem = parsed[idx];
      if (src["id"] == undefined || src["content"] == undefined || src["done"] == undefined) {
        throw new Error("Missing required field");

      }
      var item: ChecklistItem = {
        id: String(src["id"]),
        content: String(src["content"]),
        done: Boolean(src["done"])
      };
      result.push(item);
    }
    return result;
  }
}

namespace Hash {
  function idString(items: ChecklistItem[]): string {
    var result = "";
    for (var idx=0; idx < items.length; idx++) {
      let item = items[idx];
      result += item.content;
    }
    return result;
  }

  export function signature(items: ChecklistItem[]): string {
    let s = idString(items);
     return FNV.hex(s).hash;
  }
}
