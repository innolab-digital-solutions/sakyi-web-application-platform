/**
 * Smooth scroll utility for internal navigation
 */

export const smoothScrollTo = (elementId: string, offset: number = 0) => {
  const element = document.querySelector(`#${elementId}`);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

export const smoothScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
