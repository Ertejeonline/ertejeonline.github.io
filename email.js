// Builds the contact email link at runtime so simple scrapers don't find the address in the HTML.
document.querySelectorAll(".email").forEach(function (el) {
  var addr = el.dataset.u + "@" + el.dataset.d;
  var a = document.createElement("a");
  a.href = "mailto:" + addr;
  a.textContent = addr;
  el.replaceWith(a);
});
