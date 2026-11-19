// Tip form on /support/. Sends the visitor to the matching Stripe Payment Link.
// One link per preset amount, plus one "customer chooses what to pay" link for other amounts.
var STRIPE_LINKS = {
  2: "https://donate.stripe.com/aFa3cw4Mi5TKgzw7LU8AE02",
  5: "https://donate.stripe.com/5kQdRa0w24PG974giq8AE04",
  10: "https://donate.stripe.com/9B628s7Yu95Werogiq8AE01",
  20: "https://donate.stripe.com/eVq28sbaGaa00Ayc2a8AE03",
  other: "https://donate.stripe.com/8x2aEYgv00zq8300js8AE00"
};

(function () {
  var form = document.getElementById("give");
  if (!form) return;
  var radios = form.querySelectorAll('input[name="amount"]');
  var other = document.getElementById("amt-other");
  var error = document.getElementById("amt-error");

  function selected() {
    for (var i = 0; i < radios.length; i++) if (radios[i].checked) return radios[i].value;
    return null;
  }

  // Returns the amount as a number, or null if it isn't a valid amount.
  function amount() {
    var preset = selected();
    if (preset) return Number(preset);
    var raw = other.value.replace(/[£,\s]/g, "");
    var n = Number(raw);
    if (!raw || !isFinite(n) || n < 1 || n > 500 || !/^\d+(\.\d{1,2})?$/.test(raw)) return null;
    return n;
  }

  function fmt(n) {
    return "£" + (n % 1 ? n.toFixed(2) : String(n));
  }

  function update() {
    var n = amount();
    form.querySelectorAll(".amt").forEach(function (el) { el.textContent = n ? fmt(n) : ""; });
    other.setAttribute("aria-invalid", other.value && !n && !selected() ? "true" : "false");
  }

  radios.forEach(function (r) {
    r.addEventListener("change", function () { other.value = ""; error.textContent = ""; update(); });
  });
  other.addEventListener("input", function () {
    if (other.value) radios.forEach(function (r) { r.checked = false; });
    error.textContent = "";
    update();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var n = amount();
    if (!n) {
      error.textContent = "Please choose an amount, or enter one between £1 and £500.";
      other.focus();
      return;
    }
    var preset = selected();
    var url = (preset && STRIPE_LINKS[preset]) || STRIPE_LINKS.other;
    window.open(url, "_blank", "noopener");
  });

  update();
})();
