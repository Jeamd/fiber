export default function gitFiberRoot(fiber) {
  let root = fiber;

  while (root.parent) {
    root = fiber.parent;
  }
  return root;
}
