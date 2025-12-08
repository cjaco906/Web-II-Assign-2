export function showToast(message) {
  const bar = document.querySelector("#snackbar");

  bar.textContent = message;
  bar.classList.add("show");

  setTimeout(() => {
    bar.classList.remove("show");
  }, 4000);
}
