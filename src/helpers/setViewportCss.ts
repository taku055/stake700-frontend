export const setViewportCss = (
  viewportWidth: number,
  viewportHeight: number
) => {
  document.documentElement.style.setProperty(
    "--viewport-width",
    viewportWidth + "px"
  );
  document.documentElement.style.setProperty(
    "--viewport-height",
    viewportHeight + "px"
  );
};
