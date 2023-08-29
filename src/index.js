import { h } from "snabbdom";
import * as snabbdom from "snabbdom";

const patch = snabbdom.init([
    snabbdom.propsModule
]);
const createElement = tagName => (strings, ...args) => ({
    type: "element", 
    template: h(
        tagName,
        {},
        // transform Literals to text
        strings.reduce(
            (acc, currentString, index) => acc + currentString + (args[index] || ""),
            ""
          )
      )
  });

export const init = (selector, component) => {
    const app = document.querySelector(selector);
    patch(app, component.template);
};

export const render = (component) => {
    console.log(component);
    const root = document.querySelector("#app");
    patch(root, component.template);
}


// Index.js 

export const div = createElement("div");
export const p = createElement("p");

const firstName = "Marvin";
const lastName = "Frachet";

const hello = div`Hello ${firstName} ${lastName}`;
const bye = div`Bye ${lastName} ${firstName}`;
render(hello);
render(bye);

