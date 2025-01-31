export default function createReactInstance(fiber) {
  let instance = null;

  if (fiber.tag === "classComponent") {
    instance = new fiber.type(fiber.props);
  }
  return instance;
}
