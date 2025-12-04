function loadCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}


const Product = {
  create() {
    const product = {};

    return {
      thumbnail(url) {
        product.url = url;
        return this;
      },
      title(title) {
        product.title = title;
        return this;
      },
      description(description) {
        product.description = description;
        return this;
      },
      images(images) {
        if (Array.isArray(images)) {
          product.images = images;
        } else {
          error("Images are not arrays!", { cause: images });
        }

        product.images = images;
        return this;
      },
      price(price = 0) {
        product.price = price;
        return this;
      },
      quantity(quantity = 0) {
        product.quantity = quantity;
        return this;
      },
      build() {
        return product;
      },
    };
  },
};

function singleProductView(product) {
  const view = document.querySelector("#product");

  // clear old content
  view.innerHTML = "";

  // main container
  const container = document.createElement("div");
  container.classList.add("single-product-container");

  // main product section
  const main = document.createElement("div");
  main.classList.add("single-product-main");

  // main image
  const mainImg = document.createElement("img");
  mainImg.src = product.url;
  mainImg.classList.add("main-image");

  // product info
  const info = document.createElement("div");
  info.classList.add("product-info");

  const title = document.createElement("h2");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.textContent = product.description;
  description.classList.add("description");

  const price = document.createElement("p");
  price.textContent = "$" + product.price.toFixed(2);
  price.classList.add("price");

  // quantity
  const qtyLabel = document.createElement("label");
  qtyLabel.textContent = "Quantity: ";

  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.min = "1";
  qtyInput.value = "1";
  qtyInput.id = "product-qty";

  qtyLabel.appendChild(qtyInput);

  // add to cart button
  const addBtn = document.createElement("button");
  addBtn.id = "add-to-cart";
  addBtn.textContent = "Add to Cart";

  // append
  info.appendChild(title);
  info.appendChild(description);
  info.appendChild(price);
  info.appendChild(qtyLabel);
  info.appendChild(addBtn);

  main.appendChild(mainImg);
  main.appendChild(info);

  // thumbnail image section
  const extraImages = document.createElement("div");
  extraImages.classList.add("additional-images");

  if (Array.isArray(product.images)) {
    product.images.forEach((imgSrc) => {
      const thumb = document.createElement("img");
      thumb.src = imgSrc;
      thumb.classList.add("thumbnail");

      extraImages.appendChild(thumb);
    });
  }

  // append
  container.appendChild(main);
  container.appendChild(extraImages);
  view.appendChild(container);

  // add to cart
  addBtn.addEventListener("click", () => {
  const cart = loadCart();

  const newItem = {
    title: product.title,
    price: product.price,
    thumbnail: product.url,
    quantity: Number(document.querySelector("#product-qty").value),
    size: product.size || "M",
    color: product.color || "Blue",
  };

  cart.push(newItem);
  saveCart(cart);

  alert("Added to cart!");
});
}

document.querySelector("#test-product-btn").addEventListener("click", () => {
  const p = {
    url: "https://picsum.photos/400",
    title: "Test Product",
    description: "Testing view ",
    price: 39.99,
    images: ["https://picsum.photos/100?1", "https://picsum.photos/100?2"],
  };

  singleProductView(p);
});


function calculateShipping(total, type, destination) {
  if (total > 500) return 0;

  const table = {
    Canada:         { Standard: 10, Express: 25, Priority: 35 },
    "United States":{ Standard: 15, Express: 30, Priority: 50 },
    International:  { Standard: 20, Express: 30, Priority: 50 }
  };

  return table[destination][type];
}


// Shopping Cart View
function CartView() {
  const view = document.querySelector("#shopping-cart");
  const cart = loadCart();

  view.innerHTML = ""; // Empty old content

  // If empty
  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your cart is empty.";
    view.appendChild(empty);
    return;
  }

  // Main container
  const container = document.createElement("div");
  container.classList.add("cart-container");

  // Cart item section
  const itemSection = document.createElement("div");
  itemSection.classList.add("cart-items");

  let merchandiseTotal = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.classList.add("cart-row");

    const img = document.createElement("img");
    img.src = item.thumbnail;
    img.classList.add("cart-thumb");

    const title = document.createElement("p");
    title.textContent = item.title;

    const size = document.createElement("p");
    size.textContent = item.size;

    const color = document.createElement("p");
    color.textContent = item.color;

    const price = document.createElement("p");
    price.textContent = `$${item.price.toFixed(2)}`;

    const qty = document.createElement("p");
    qty.textContent = item.quantity;

    const subtotal = document.createElement("p");
    subtotal.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

    merchandiseTotal += item.price * item.quantity;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart);
      CartView();
    });

    row.appendChild(img);
    row.appendChild(title);
    row.appendChild(color);
    row.appendChild(size);
    row.appendChild(price);
    row.appendChild(qty);
    row.appendChild(subtotal);
    row.appendChild(removeBtn);

    itemSection.appendChild(row);
  });

  container.appendChild(itemSection);

  // Shipping section
  const shipSection = document.createElement("div");
  shipSection.classList.add("shipping-section");

  const shipType = document.createElement("select");
  shipType.id = "ship-method";
  ["Standard", "Express", "Priority"].forEach(opt => {
    const o = document.createElement("option");
    o.textContent = opt;
    shipType.appendChild(o);
  });

  const shipDestination = document.createElement("select");
  shipDestination.id = "ship-dest";
  ["Canada", "United States", "International"].forEach(opt => {
    const o = document.createElement("option");
    o.textContent = opt;
    shipDestination.appendChild(o);
  });

  shipSection.appendChild(shipType);
  shipSection.appendChild(shipDestination);
  container.appendChild(shipSection);


  // Summary
  const summary = document.createElement("div");
  summary.classList.add("summary");

  function updateSummary() {
    const method = shipType.value;
    const destination = shipDestination.value;

    const shipping = calculateShipping(merchandiseTotal, method, destination);
    const tax = destination === "Canada" ? merchandiseTotal * 0.05 : 0;
    const total = merchandiseTotal + shipping + tax;

    summary.innerHTML = ""; // empty

const merchP = document.createElement("p");
merchP.textContent = `Merchandise: $${merchandiseTotal.toFixed(2)}`;

const shipP = document.createElement("p");
shipP.textContent = `Shipping: $${shipping.toFixed(2)}`;

const taxP = document.createElement("p");
taxP.textContent = `Tax: $${tax.toFixed(2)}`;

const totalStrong = document.createElement("strong");
totalStrong.textContent = `Total: $${total.toFixed(2)}`;

const checkoutBtn = document.createElement("button");
checkoutBtn.id = "checkout-btn";
checkoutBtn.textContent = "Checkout";

summary.appendChild(merchP);
summary.appendChild(shipP);
summary.appendChild(taxP);
summary.appendChild(totalStrong);
summary.appendChild(document.createElement("br"));
summary.appendChild(document.createElement("br"));
summary.appendChild(checkoutBtn);


    checkoutBtn.addEventListener("click", () => {
      alert("Order placed!");
      localStorage.removeItem("cart");
      CartView();
    });
  }

  shipType.addEventListener("change", updateSummary);
  shipDestination.addEventListener("change", updateSummary);

  updateSummary();
  container.appendChild(summary);

  view.appendChild(container);
}

document.querySelector("#test-cart-btn").addEventListener("click", () => {
  CartView();  
});
