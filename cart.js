const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");

let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

renderCart();

function renderCart() {

  if(cart.length === 0){
    cartList.innerHTML =
      "<p>장바구니가 비어 있습니다.</p>";

    cartTotal.textContent = "";
    return;
  }

  let total = 0;

  cartList.innerHTML = "";

  cart.forEach((item,index)=>{

    total += item.price * item.quantity;

    cartList.innerHTML += `
      <div class="product-card">

        <div class="product-img">
          <img src="${item.image}">
        </div>

        <div class="product-info">

          <h3>${item.name}</h3>

          <div class="sale">
            ${item.price.toLocaleString()}원
          </div>

          <p>수량 : ${item.quantity}</p>

          <button onclick="increase(${index})"
            class="btn">+</button>

          <button onclick="decrease(${index})"
            class="btn">-</button>

          <button onclick="removeItem(${index})"
            class="btn">
            삭제
          </button>

        </div>

      </div>
    `;
  });

  cartTotal.textContent =
    `총 금액 : ${total.toLocaleString()}원`;
}

window.increase = function(index){

  cart[index].quantity++;

  save();
}

window.decrease = function(index){

  cart[index].quantity--;

  if(cart[index].quantity <= 0){

    cart.splice(index,1);
  }

  save();
}

window.removeItem = function(index){

  cart.splice(index,1);

  save();
}

function save(){

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  renderCart();
}

clearCartBtn.addEventListener("click",()=>{

  if(confirm("장바구니를 비우시겠습니까?")){

    localStorage.removeItem("cart");

    cart = [];

    renderCart();
  }

});
