import { auth, db } from "../firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded");

  function showToast(message, type = "info", duration = 3500) {
    const toastContainer = document.getElementById("toast");

    // Tạo phần tử thông báo
    const toast = document.createElement("div");
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;

    // Thêm vào DOM
    toastContainer.appendChild(toast);

    // Xóa sau khi hết thời gian
    setTimeout(() => {
      toast.remove();
    }, duration + 500); // chờ animation fade out xong
  }
  // showToast("Đăng nhập thành công!", "success");
  // showToast("Lỗi kết nối server!", "error");
  // showToast("Cảnh báo: Bạn sắp hết phiên!", "warning");
  // showToast("Đang tải dữ liệu...", "info", 5000);

  const inpEmail = document.querySelector("#email");
  const inpPwd = document.querySelector("#password");
  const loginForm = document.querySelector(".login123");

  if (!loginForm) {
    console.error("Form .Login not found!");
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    const email = inpEmail.value.trim();
    const password = inpPwd.value;

    if (!email || !password) {
      showToast("Vui lòng điền đủ thông tin!", "error");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Lấy role_id từ Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (userData.role_id === 1) {
        showToast("Đăng nhập thành công!", "success");
        showToast("Chào mừng Admin!", "info", 4250);
        window.location.href = "../admin/admin.html";
      } else {
        showToast("Đăng nhập thành công!", "success");
        window.location.href = "../homepage/homepage.html";
      }
    } catch (error) {
      console.error("Firebase login error:", error);
      showToast("Đăng nhập thất bại: " + error.message, "error");
    }
  });
});
