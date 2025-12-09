import { UIClasses, UIElements, UIEvents, UIStyles } from "../utils";

/**
 * Responsible for managing the About Us view page.
 */
export const AboutUsView = {
  /**
   * Creates the view skeleton (placeholders).
   */
  create(id) {
    return UIElements.getByIds([id], ([view]) => {
      UIElements.create(view, "section", (section) => {
        UIClasses.set(section, [
          "has-background-light",
          "py-24",
          "is-relative",
        ]);
        UIElements.create(section, "div", (container) => {
          UIClasses.set(container, ["container", "px-6"]);
          CreateSubview.titles(container);
          [
            {
              title: "Team",
              content:
                "The project is developed by Manjot Singh and Ramos Jacosalem",
            },
            {
              title: "GitHub",
              content:
                "Here is the GitHub repository link: https://github.com/cjaco906/Web-II-Assign-2",
            },
            {
              title: "Technology Used",
              content:
                "The project is built using JavaScript, Tailwind and Bulma CSS frameworks.",
            },
            {
              title: "Use of AI",
              content:
                "Logo is generated using AI tool website: logo.com. AI was used to style the website, particularly for generating the CSS and ensuring the correct Bulma classes were applied. The About us section is inspired by: https://shuffle.dev/components/bulma/all/faq, The cart view is inspired by: https://shuffle.dev/editor?project=d7d23cd7859ff084453659d0fb0bb25431febd7d",
            },
          ].forEach(({ title, content }) => {
            CreateSubview.row(container, title, content);
          });
          CreateSubview.close(view, container);
        });
      });
    });
  },
};

/**
 * Helper functions for creating and initial styling of elements with validation.
 */
const CreateSubview = {
  titles(container) {
    UIElements.create(container, "p", (mini) => {
      UIClasses.set(mini, [
        "has-text-centered",
        "has-text-weight-semibold",
        "is-uppercase",
        "mb-4",
      ]);
      UIStyles.setText(mini, "About Our Project");
    });
    UIElements.create(container, "p", (big) => {
      UIClasses.set(big, [
        "title",
        "is-size-1",
        "has-text-centered",
        "has-text-weight-bold",
        "mb-6",
      ]);
      UIStyles.setText(big, "Learn More About Us");
    });
  },
  row(container, title, content) {
    UIElements.create(container, "div", (container) => {
      UIClasses.set(container, ["mb-6"]);
      UIElements.create(container, "div", (item) => {
        UIElements.create(item, "div", (box) => {
          UIClasses.set(box, ["box", "py-5", "px-6", "is-clickable"]);
          // box.style.cursor = pointer
          UIElements.create(box, "div", (row) => {
            UIClasses.set(row, [
              "is-flex",
              "is-justify-content-space-between",
              "is-align-items-center",
            ]);
            UIElements.create(row, "h3", (header) => {
              UIClasses.set(header, ["has-text-weight-semibold", "is-size-4"]);
              UIStyles.setText(header, title);
            });
            UIElements.create(row, "span", (arrow) => {
              UIStyles.setText(arrow, "▼");
            });
          });
          UIElements.create(box, "div", (container) => {
            container.style.maxHeight = "0px";
            container.style.overflow = "hidden";
            container.style.transition = "max-height 0.3s ease";

            UIElements.create(container, "p", (text) => {
              UIStyles.setText(text, content);

              UIEvents.listen([box], "click", () => {
                const open = container.style.maxHeight !== "0px";
                container.style.maxHeight = open
                  ? "0px"
                  : text.scrollHeight + 20 + "px";
              });
            });
          });
        });
      });
    });
  },
  close(view, container) {
    UIElements.create(container, "button", (close) => {
      UIClasses.set(close, ["button", "is-black", "mt-5"]);
      UIStyles.setText(close, "Close");
      UIEvents.listen([close], "click", () => {
        view.close();
      });
    });
  },
};
