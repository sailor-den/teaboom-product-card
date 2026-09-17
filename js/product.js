(function () {
  const product = document.querySelector("[data-product]");

  if (!product) {
    return;
  }

  const packButtons = Array.from(product.querySelectorAll(".packs__item"));
  const skuNode = product.querySelector("[data-sku-display]");
  const priceNode = product.querySelector("[data-price-display]");
  const oldPriceNode = product.querySelector("[data-old-price-display]");
  const discountBadge = product.querySelector("[data-discount-badge]");
  const cartButton = product.querySelector("[data-add-to-cart]");
  const cartLabel = product.querySelector("[data-cart-label]");
  const toast = document.querySelector("[data-toast]");

  let toastTimerId = 0;
  let addedTimerId = 0;

  function formatPrice(value) {
    const hasCents = Math.round(value * 100) % 100 !== 0;

    return (
      new Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: hasCents ? 2 : 0,
        maximumFractionDigits: 2,
      }).format(value) + "\u00a0₽"
    );
  }

  function discountPercent(oldPrice, price) {
    if (!oldPrice || oldPrice <= price) {
      return 0;
    }

    return Math.round((1 - price / oldPrice) * 100);
  }

  function selectPack(button) {
    packButtons.forEach(function (item) {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-checked", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    const price = Number(button.dataset.price);
    const oldPrice = Number(button.dataset.oldPrice);
    const discount = discountPercent(oldPrice, price);

    skuNode.textContent = button.dataset.sku;
    priceNode.textContent = formatPrice(price);

    if (oldPrice > price) {
      oldPriceNode.hidden = false;
      oldPriceNode.textContent = formatPrice(oldPrice);
    } else {
      oldPriceNode.hidden = true;
      oldPriceNode.textContent = "";
    }

    if (discount > 0) {
      discountBadge.hidden = false;
      discountBadge.textContent = "−" + discount + "%";
    } else {
      discountBadge.hidden = true;
    }

    button.focus();
  }

  function showToast() {
    if (!toast) {
      return;
    }

    toast.classList.add("is-visible");
    window.clearTimeout(toastTimerId);
    toastTimerId = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function movePackSelection(currentIndex, offset) {
    const nextIndex = (currentIndex + offset + packButtons.length) % packButtons.length;
    selectPack(packButtons[nextIndex]);
  }

  packButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      selectPack(button);
    });

    button.addEventListener("keydown", function (event) {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          movePackSelection(index, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          movePackSelection(index, -1);
          break;
        case "Home":
          event.preventDefault();
          selectPack(packButtons[0]);
          break;
        case "End":
          event.preventDefault();
          selectPack(packButtons[packButtons.length - 1]);
          break;
        default:
          break;
      }
    });
  });

  if (cartButton && cartLabel) {
    cartButton.addEventListener("click", function () {
      cartButton.classList.add("is-added");
      cartLabel.textContent = "Добавлено";
      showToast();

      window.clearTimeout(addedTimerId);
      addedTimerId = window.setTimeout(function () {
        cartButton.classList.remove("is-added");
        cartLabel.textContent = "В корзину";
      }, 1800);
    });
  }
})();
