// HELPERS

function el(tag, className, text, attributes = {}) {
  const elem = document.createElement(tag);
  if (className) elem.className = className;
  if (text !== undefined) elem.textContent = text;
  Object.entries(attributes).forEach(([key, value]) => {
    elem.setAttribute(key, value);
  });
  return elem;
}

function clearContainer(parent) {
  parent.innerHTML = "";
}

function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

function ap(parent, ...child) {
  parent.append(...child);
}

export { el, clearContainer, qs, ap };
