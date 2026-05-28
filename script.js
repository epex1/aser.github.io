function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth"
  });
}

// Simple animation on load
window.onload = () => {
  console.log("Portfolio Loaded 🚀");
};
