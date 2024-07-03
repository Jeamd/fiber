const arrified = (arg) => {
  return Array.isArray(arg) ? arg : [arg];
};

export default arrified;
