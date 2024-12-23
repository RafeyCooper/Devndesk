const cards = document.querySelectorAll(".card");

/**
 * return a value that has been rounded to a set precision
 * @param {Number} value the value to round
 * @param {Number} precision the precision (decimal places), default: 3
 * @returns {Number}
 */
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));

/**
 * return a value that has been limited between min & max
 * @param {Number} value the value to clamp
 * @param {Number} min minimum value to allow, default: 0
 * @param {Number} max maximum value to allow, default: 100
 * @returns {Number}
 */
const clamp = (value, min = 0, max = 100) => {
    return Math.min(Math.max(value, min), max);
};

/**
 * return a value that has been re-mapped according to the from/to
 * - for example, adjust(10, 0, 100, 100, 0) = 90
 * @param {Number} value the value to re-map (or adjust)
 * @param {Number} fromMin min value to re-map from
 * @param {Number} fromMax max value to re-map from
 * @param {Number} toMin min value to re-map to
 * @param {Number} toMax max value to re-map to
 * @returns {Number}
 */
const adjust = (value, fromMin, fromMax, toMin, toMax) => {
    return round(
        toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin)
    );
};

const cardUpdate = (e, $card) => {
    // normalise touch/mouse
    var pos = [e.clientX, e.clientY];
    e.preventDefault();
    if (e.type === "touchmove") {
        pos = [e.touches[0].clientX, e.touches[0].clientY];
    }
    var dimensions = $card.getBoundingClientRect();
    var l = pos[0] - dimensions.left;
    var t = pos[1] - dimensions.top;
    var h = dimensions.height;
    var w = dimensions.width;
    var px = clamp(Math.abs((100 / w) * l), 0, 100);
    var py = clamp(Math.abs((100 / h) * t), 0, 100);

    $card.setAttribute(
        "style",
        `
      --pointer-x: ${px}%;
      --pointer-y: ${py}%;
    `
    );
};

// Loop through all cards and add the event listeners
cards.forEach(($card) => {
    $card.addEventListener("mousemove", (e) => cardUpdate(e, $card));
    $card.addEventListener("touchmove", (e) => cardUpdate(e, $card));
});






class Pixel {
    constructor(canvas, context, x, y, color, speed, delay) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = this.getRandomValue(0.1, 0.9) * speed;
        this.size = 0;
        this.sizeStep = Math.random() * 0.4;
        this.minSize = 0.5;
        this.maxSizeInteger = 2;
        this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
        this.delay = delay;
        this.counter = 0;
        this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
        this.isIdle = false;
        this.isReverse = false;
        this.isShimmer = false;
    }

    getRandomValue(min, max) {
        return Math.random() * (max - min) + min;
    }

    draw() {
        const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(
            this.x + centerOffset,
            this.y + centerOffset,
            this.size,
            this.size
        );
    }

    appear() {
        this.isIdle = false;

        if (this.counter <= this.delay) {
            this.counter += this.counterStep;
            return;
        }

        if (this.size >= this.maxSize) {
            this.isShimmer = true;
        }

        if (this.isShimmer) {
            this.shimmer();
        } else {
            this.size += this.sizeStep;
        }

        this.draw();
    }

    disappear() {
        this.isShimmer = false;
        this.counter = 0;

        if (this.size <= 0) {
            this.isIdle = true;
            return;
        } else {
            this.size -= 0.1;
        }

        this.draw();
    }

    shimmer() {
        if (this.size >= this.maxSize) {
            this.isReverse = true;
        } else if (this.size <= this.minSize) {
            this.isReverse = false;
        }

        if (this.isReverse) {
            this.size -= this.speed;
        } else {
            this.size += this.speed;
        }
    }
}


class PixelCanvasOne extends HTMLElement {
    static register(tag = "pixel-canvas-one") {
        if ("customElements" in window) {
            customElements.define(tag, this);
        }
    }

    static css = `
      :host {
        display: grid;
        inline-size: 100%;
        block-size: 100%;
        overflow: hidden;
      }
    `;

    get colors() {
        return this.dataset.colors?.split(",") || ["#f8fafc", "#f1f5f9", "#cbd5e1"];
    }

    get gap() {
        const value = this.dataset.gap || 5;
        const min = 4;
        const max = 50;

        if (value <= min) {
            return min;
        } else if (value >= max) {
            return max;
        } else {
            return parseInt(value);
        }
    }

