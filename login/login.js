import { auth, db } from "../firebase-config.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded");

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
      alert("Vui lòng điền đủ các trường");
      return;
    }
 try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lấy role_id từ Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (userData.role_id === 1) {
        alert("Chào mừng Admin!");
        window.location.href = "../admin/admin.html";
      } else {
        alert("Đăng nhập thành công!");
        window.location.href = "../homepage/homepage.html";
      }
    } catch (error) {
      console.error("Firebase login error:", error);
      alert("Đăng nhập thất bại: " + error.message);
    }
  });
});