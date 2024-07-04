import { createDOMElement } from "../../DOM";
import createReactInstance from "../CreateReactInstance";

const creatStateNode = (fiber) => {
  if (fiber.tag === "hostComponent") {
    return createDOMElement(fiber);
  } else {
    return createReactInstance(fiber);
  }
};

export default creatStateNode;