    get speed() {
        const value = this.dataset.speed || 35;
        const min = 0;
        const max = 100;
        const throttle = 0.001;

        if (value <= min || this.reducedMotion) {
            return min;
        } else if (value >= max) {
            return max * throttle;
        } else {
            return parseInt(value) * throttle;
        }
    }

    get noFocus() {
        return this.hasAttribute("data-no-focus");
    }

    connectedCallback() {
        const canvas = document.createElement("canvas");
        const sheet = new CSSStyleSheet();

        this._parent = this.parentNode;
        this.shadowroot = this.attachShadow({ mode: "open" });

        sheet.replaceSync(PixelCanvasOne.css);

        this.shadowroot.adoptedStyleSheets = [sheet];
        this.shadowroot.append(canvas);
        this.canvas = this.shadowroot.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.timeInterval = 1000 / 60;
        this.timePrevious = performance.now();
        this.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.init();
        this.resizeObserver = new ResizeObserver(() => this.init());
        this.resizeObserver.observe(this);

        document.getElementById('card_id_1').addEventListener("mouseenter", this);
        document.getElementById('card_id_1').addEventListener("mouseleave", this);

        if (!this.noFocus) {
            this._parent.addEventListener("focusin", this);
            this._parent.addEventListener("focusout", this);
        }
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
        this._parent.removeEventListener("mouseenter", this);
        this._parent.removeEventListener("mouseleave", this);

        if (!this.noFocus) {
            this._parent.removeEventListener("focusin", this);
            this._parent.removeEventListener("focusout", this);
        }

        delete this._parent;
    }

    handleEvent(event) {
        this[`on${event.type}`](event);
    }

    onmouseenter() {
        this.handleAnimation("appear");
    }

    onmouseleave() {
        this.handleAnimation("disappear");
    }

    onfocusin(e) {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        this.handleAnimation("appear");
    }

    onfocusout(e) {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        this.handleAnimation("disappear");
    }

    handleAnimation(name) {
        cancelAnimationFrame(this.animation);
        this.animation = this.animate(name);
    }

    init() {
        const rect = this.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        this.pixels = [];
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.createPixels();
    }

    getDistanceToCanvasCenter(x, y) {
        const dx = x - this.canvas.width / 2;
        const dy = y - this.canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance;
    }

    createPixels() {
        for (let x = 0; x < this.canvas.width; x += this.gap) {
            for (let y = 0; y < this.canvas.height; y += this.gap) {
                const color = this.colors[
                    Math.floor(Math.random() * this.colors.length)
                ];
                const delay = this.reducedMotion
                    ? 0
                    : this.getDistanceToCanvasCenter(x, y);

                this.pixels.push(
                    new Pixel(this.canvas, this.ctx, x, y, color, this.speed, delay)
                );
            }
        }
    }

    animate(fnName) {
        this.animation = requestAnimationFrame(() => this.animate(fnName));

        const timeNow = performance.now();
        const timePassed = timeNow - this.timePrevious;

        if (timePassed < this.timeInterval) return;

        this.timePrevious = timeNow - (timePassed % this.timeInterval);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i][fnName]();
        }

        if (this.pixels.every((pixel) => pixel.isIdle)) {
            cancelAnimationFrame(this.animation);
        }
    }
}

class PixelCanvasTwo extends HTMLElement {
    static register(tag = "pixel-canvas-two") {
        if ("customElements" in window) {
            customElements.define(tag, this);
        }
    }

    static css = `
      :host {
        display: grid;
        inline-size: 100%;
        block-size: 100%;
        overflow: hidden;
      }
    `;

    get colors() {
        return this.dataset.colors?.split(",") || ["#f8fafc", "#f1f5f9", "#cbd5e1"];
    }

    get gap() {
        const value = this.dataset.gap || 5;
        const min = 4;
        const max = 50;

        if (value <= min) {
            return min;
        } else if (value >= max) {
            return max;
        } else {
            return parseInt(value);
        }
    }

    get speed() {
        const value = this.dataset.speed || 35;
        const min = 0;
        const max = 100;
        const throttle = 0.001;

        if (value <= min || this.reducedMotion) {
            return min;
        } else if (value >= max) {
            return max * throttle;
        } else {
            return parseInt(value) * throttle;
        }
    }

