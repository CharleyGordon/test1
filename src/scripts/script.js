const url = "https://brandstestowy.smallhost.pl/api/random";

const body = document.body;

const productList = document.querySelector(".product-list");

const productAmount = document.querySelector(".number");

const header = document.querySelector("header");

const intersectionObserver = new IntersectionObserver(function (entries) {
  for (entry of entries) {
    const { target, isIntersecting } = entry;
    if (!isIntersecting) return;
    intersectionObserver.unobserve(target);
    fillProducts();
  }
});

const listObserver = new IntersectionObserver(function (entries) {
  for (entry of entries) {
    const { isIntersecting } = entry;
    if (!isIntersecting) return;
    fillProducts();
  }
});

const dialog = {
  element: productList.querySelector("dialog"),
  id: productList.querySelector("dialog .id"),
  name: productList.querySelector("dialog .name"),
  value: productList.querySelector("dialog .value"),

  changeId(newId) {
    this.id.textContent = `ID: ${newId}`;
    return this;
  },
  changeName(newName) {
    this.name.textContent = `Nazwa: ${newName}`;
    return this;
  },
  changeValue(newValue) {
    this.value.textContent = `Wartość: ${newValue}`;
    return this;
  },
  show() {
    this.element.show();
    return this;
  },
  close() {
    this.element.close();
    return this;
  },
};

async function getData(url) {
  const json = await fetch(url);
  const object = await json.json();
  return object.data;
}

function updateNumber() {
  productAmount.textContent = getCurrentProducts().length;
}

function createString(element) {
  const span = document.createElement("span");
  element.append(span);
  return span;
}

async function fillProducts() {
  const last = getCurrentProducts().at(-1);
  if (last) {
    intersectionObserver.unobserve(last);
  }

  const fetchedProducts = await getData(url);
  for (product of fetchedProducts) {
    const { id, name, value } = product;
    const productElement = document.createElement("div");
    const span = createString(productElement);
    productElement.classList.add("product");
    productElement.dataset.grid = "";
    productElement.dataset.id = id;
    productElement.dataset.name = name;
    productElement.dataset.value = value;
    span.textContent = `ID:${getCurrentProducts().length + 1}`;
    productList.append(productElement);
  }
  updateNumber();
  intersectionObserver.observe(getCurrentProducts().at(-1));
}

function getCurrentProducts() {
  return Array.from(productList.querySelectorAll(".product"));
}

function showDetails(event) {
  const { target } = event;
  console.dir(target);

  const products = getCurrentProducts();
  const targetInProducts = products.includes(target);
  if (!targetInProducts) return;
  const [id, name, value] = [
    target.dataset.id,
    target.dataset.name,
    target.dataset.value,
  ];
  body.classList.add("darkened");
  dialog.changeId(id).changeName(name).changeValue(value).show();
}

function closeDialog(event) {
  event.preventDefault();
  console.dir(event.target, event.currentTarget);
  const { target } = event;
  if (!target.matches("dialog a")) return;
  body.classList.remove("darkened");
  dialog.close();
}

// obserwacja sekcji:
const navigationAnchors = Array.from(document.querySelectorAll("nav a"));

const sections = [
  document.querySelector("#distinctions"),
  document.querySelector("#ingredients"),
  document.querySelector("#products"),
];

console.dir({ sections });

function removeUnderline(element) {
  element.classList.remove("current");
}

function findAnchor(href) {
  const anchor = document.querySelector(`a[href="#${href}"]`);
  return anchor ?? false;
}

const observer = new IntersectionObserver(
  function (entries) {
    for (entry of entries) {
      const { target, isIntersecting } = entry;
      if (!sections.includes(target) || !isIntersecting) return;
      const anchor = findAnchor(target.id);
      if (!anchor) return;
      navigationAnchors.forEach(removeUnderline);
      anchor.classList.add("current");
    }
  },
  {
    threshold: 0.6,
  }
);

for (section of sections) {
  observer.observe(section);
}

//ustawienie paddingu scrolla

function setScrollPadding() {
  // debugger;
  const rect = header.getBoundingClientRect();
  const { height } = rect;
  document
    .querySelector(":root")
    .style.setProperty("--header-height", `${Math.ceil(height + 20)}px`);
}

productList.addEventListener("click", showDetails);
dialog.element.addEventListener("click", closeDialog);
listObserver.observe(productAmount);
setScrollPadding();
