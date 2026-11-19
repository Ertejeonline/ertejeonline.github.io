// Tip form on /support/. Fill in PAY once the payment accounts exist.
// Leave a value empty ("") to hide that payment option.
var PAY = {
  // Stripe Payment Links: one per preset amount, plus one "customer chooses what to pay" link for other amounts.
  // TEST MODE links (sandbox). Replace with live links before publishing.
  stripe: {
    2: "https://donate.stripe.com/test_4gMdRaewX0SvdwufsJ7kc00",
    5: "https://donate.stripe.com/test_3cI00k88zat5642gwN7kc01",
    10: "https://donate.stripe.com/test_eVqeVe3SjgRt2RQ1BT7kc02",
    20: "https://donate.stripe.com/test_28E14ofB1eJl786a8p7kc03",
    other: "https://donate.stripe.com/test_6oUcN64WneJl4ZYgwN7kc04"
  },
  // PayPal.me username (the part after paypal.me/). The amount is added to the link automatically.
  paypalMe: ""
};

(function () {
  var form = document.getElementById("give");
  if (!form) return;
  var radios = form.querySelectorAll('input[name="amount"]');
  var other = document.getElementById("amt-other");
  var error = document.getElementById("amt-error");
  var stripeBtn = form.querySelector('[data-method="stripe"]');
  var paypalBtn = form.querySelector('[data-method="paypal"]');

  var hasStripe = Object.keys(PAY.stripe).some(function (k) { return PAY.stripe[k]; });
  stripeBtn.hidden = !hasStripe;
  paypalBtn.hidden = !PAY.paypalMe;
  document.getElementById("pay-soon").hidden = hasStripe || !!PAY.paypalMe;

  function selected() {
    for (var i = 0; i < radios.length; i++) if (radios[i].checked) return radios[i].value;
    return null;
  }

  // Returns the amount as a number, or null with an error message shown.
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
    var text = n ? fmt(n) : "";
    form.querySelectorAll(".amt").forEach(function (el) { el.textContent = text; });
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
    var method = e.submitter ? e.submitter.dataset.method : (hasStripe ? "stripe" : "paypal");
    var url;
    if (method === "paypal") {
      url = "https://paypal.me/" + encodeURIComponent(PAY.paypalMe) + "/" + n.toFixed(2) + "GBP";
    } else {
      var preset = selected();
      url = (preset && PAY.stripe[preset]) || PAY.stripe.other;
    }
    if (url) window.open(url, "_blank", "noopener");
  });

  update();
})();
