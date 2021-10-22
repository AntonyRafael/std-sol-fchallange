import { fireEvent, getByText } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(
  path.resolve(__dirname, "../../src/index.html"),
  "utf8"
); // salva o html da página

let dom;
let container;

describe("sortable numbers", () => {
  beforeEach(() => {
    // antes de cada teste no describe renderiza o dom e executa o script
    dom = new JSDOM(html, { resources: "usable" });
    container = dom.window.document.body;
  });

  it("input has been rendered", () => {
    let inputNumber = container.querySelector(".selected-number");
    expect(inputNumber).toBeInTheDocument();
  });

  it("clear input number by clicking the send button", () => {
    let inputNumber = container.querySelector(".selected-number");
    let buttonSend = container.querySelector(".send");
    inputNumber.innerHtml = "45";
    fireEvent.click(buttonSend);
    expect(inputNumber.value.length).toBe(0);
  });
});
