import { ProductBrowsing } from '../api'
import { Routes } from '../routes'
import {
  UIClasses,
  UIAttributes,
  UIElements,
  UIStyles,
  UIEvents,
  Result,
  Validation
} from '../utils'

const Identifiers = {
  IMAGE_MAIN: 'details-main-image',
  IMAGE_OTHER_SECOND: 'details-other-second',
  IMAGE_OTHER_THIRD: 'details-other-third',
  TITLE: 'details-title',
  PRICE: 'details-price',
  DESCRIPTION: 'details-description',
  MATERIAL: 'details-material',
  COLORS: 'details-color',
  SIZES: 'details-sizes',
  QUANTITY: 'details-quantity',
  RECOMMENDATIONS: 'details-recommendations'
}

export const ProductView = {
  create (id) {
    return UIElements.getByIds([id], ([view]) => {
      UIElements.create(view, 'div', container => {
        UIClasses.set(container, ['columns', 'is-variable', 'is-8'])

        // left side images
        CreateSubviews.images(container)

        // right side details
        CreateSubviews.details(container)
      })

      // recommendations under it
      CreateSubviews.recommendations(view)
    })
  },
  update (product) {
    UpdateSubview.details(product)
    UpdateSubview.recommendations(product)
  }
}

export const ProductOverview = {
  create (parent, title, products) {
    UIElements.create(parent, 'div', container => {
      UIClasses.set(container, ['container, is-variable, is-8'])

      UIElements.create(container, 'h2', header => {
        UIClasses.add(header, [
          'title',
          'is-3',
          'has-text-weight-light',
          'mb-6'
        ])
        UIStyles.setText(header, title)
      })
      UIElements.create(container, 'div', columns => {
        UIClasses.add(columns, ['columns', 'is-multiline'])

        for (const [index, product] of Object.entries(products)) {
          UIElements.create(columns, 'div', container => {
            UIClasses.add(container, ['column', 'is-one-quarter'])
            UIElements.create(container, 'div', card => {
              UIClasses.add(card, ['card', 'product-card'])
              UIElements.create(card, 'div', imagec => {
                UIClasses.add(imagec, ['card-image'])
                UIElements.create(imagec, 'figure', figure => {
                  UIClasses.add(figure, ['image', 'is-3by4'])
                  UIElements.create(figure, 'img', image => {
                    UIAttributes.set(image, [
                      ['src', 'https://picsum.photos/400?' + index]
                    ])
                  })
                })
              })
              UIElements.create(card, 'div', content => {
                UIClasses.add(content, ['card-content'])
                UIElements.create(content, 'p', title => {
                  UIClasses.add(title, [
                    'title',
                    'is-6',
                    'has-text-weight-light'
                  ])
                  UIStyles.setText(title, product.name)
                })
                UIElements.create(content, 'p', price => {
                  UIClasses.add(price, ['subtitle', 'is-6', 'has-text-grey'])
                  UIStyles.setText(price, product.price)
                })
              })
              UIEvents.listen([card], 'click', () => {
                Routes.product(product)
              })
            })
          })
        }
      })
    })
  }
}

