import { auth, db } from "../firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

function showToast(message, type = "info", duration = 3500) {
  const toastContainer = document.getElementById("toast");
  const toast = document.createElement("div");
  toast.className = `toast-message toast-${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), duration + 500);
}

showToast("Chào mừng admin!", "info", 5000);

const foodForm = document.getElementById("foodForm");
const foodList = document.getElementById("foodList");

// 🔧 modal + input
const modal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editDesc = document.getElementById("editDesc");
const editPrice = document.getElementById("editPrice");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

// ================== HIỂN THỊ DANH SÁCH ==================
async function loadFoods() {
  foodList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "foods"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("col-md-3", "mb-3");
    div.innerHTML = `
      <div class="card shadow-sm">
        <img src="${data.image}" class="card-img-top" height="175" alt="${data.name}" />
        <div class="card-body">
          <h5 class="card-title food-name">${data.name}</h5>
          <h6 class="card-title food-desc">${data.describe}</h6>
          <p class="food-price">${data.price}.000 VND</p>
          <button class="btn btn-sm btn-warning edit-btn" data-id="${docSnap.id}">Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="deleteFood('${docSnap.id}')">Xóa</button>
        </div>
      </div>
    `;
    foodList.appendChild(div);
  });

  // ✅ Gắn sự kiện sửa SAU khi render
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const nameEl = card.querySelector(".food-name");
      const descEl = card.querySelector(".food-desc");
      const priceEl = card.querySelector(".food-price");

      // Gán dữ liệu cũ vào form
      editName.value = nameEl.textContent;
      editDesc.value = descEl.textContent;
      editPrice.value = parseInt(priceEl.textContent);

      // Hiển thị modal
      modal.classList.add("show");

      // Khi nhấn Lưu
      saveBtn.onclick = async () => {
        await updateDoc(doc(db, "foods", btn.dataset.id), {
          name: editName.value,
          describe: editDesc.value,
          price: parseFloat(editPrice.value),
        });

        modal.classList.remove("show");
        showToast("Cập nhật thành công!", "success");
        loadFoods();
      };
    });
  });
}

// ================== KIỂM TRA ADMIN ==================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    showToast("⚠️ Khoan, bạn cần đăng nhập để truy cập trang này! ⚠️", "warning");
    window.location.href = "../login/login.html";
    return;
  }

  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const role_id = userDocSnap.data().role_id;
      if (role_id === 1) {
        console.log("Admin verified");
        loadFoods();
      } else {
        showToast("⚠️ Bạn không có quyền truy cập trang admin! ⚠️", "warning");
        window.location.href = "../homepage/homepage.html";
      }
    } else {
      showToast("Không tìm thấy thông tin người dùng!", "error");
      window.location.href = "../login/login.html";
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền:", error);
    showToast("Đã xảy ra lỗi khi kiểm tra quyền truy cập!", "error");
    window.location.href = "../login/login.html";
  }
});

// ================== THÊM MÓN (UPLOAD CLOUDINARY) ==================
foodForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("foodName").value.trim();
  const describe = document.getElementById("foodDescribe").value.trim();
  const price = parseFloat(document.getElementById("foodPrice").value);
  const file = document.getElementById("foodImage").files[0];

  if (!file) return showToast("Vui lòng chọn ảnh!", "error");

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "food_upload");

    const CLOUD_NAME = "dkknjllhm";
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    if (data.error) throw new Error("Cloudinary: " + data.error.message);
    const imageURL = data.secure_url;
    if (!imageURL) throw new Error("Không nhận được link ảnh từ Cloudinary.");

    await addDoc(collection(db, "foods"), { name, price, describe, image: imageURL });

    showToast("Thêm món thành công!", "success");
    foodForm.reset();
    loadFoods();
  } catch (error) {
    console.error("Lỗi upload Cloudinary:", error);
    showToast("Upload thất bại: " + error.message, "error");
  }
});

// ================== XÓA ==================
window.deleteFood = async (id) => {
  await deleteDoc(doc(db, "foods", id));
  showToast("Đã xóa món!", "success");
  loadFoods();
};

// ================== ẨN / ĐÓNG MODAL ==================
cancelBtn.addEventListener("click", () => modal.classList.remove("show"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});
