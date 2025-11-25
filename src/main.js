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
  const view = document.querySelector("#single-product-view");

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
    console.log("ADD TO CART:", product);
  });
}

document.querySelector("#test-product-btn").addEventListener("click", () => {
  const p = {
    url: "https://picsum.photos/400",
    title: "Test Product",
    description: "Testing view ",
    price: 39.99,
    images: [
      "https://picsum.photos/100?1",
      "https://picsum.photos/100?2"
    ]
  };

  singleProductView(p);
});