    get noFocus() {
        return this.hasAttribute("data-no-focus");
    }

    connectedCallback() {
        const canvas = document.createElement("canvas");
        const sheet = new CSSStyleSheet();

        this._parent = this.parentNode;
        this.shadowroot = this.attachShadow({ mode: "open" });

        sheet.replaceSync(PixelCanvasTwo.css);

        this.shadowroot.adoptedStyleSheets = [sheet];
        this.shadowroot.append(canvas);
        this.canvas = this.shadowroot.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.timeInterval = 1000 / 60;
        this.timePrevious = performance.now();
        this.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.init();
        this.resizeObserver = new ResizeObserver(() => this.init());
        this.resizeObserver.observe(this);

        document.getElementById('card_id_2').addEventListener("mouseenter", this);
        document.getElementById('card_id_2').addEventListener("mouseleave", this);

        if (!this.noFocus) {
            this._parent.addEventListener("focusin", this);
            this._parent.addEventListener("focusout", this);
        }
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
        this._parent.removeEventListener("mouseenter", this);
        this._parent.removeEventListener("mouseleave", this);

        if (!this.noFocus) {
            this._parent.removeEventListener("focusin", this);
            this._parent.removeEventListener("focusout", this);
        }

        delete this._parent;
    }

    handleEvent(event) {
        this[`on${event.type}`](event);
    }

    onmouseenter() {
        this.handleAnimation("appear");
    }

    onmouseleave() {
        this.handleAnimation("disappear");
    }

    onfocusin(e) {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        this.handleAnimation("appear");
    }

    onfocusout(e) {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        this.handleAnimation("disappear");
    }

    handleAnimation(name) {
        cancelAnimationFrame(this.animation);
        this.animation = this.animate(name);
    }

    init() {
        const rect = this.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        this.pixels = [];
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.createPixels();
    }

    getDistanceToCanvasCenter(x, y) {
        const dx = x - this.canvas.width / 2;
        const dy = y - this.canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance;
    }

    createPixels() {
        for (let x = 0; x < this.canvas.width; x += this.gap) {
            for (let y = 0; y < this.canvas.height; y += this.gap) {
                const color = this.colors[
                    Math.floor(Math.random() * this.colors.length)
                ];
                const delay = this.reducedMotion
                    ? 0
                    : this.getDistanceToCanvasCenter(x, y);

                this.pixels.push(
                    new Pixel(this.canvas, this.ctx, x, y, color, this.speed, delay)
                );
            }
        }
    }

    animate(fnName) {
        this.animation = requestAnimationFrame(() => this.animate(fnName));

        const timeNow = performance.now();
        const timePassed = timeNow - this.timePrevious;

        if (timePassed < this.timeInterval) return;

        this.timePrevious = timeNow - (timePassed % this.timeInterval);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i][fnName]();
        }

        if (this.pixels.every((pixel) => pixel.isIdle)) {
            cancelAnimationFrame(this.animation);
        }
    }
}

class PixelCanvasThree extends HTMLElement {
    static register(tag = "pixel-canvas-three") {
        if ("customElements" in window) {
            customElements.define(tag, this);
        }
    }

    static css = `
      :host {
        display: grid;
        inline-size: 100%;
        block-size: 100%;
        overflow: hidden;
      }
    `;

    get colors() {
        return this.dataset.colors?.split(",") || ["#f8fafc", "#f1f5f9", "#cbd5e1"];
    }

    get gap() {
        const value = this.dataset.gap || 5;
        const min = 4;
        const max = 50;

        if (value <= min) {
            return min;
        } else if (value >= max) {
            return max;
        } else {
            return parseInt(value);
        }
    }

    get speed() {
        const value = this.dataset.speed || 35;
        const min = 0;
        const max = 100;
        const throttle = 0.001;

        if (value <= min || this.reducedMotion) {
            return min;
        } else if (value >= max) {
            return max * throttle;
        } else {
            return parseInt(value) * throttle;
        }
    }

    get noFocus() {
        return this.hasAttribute("data-no-focus");
    }

