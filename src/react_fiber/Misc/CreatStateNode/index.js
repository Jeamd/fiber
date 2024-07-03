import { createDOMElement } from "../../DOM";

const creatStateNode = (fiber) => {
  if (fiber.tag === "hostComponent") {
    return createDOMElement(fiber);
  }
};

export default creatStateNode;
