const UIInput = {
  create(name, customize) {
    const label = document.createElement("label");
    const input = document.createElement("input");

    customize(label, input);

    input.setAttribute("name", name);
    label.append(input);

    return [label, input];
  },
};
