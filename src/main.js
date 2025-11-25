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
