const showConfirmBtn = document.querySelector(".js_btn");
const closeConfirmBtn = document.querySelector(".confirm_close");
const confirmEl = document.querySelector(".confirm");
const confirmOverlayEl = document.querySelector(".confirm_overlay");
const orderFormEl = document.querySelector(".order_form");
const submitOrderBtn = document.getElementById("submitOrder");
const orderSummaryEl = document.querySelector(".order_summary");
const orderInfoEl = document.getElementById("orderInfo");
const ordersListEl = document.querySelector(".orders_list");
const ordersUlEl = document.getElementById("orders");
const showOrdersBtn = document.querySelector(".js_orders");
const backToMenuBtn = document.querySelector(".back_to_menu");

const sumElements = document.getElementsByClassName("sum_price"); // Берем по классу

// Валидация против НаН,как я уже говорил, обращаясь по классу мы получаем массив
if (sumElements.length > 0) {
  var sumText = sumElements[0].textContent; // Выбираем первый элемент
  var sumNumber = parseFloat(sumText);
} else {
  var sumNumber = 0; // Дефолт если ничего не выбрано
}

const nameOfProduct = document.getElementsByClassName("name_of_product");

let nameOfProductText = "";

if (nameOfProduct.length > 0) {
  nameOfProductText = nameOfProduct[0].textContent;
}

function showConfirm() {
  confirmEl.classList.add("show");
  confirmOverlayEl.classList.add("show");
  orderFormEl.classList.add("show");
}

function closeConfirm() {
  confirmEl.classList.remove("show");
  confirmOverlayEl.classList.remove("show");
}

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

function loadOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  ordersUlEl.innerHTML = "";
  orders.forEach((order, index) => {
    const orderEl = document.createElement("li");
    orderEl.innerHTML = `
      <p><strong>Дата:</strong> ${order.date}</p>
      <p><strong>Цена:</strong> ${order.price}</p>
      <button class="view_order" data-index="${index}">Посмотреть детали</button>
      <button class="delete_order" data-index="${index}">Удалить</button>
      <div class="order_details d_none">
        ${order.details}
      </div>
    `;
    ordersUlEl.appendChild(orderEl);
  });
}

function submitOrder() {
  const fullName = document.getElementById("fullName").value;
  const city = document.getElementById("city").value;
  const novaPoshta = document.getElementById("novaPoshta").value;
  const payment = document.querySelector('input[name="payment"]:checked')
    ? document.querySelector('input[name="payment"]:checked').value
    : "";
  const quantity = document.getElementById("quantity").value;
  const comment = document.getElementById("comment").value;

  if (!fullName || !city || !novaPoshta || !payment || !quantity) {
    alert("Пожалуйста, заполните все обязательные поля.");
    return;
  }

  const orderDetails = `
    <p><strong>Товар:</strong>${nameOfProductText}</p>
    <p><strong>ФИО покупателя:</strong> ${fullName}</p>
    <p><strong>Город:</strong> ${city}</p>
    <p><strong>Склад Новой почты:</strong> ${novaPoshta}</p>
    <p><strong>Оплата:</strong> ${
      payment === "cash" ? "Послеплата" : "Оплата банковской картой"
    }</p>
    <p><strong>Количество:</strong> ${quantity}</p>
    <p><strong>Комментарий:</strong> ${comment}</p>
  `;
  orderInfoEl.innerHTML = orderDetails;
  orderSummaryEl.classList.add("show");
  orderFormEl.classList.remove("show");
  confirmEl.classList.remove("show");

  const order = {
    date: new Date().toLocaleString(),
    price: `${quantity * sumNumber} грн`,
    details: orderDetails,
  };
  saveOrder(order);
}

function showOrders() {
  document.querySelector("nav").classList.add("d_none");
  document.querySelector(".products").classList.add("d_none");
  ordersListEl.classList.add("show");
  loadOrders();
}

function backToMenu() {
  document.querySelector("nav").classList.remove("d_none");
  document.querySelector(".products").classList.remove("d_none");
  ordersListEl.classList.remove("show");
}

function handleOrderClick(event) {
  if (event.target.classList.contains("view_order")) {
    const detailsEl = event.target.nextElementSibling.nextElementSibling;
    detailsEl.classList.toggle("show");
  } else if (event.target.classList.contains("delete_order")) {
    const index = event.target.dataset.index;
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.splice(index, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    loadOrders();
  }
}

showConfirmBtn.addEventListener("click", showConfirm);
closeConfirmBtn.addEventListener("click", closeConfirm);
submitOrderBtn.addEventListener("click", submitOrder);
showOrdersBtn.addEventListener("click", showOrders);
backToMenuBtn.addEventListener("click", backToMenu);
ordersUlEl.addEventListener("click", handleOrderClick);
