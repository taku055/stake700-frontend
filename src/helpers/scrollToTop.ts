export const scrollToTop = () => {
  document.querySelector(".body-content")?.scrollTo({
    top: 0,
    behavior: "instant",
  });
};
