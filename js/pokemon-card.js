var debounceTimer;
var $cards = $(".card");
var $style = $(".hover");

$cards
  .on("mousemove touchmove", function (e) {
    // Normalize touch/mouse coordinates
    var pos = [e.offsetX, e.offsetY];
    e.preventDefault();
    if (e.type === "touchmove") {
      pos = [e.touches[0].clientX, e.touches[0].clientY];
    }

    var $card = $(this);
    var l = pos[0];
    var t = pos[1];
    var h = $card.height();
    var w = $card.width();
    var px = Math.abs(Math.floor(100 / w * l) - 100);
    var py = Math.abs(Math.floor(100 / h * t) - 100);
    var pa = (50 - px) + (50 - py);

    // Background position and transform values
    var lp = (50 + (px - 50) / 1.5);
    var tp = (50 + (py - 50) / 1.5);
    var px_spark = (50 + (px - 50) / 7);
    var py_spark = (50 + (py - 50) / 7);
    var p_opc = 20 + (Math.abs(pa) * 1.5);
    var ty = ((tp - 50) / 2) * -1;
    var tx = ((lp - 50) / 1.5) * .5;

    // CSS styles for active card
    var grad_pos = `background-position: ${lp}% ${tp}%;`;
    var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`;
    var opc = `opacity: ${p_opc / 100};`;
    var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg);`;

    // Update styles using a <style> tag for pseudo-elements
    var style = `
            .card:hover:before { ${grad_pos} }  /* gradient */
            .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */
        `;

    // Apply the style and transform
    $cards.removeClass("active");
    $card.removeClass("animated");
    $card.attr("style", tf);
    $style.html(style);

    if (e.type === "touchmove") {
      return false;
    }

    // Debounce to avoid too frequent updates
    clearTimeout(debounceTimer);
  })
  .on("mouseout touchend touchcancel", function () {
    var $card = $(this);
    $style.html(""); // Reset styles
    $card.removeAttr("style");

    debounceTimer = setTimeout(function () {
      $card.addClass("animated");
    }, 2500); // Apply animation delay
  });