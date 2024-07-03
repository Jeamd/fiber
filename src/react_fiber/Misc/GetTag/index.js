export default function getTag(virtualDOM) {
  if (typeof virtualDOM.type === "string") {
    return "hostComponent";
  }
}