    connectedCallback() {
        const canvas = document.createElement("canvas");
        const sheet = new CSSStyleSheet();

        this._parent = this.parentNode;
        this.shadowroot = this.attachShadow({ mode: "open" });

        sheet.replaceSync(PixelCanvasThree.css);

        this.shadowroot.adoptedStyleSheets = [sheet];
        this.shadowroot.append(canvas);
        this.canvas = this.shadowroot.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.timeInterval = 1000 / 60;
        this.timePrevious = performance.now();
        this.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.init();
        this.resizeObserver = new ResizeObserver(() => this.init());
        this.resizeObserver.observe(this);

        document.getElementById('card_id_3').addEventListener("mouseenter", this);
        document.getElementById('card_id_3').addEventListener("mouseleave", this);

        if (!this.noFocus) {
            this._parent.addEventListener("focusin", this);
            this._parent.addEventListener("focusout", this);
        }
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
        this._parent.removeEventListener("mouseenter", this);
        this._parent.removeEventListener("mouseleave", this);

        if (!this.noFocus) {
            this._parent.removeEventListener("focusin", this);
            this._parent.removeEventListener("focusout", this);
        }

        delete this._parent;
    }

    handleEvent(event) {
        this[`on${event.type}`](event);
    }

    onmouseenter() {
        this.handleAnimation("appear");
    }

    onmouseleave() {
        this.handleAnimation("disappear");
    }

    onfocusin(e) {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        this.handleAnimation("appear");
    }

    onfocusout(e) {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        this.handleAnimation("disappear");
    }

    handleAnimation(name) {
        cancelAnimationFrame(this.animation);
        this.animation = this.animate(name);
    }

    init() {
        const rect = this.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        this.pixels = [];
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.createPixels();
    }

    getDistanceToCanvasCenter(x, y) {
        const dx = x - this.canvas.width / 2;
        const dy = y - this.canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance;
    }

    createPixels() {
        for (let x = 0; x < this.canvas.width; x += this.gap) {
            for (let y = 0; y < this.canvas.height; y += this.gap) {
                const color = this.colors[
                    Math.floor(Math.random() * this.colors.length)
                ];
                const delay = this.reducedMotion
                    ? 0
                    : this.getDistanceToCanvasCenter(x, y);

                this.pixels.push(
                    new Pixel(this.canvas, this.ctx, x, y, color, this.speed, delay)
                );
            }
        }
    }

    animate(fnName) {
        this.animation = requestAnimationFrame(() => this.animate(fnName));

        const timeNow = performance.now();
        const timePassed = timeNow - this.timePrevious;

        if (timePassed < this.timeInterval) return;

        this.timePrevious = timeNow - (timePassed % this.timeInterval);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i][fnName]();
        }

        if (this.pixels.every((pixel) => pixel.isIdle)) {
            cancelAnimationFrame(this.animation);
        }
    }
}

class PixelCanvasFour extends HTMLElement {
    static register(tag = "pixel-canvas-four") {
        if ("customElements" in window) {
            customElements.define(tag, this);
        }
    }

    static css = `
      :host {
        display: grid;
        inline-size: 100%;
        block-size: 100%;
        overflow: hidden;
      }
    `;

    get colors() {
        return this.dataset.colors?.split(",") || ["#f8fafc", "#f1f5f9", "#cbd5e1"];
    }

    get gap() {
        const value = this.dataset.gap || 5;
        const min = 4;
        const max = 50;

        if (value <= min) {
            return min;
        } else if (value >= max) {
            return max;
        } else {
            return parseInt(value);
        }
    }

    get speed() {
        const value = this.dataset.speed || 35;
        const min = 0;
        const max = 100;
        const throttle = 0.001;

        if (value <= min || this.reducedMotion) {
            return min;
        } else if (value >= max) {
            return max * throttle;
        } else {
            return parseInt(value) * throttle;
        }
    }

    get noFocus() {
        return this.hasAttribute("data-no-focus");
    }

    connectedCallback() {
        const canvas = document.createElement("canvas");
        const sheet = new CSSStyleSheet();

        this._parent = this.parentNode;
        this.shadowroot = this.attachShadow({ mode: "open" });

        sheet.replaceSync(PixelCanvasFour.css);

        this.shadowroot.adoptedStyleSheets = [sheet];
        this.shadowroot.append(canvas);
        this.canvas = this.shadowroot.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.timeInterval = 1000 / 60;
        this.timePrevious = performance.now();
        this.reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        this.init();
        this.resizeObserver = new ResizeObserver(() => this.init());
        this.resizeObserver.observe(this);

        document.getElementById('card_id_4').addEventListener("mouseenter", this);
        document.getElementById('card_id_4').addEventListener("mouseleave", this);

        if (!this.noFocus) {
            this._parent.addEventListener("focusin", this);
            this._parent.addEventListener("focusout", this);
        }
    }

