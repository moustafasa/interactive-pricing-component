let sliderCont = document.querySelector(".slider-cont");
let slider = document.querySelector(".slider-cont .slider");
let sliderThumb = document.querySelector(".slider-cont .slider .thumb");
let time = document.querySelector(".check");
let viewSpan = document.querySelector(".views .value");
let priceSpan = document.querySelector(".price .value");
let data = {
  0: { views: "10k", price: "$8" },
  25: { views: "50k", price: "$12" },
  50: { views: "100k", price: "$16" },
  75: { views: "500k", price: "$24" },
  100: { views: "1m", price: "$36" },
};
let sliding = false;
let stash;
sliderThumb.addEventListener("touchstart", (e) => {
  e.preventDefault();
  sliding = true;
  stash = e.changedTouches[0].clientX;
  sliderThumb.classList.add("active");
});
sliderThumb.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (sliding) {
    e.clientX = e.changedTouches[0].clientX;
    e.movementX = e.clientX - stash;
    stash = e.clientX;
    getPosition(e);
    setSlideWidth(e);
    changeRelatedValues(e);
  }
});
sliderThumb.addEventListener("touchend", (e) => {
  e.preventDefault();
  sliding = false;
  sliderThumb.classList.remove("active");
});
sliderThumb.addEventListener("mousedown", (e) => {
  sliding = true;
  sliderThumb.classList.add("active");
});
document.addEventListener("mousemove", (e) => {
  if (sliding) {
    e.preventDefault();
    getPosition(e);
    setSlideWidth(e);
    changeRelatedValues(e);
  }
});
document.addEventListener("mouseup", (e) => {
  if (sliding) sliding = false;
  sliderThumb.classList.remove("active");
});

function getPosition(e) {
  let sliderRect = sliderCont.getBoundingClientRect();
  let mousePos = e.clientX;
  e.currentPos = mousePos - sliderRect.left;
}
function setSlideWidth(e) {
  let mousePos = Math.ceil((e.currentPos / sliderCont.clientWidth) * 100);
  let move = e.movementX > 0 ? 10 : -10;
  let value = mousePos + move;
  e.value = parseInt(slider.style.width);
  e.change = false;
  if (value % 25 === 0) {
    let finalV = Math.max(0, Math.min(value, 100));
    if (e.value === finalV) {
      e.change = false;
    } else {
      e.change = true;
      e.value = finalV;
      slider.style.width = `${e.value}%`;
    }
  }
}

function changeRelatedValues(e) {
  if (e.change) {
    let obj = data[e.value];

    let price;
    // make discount
    if (time.classList.contains("checked")) {
      price = makeDiscount(obj.price);
    } else {
      price = obj.price;
    }
    // add data to dom
    viewSpan.innerText = obj.views;
    priceSpan.innerText = price + ".00";
  }
}
// change time billing
time.addEventListener("click", (e) => {
  let value = parseInt(slider.style.width);
  if (e.currentTarget.classList.contains("checked")) {
    e.currentTarget.classList.remove("checked");
    priceSpan.innerText = data[value]["price"] + ".00";
  } else {
    priceSpan.innerText = makeDiscount(data[value]["price"]) + ".00";
    e.currentTarget.classList.add("checked");
  }
});

function makeDiscount(price) {
  let priceNum = +price.slice(1);
  return "$" + (priceNum - priceNum * 0.25);
}
