import { auth, db } from "../firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const foodForm = document.getElementById("foodForm");
const foodList = document.getElementById("foodList");

// 💡 Thay bằng Cloudinary config của bạn:
const CLOUD_NAME = "dmyln9mqv"; 
const UPLOAD_PRESET = "food_upload"; 

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
          <h5 class="card-title">${data.name}</h5>
          <h6 class="card-title">${data.describe}<h6>
          <p>${data.price}.000 VND</p>
          <button class="btn btn-sm btn-warning" onclick="editFood('${docSnap.id}', '${data.name}', '${data.image}', ${data.price})">Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="deleteFood('${docSnap.id}')">Xóa</button>
        </div>
      </div>
    `;
    foodList.appendChild(div);
  });
}

// ================== KIỂM TRA ADMIN ==================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Bạn cần đăng nhập để truy cập trang này!");
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
        alert("Bạn không có quyền truy cập trang admin!");
        window.location.href = "../homepage/homepage.html";
      }
    } else {
      alert("Không tìm thấy thông tin người dùng!");
      window.location.href = "../login/login.html";
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền:", error);
    alert("Đã xảy ra lỗi khi kiểm tra quyền truy cập!");
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

  if (!file) {
    alert("Vui lòng chọn ảnh!");
    return;
  }

  try {
    // Upload lên Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "food_upload"); // đúng tên preset bạn đã tạo

    const CLOUD_NAME = "dkknjllhm"; // kiểm tra trùng chính xác Cloud name trong Dashboard
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Cloudinary response:", data); // xem phản hồi thật trong console

    if (data.error) {
      throw new Error("Cloudinary: " + data.error.message);
    }

    const imageURL = data.secure_url;
    if (!imageURL) {
      throw new Error("Không nhận được link ảnh từ Cloudinary.");
    }

    // Lưu vào Firestore
    await addDoc(collection(db, "foods"), {
      name,
      price,
      describe,
      image: imageURL,
    });

    alert("Thêm món thành công!");
    foodForm.reset();
    loadFoods();
  } catch (error) {
    console.error("Lỗi upload Cloudinary:", error);
    alert("Upload thất bại: " + error.message);
  }
});

// ================== XÓA / SỬA MÓN ==================
window.deleteFood = async (id) => {
  await deleteDoc(doc(db, "foods", id));
  alert("Đã xóa món!");
  loadFoods();
};

window.editFood = async (id, name, describe, image, price) => {
  const newName = prompt("Tên mới:", name);
  const newDes = prompt("Mô tả mới:", describe);
  const newPrice = prompt("Giá mới:", price);
  if (newName && newPrice && newDes) {
    await updateDoc(doc(db, "foods", id), {
      name: newName,
      describe: newDes,
      price: parseFloat(newPrice)
    });
    alert("Cập nhật thành công!");
    loadFoods();
  }
};
