// menu.js

import { db } from "../firebase-config.js";
import {
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const savedColor = localStorage.getItem("bgColor");
  if (savedColor) document.body.style.backgroundColor = savedColor;

  const btnChangeColor = document.getElementById("btnChangeColor");
  if (btnChangeColor) {
    btnChangeColor.addEventListener("click", () => {
      const newColor = prompt("Nhập màu nền mới:");
      if (newColor) {
        document.body.style.backgroundColor = newColor;
        localStorage.setItem("bgColor", newColor);
      }
    });
  }

  // --- Lấy danh sách món ăn từ Firestore ---
  const menuContainer = document.createElement("div");
  menuContainer.classList.add("row", "container", "my-4", "mx-auto");
  document.body.insertBefore(
    menuContainer,
    document.querySelector(".container-grid")
  );

  try {
    const querySnapshot = await getDocs(collection(db, "foods"));

    if (querySnapshot.empty) {
      menuContainer.innerHTML = `<p class="text-center">Chưa có món ăn nào.</p>`;
    } else {
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();

        const div = document.createElement("div");
        div.classList.add("col-md-3", "mb-3");
        div.innerHTML = `
          <div class="card shadow-sm ">
            <img src="${data.image}" class="card-img-top" height="175" alt="${data.name}" />
            <div class="card-body text-center ">
              <h5 class="card-title">${data.name}</h5>
              <h6 class="card-title">${data.describe}</h6>
              <p class="card-text">${data.price}.000 VND</p>
              <button class="btn btn-success btn-sm mt-2">Chọn món</button>
            </div>
          </div>
        `;

        const btnSelect = div.querySelector("button");
        btnSelect.addEventListener("click", () => {
          // Lấy danh sách món đã chọn trong localStorage
          let selectedFoods =
            JSON.parse(localStorage.getItem("selectedFoods")) || [];

          // Thêm món mới
          selectedFoods.push({
            name: data.name,
            describe: data.describe,
            price: data.price,
            image: data.image,
          });

          // Lưu lại
          localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));

          // Điều hướng sang trang giỏ hàng hoặc trang chọn món
          window.location.href = "../shopping/shop.html";
        });

        menuContainer.appendChild(div);
      });
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu món ăn:", error);
    menuContainer.innerHTML = `<p class="text-danger text-center">Không thể tải menu!</p>`;
  }
});
// Hiện nút khi cuộn xuống 200px
window.addEventListener("scroll", () => {
  if (document.documentElement.scrollTop > 190) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

// Khi click thì cuộn mượt lên đầu
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});