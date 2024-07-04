import Component from "../../Component";

export default function getTag(virtualDOM) {
  if (typeof virtualDOM.type === "string") {
    return "hostComponent";
  } else if (Object.getPrototypeOf(virtualDOM.type) === Component) {
    return "classComponent";
  } else {
    return "finctionComponent";
  }
}