const CreateSubviews = {
  images (view) {
    UIElements.create(view, 'div', images => {
      UIClasses.set(images, ['column', 'is-half', 'product-images'])

      UIElements.create(images, 'figure', fig => {
        UIClasses.add(fig, ['image', 'is-4by5'])
        UIElements.create(fig, 'img', main => {
          UIAttributes.set(main, [['id', Identifiers.IMAGE_MAIN]])
        })
      })

      UIElements.create(images, 'div', thumbRow => {
        UIClasses.add(thumbRow, ['columns', 'is-mobile', 'thumbnail-row'])

        UIElements.create(thumbRow, 'div', col => {
          UIClasses.add(col, ['column', 'is-3'])
          UIElements.create(col, 'img', img => {
            UIAttributes.set(img, [['id', Identifiers.IMAGE_OTHER_SECOND]])
          })
        })

        UIElements.create(thumbRow, 'div', col => {
          UIClasses.add(col, ['column', 'is-3'])
          UIElements.create(col, 'img', img => {
            UIAttributes.set(img, [['id', Identifiers.IMAGE_OTHER_THIRD]])
          })
        })
      })
    })
  },

  details (view) {
    UIElements.create(view, 'div', details => {
      UIClasses.set(details, ['column', 'is-half', 'product-details'])

      UIElements.create(details, 'h1', title => {
        UIClasses.set(title, ['title', 'is-2'])
        UIElements.setId(title, Identifiers.TITLE)
      })

      UIElements.create(details, 'p', price => {
        UIClasses.set(price, ['title', 'is-4', 'has-text-weight-semibold'])
        UIElements.setId(price, Identifiers.PRICE)
      })

      UIElements.create(details, 'p', desc => {
        UIClasses.set(desc, ['mt-4'])
        UIElements.setId(desc, Identifiers.DESCRIPTION)
      })

      // Material
      UIElements.create(details, 'p', material => {
        UIClasses.set(material, ['mt-3'])
        material.innerHTML =
          "<strong>Material:</strong> <span id='" +
          Identifiers.MATERIAL +
          "'></span>"
      })

      UIElements.create(details, 'div', colors => {
        UIClasses.set(colors, ['placeholder'])
        UIElements.setId(colors, Identifiers.COLORS)
      })

      UIElements.create(details, 'div', sizes => {
        UIClasses.set(sizes, ['placeholder'])
        UIElements.setId(sizes, Identifiers.SIZES)
      })

      // Quantity
      UIElements.create(details, 'div', qtyBox => {
        UIClasses.set(qtyBox, ['field', 'mt-4'])
        qtyBox.innerHTML = `
        <label class="label">Quantity:</label>
        <div class="control">
          <input id="${Identifiers.QUANTITY}" class="input" type="number" value="1" min="1">
        </div>
      `
      })

      // Add to Cart button
      UIElements.create(details, 'button', btn => {
        UIClasses.set(btn, ['button', 'is-black', 'is-medium', 'mt-4'])
        btn.textContent = 'Add to Cart'
      })
    })
  },

  recommendations (view) {
    UIElements.create(view, 'section', recommendations => {
      UIClasses.set(recommendations, ['section'])
      UIElements.setId(recommendations, Identifiers.RECOMMENDATIONS)
    })
  }
}

const UpdateSubview = {
  details (product) {
    UIElements.getByIds([Identifiers.TITLE], ([title]) => {
      UIStyles.setText(title, product.name)
    })
    UIElements.getByIds([Identifiers.PRICE], ([price]) => {
      UIStyles.setText(price, product.price)
    })
    UIElements.getByIds([Identifiers.DESCRIPTION], ([description]) => {
      UIStyles.setText(description, product.description)
    })
    UIElements.getByIds([Identifiers.MATERIAL], ([material]) => {
      UIStyles.setText(material, product.material)
    })

    //color box
    const colorsBox = document.querySelector(`#${Identifiers.COLORS}`)
    colorsBox.innerHTML = "<p class='label mt-4'>Color:</p>"

    product.color.forEach(c => {
      const box = document.createElement('div')
      box.className = 'color-box'
      box.style.backgroundColor = c.hex 
      
        box.addEventListener("click", () => {
    colorsBox.querySelectorAll(".color-box").forEach(el => el.classList.remove("selected"));
    box.classList.add("selected");
  });

      colorsBox.appendChild(box)
    })

    //size box
    const sizesBox = document.querySelector(`#${Identifiers.SIZES}`)
    sizesBox.innerHTML = "<p class='label mt-4'>Size:</p>"

    product.sizes.forEach(s => {
      const btn = document.createElement('button')
      btn.className = 'size-btn'
      btn.textContent = s

        btn.addEventListener("click", () => {
    sizesBox.querySelectorAll(".size-btn").forEach(el => el.classList.remove("selected"));
    btn.classList.add("selected");
  });
  
      sizesBox.appendChild(btn)
    })
  },
  recommendations(product) {
    UIElements.getByIds([Identifiers.RECOMMENDATIONS], ([recommendations]) => {
      Result.compute(
        [ProductBrowsing.getRecommendations(product, 4)],
        ([products]) => {
          ProductOverview.create(recommendations, "Related Products", products);
        }
      );
    });
  },

  recommendations (product) {
    UIElements.getByIds(
      [Identifiers.RECOMMENDATIONS],
      async ([recommendations]) => {
        const related = await ProductBrowsing.getRecommendations(product, 4)

        if (related.ok) {
          ProductOverview.create(
            recommendations,
            'Related Products',
            related.data
          )
        }
      }
    )
  }
}
