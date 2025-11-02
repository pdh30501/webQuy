// JavaScript
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { auth, db } from "../firebase-config.js";

const usernameSpan = document.getElementById("username");
const emailSpan = document.getElementById("email");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Email lấy trực tiếp từ Firebase Auth
    emailSpan.innerText = user.email;

    try {
      // Username lấy từ Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        usernameSpan.innerText = userDocSnap.data().username || "Chưa có tên";
      } else {
        usernameSpan.innerText = "Chưa có tên";
      }
    } catch (error) {
      console.error("Lỗi lấy username:", error);
      usernameSpan.innerText = "Lỗi";
    }
  } else {
    // User chưa login
    usernameSpan.innerText = "Chưa đăng nhập";
    emailSpan.innerText = "Chưa đăng nhập";
  }
});

const backToTop = document.getElementById("backToTop");

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
import { auth, db } from "../firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc
}




  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

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
// Hiện nút khi cuộn xuống 200px
window.addEventListener("scroll", () => {
  if (document.documentElement.scrollTop > 10) {
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