    disconnectedCallback() {
        this.resizeObserver.disconnect();
        this._parent.removeEventListener("mouseenter", this);
        this._parent.removeEventListener("mouseleave", this);

        if (!this.noFocus) {
            this._parent.removeEventListener("focusin", this);
            this._parent.removeEventListener("focusout", this);
        }

        delete this._parent;
    }

    handleEvent(event) {
        this[`on${event.type}`](event);
    }

    onmouseenter() {
        this.handleAnimation("appear");
    }

    onmouseleave() {
        this.handleAnimation("disappear");
    }

    onfocusin(e) {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        this.handleAnimation("appear");
    }

    onfocusout(e) {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        this.handleAnimation("disappear");
    }

    handleAnimation(name) {
        cancelAnimationFrame(this.animation);
        this.animation = this.animate(name);
    }

    init() {
        const rect = this.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);

        this.pixels = [];
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.createPixels();
    }

    getDistanceToCanvasCenter(x, y) {
        const dx = x - this.canvas.width / 2;
        const dy = y - this.canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance;
    }

    createPixels() {
        for (let x = 0; x < this.canvas.width; x += this.gap) {
            for (let y = 0; y < this.canvas.height; y += this.gap) {
                const color = this.colors[
                    Math.floor(Math.random() * this.colors.length)
                ];
                const delay = this.reducedMotion
                    ? 0
                    : this.getDistanceToCanvasCenter(x, y);

                this.pixels.push(
                    new Pixel(this.canvas, this.ctx, x, y, color, this.speed, delay)
                );
            }
        }
    }

    animate(fnName) {
        this.animation = requestAnimationFrame(() => this.animate(fnName));

        const timeNow = performance.now();
        const timePassed = timeNow - this.timePrevious;

        if (timePassed < this.timeInterval) return;

        this.timePrevious = timeNow - (timePassed % this.timeInterval);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i][fnName]();
        }

        if (this.pixels.every((pixel) => pixel.isIdle)) {
            cancelAnimationFrame(this.animation);
        }
    }
}

PixelCanvasOne.register();
PixelCanvasTwo.register();
PixelCanvasThree.register();
PixelCanvasFour.register();








class RadioButtonEffect {
    constructor(radioBtnGroups) {
      this.previousRadioGroup = null;
  
      radioBtnGroups.forEach((group) => {
        group.addEventListener("mouseenter", () => {
          const nodes = this.getNodes(group);
  
          if (this.previousRadioGroup && this.previousRadioGroup !== group) {
            this.changeEffect(this.getNodes(this.previousRadioGroup), false);
          }
  
          this.changeEffect(nodes, true);
          this.previousRadioGroup = group;
        });
  
        group.addEventListener("mouseleave", () => {
          const nodes = this.getNodes(group);
          this.changeEffect(nodes, false); // Revert effect when mouse leaves
        });
      });
    }
  
    getNodes(group) {
      const container = group.closest(".radio-btn-group");
      return [
        gsap.utils.shuffle(gsap.utils.selector(container)(".blue rect")),
        gsap.utils.shuffle(gsap.utils.selector(container)(".pink rect")),
      ];
    }
  
    changeEffect(nodes, isHovered) {
      gsap.to(nodes[0], {
        duration: 0.8,
        ease: "elastic.out(1, 0.3)",
        xPercent: isHovered ? "100" : "-100", // Apply animation on hover
        stagger: 0.01,
        overwrite: true,
        delay: 0.13,
      });
  
      gsap.to(nodes[1], {
        duration: 0.8,
        ease: "elastic.out(1, 0.3)",
        xPercent: isHovered ? "100" : "-100",
        stagger: 0.01,
        overwrite: true,
      });
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const radioBtnGroups = document.querySelectorAll(".radio-btn-group");
    new RadioButtonEffect(radioBtnGroups);
  });
  