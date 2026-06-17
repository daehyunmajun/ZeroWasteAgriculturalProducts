import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "네 설정 그대로",
  authDomain: "네 설정 그대로",
  databaseURL: "네 설정 그대로",
  projectId: "네 설정 그대로",
  storageBucket: "네 설정 그대로",
  messagingSenderId: "네 설정 그대로",
  appId: "네 설정 그대로"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

document
.getElementById("addBtn")
.addEventListener("click", async () => {

  const product = {

    name:
      document.getElementById("name").value,

    tag:
      document.getElementById("tag").value,

    image:
      document.getElementById("image").value,

    originPrice:
      Number(
        document.getElementById("originPrice").value
      ),

    salePrice:
      Number(
        document.getElementById("salePrice").value
      ),

    discount:
      document.getElementById("discount").value,

    stock:
      Number(
        document.getElementById("stock").value
      )
  };

  await push(
    ref(database, "products"),
    product
  );

  alert("상품 등록 완료");

});
