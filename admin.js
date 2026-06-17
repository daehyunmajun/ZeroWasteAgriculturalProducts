import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmcwB69JNvEJ1B0QGNB62f6hWKmM_fna4",
  authDomain: "test-51faf.firebaseapp.com",
  projectId: "test-51faf",
  storageBucket: "test-51faf.firebasestorage.app",
  messagingSenderId: "894776918922",
  appId: "1:894776918922:web:bd0aaf9948207ff1057e73",
  measurementId: "G-SVXRBY2340"
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
