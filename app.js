import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  remove
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmcwB69JNvEJ1B0QGNB62f6hWKmM_fna4",
  authDomain: "test-51faf.firebaseapp.com",
  databaseURL: "https://test-51faf-default-rtdb.firebaseio.com",
  projectId: "test-51faf",
  storageBucket: "test-51faf.firebasestorage.app",
  messagingSenderId: "894776918922",
  appId: "1:894776918922:web:bd0aaf9948207ff1057e73",
  measurementId: "G-SVXRBY2340"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

let products = [];

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const productList = document.getElementById("productList");
const totalWeight = document.getElementById("totalWeight");
const aiSearchBtn = document.getElementById("aiSearchBtn");
const searchInput = document.getElementById("searchInput");
const aiResult = document.getElementById("aiResult");

loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
    alert("로그인 실패");
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    userInfo.textContent = `👤 ${user.displayName}`;
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    userInfo.textContent = "";
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }
});

onValue(ref(database, "totalWeight"), (snapshot) => {
  const value = snapshot.val() || 0;
  totalWeight.textContent = `🌱 오늘 구출한 농산물 : ${value.toLocaleString()}kg`;
});

onValue(ref(database, "products"), (snapshot) => {
  const data = snapshot.val();
  productList.innerHTML = "";
  products = [];

  if (!data) {
    productList.innerHTML = "<p>등록된 상품이 없습니다.</p>";
    return;
  }

  Object.keys(data).forEach((key) => {
    const item = data[key];
    products.push({ id: key, ...item });

    productList.innerHTML += `
      <div class="product-card">
        <div class="product-img">
          <img src="${item.image}" alt="${item.name}">
        </div>

        <div class="product-info">
          <div class="tag">${item.tag}</div>
          <h3 class="name">${item.name}</h3>
          <div class="discount">${item.discount} 할인</div>
          <div class="origin">${item.originPrice.toLocaleString()}원</div>
          <div class="sale">${item.salePrice.toLocaleString()}원</div>
          <div class="stock">남은 수량 : ${item.stock}개</div>
          <button class="buy-btn" data-name="${item.name}">
            장바구니 담기
          </button>
        </div>
      </div>
    `;
  });

  document.querySelectorAll(".buy-btn").forEach((button) => {
    button.addEventListener("click", () => {
      addCart(button.dataset.name);
    });
  });
});

async function addCart(productName) {

  const user = auth.currentUser;

  if (!user) {
    alert("로그인 후 이용해주세요.");
    return;
  }

  const product =
    products.find(
      p => p.name === productName
    );

  if (!product) return;

  const cartRef = ref(
    database,
    `users/${user.uid}/cart/${product.id}`
  );

  const snapshot = await get(cartRef);

  if (snapshot.exists()) {

    const item = snapshot.val();

    await set(cartRef, {
      ...item,
      quantity: item.quantity + 1
    });

  } else {

    await set(cartRef, {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.salePrice,
      quantity: 1
    });

  }

  alert(`${product.name} 장바구니에 담았습니다.`);
}

aiSearchBtn.addEventListener("click", async () => {
  const question = searchInput.value.trim();

  if (!question) {
    alert("검색할 내용을 입력하세요.");
    return;
  }

  aiResult.textContent = "AI가 상품 정보를 분석하는 중입니다...";

  try {
    const response = await fetch("/api/ai-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question,
        products
      })
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text);
    }
        if (!response.ok) {
          throw new Error(data.error || "AI 검색 실패");
        }

    aiResult.textContent = data.answer;
  } catch (error) {
    console.error(error);
    aiResult.textContent = "AI 검색 중 오류가 발생했습니다.";
  }
});

function loadCart() {

  const user = auth.currentUser;

  if (!user) return;

  const cartRef =
    ref(
      database,
      `users/${user.uid}/cart`
    );

  onValue(cartRef,(snapshot)=>{

    const data = snapshot.val();

    console.log("장바구니",data);

  });

}
