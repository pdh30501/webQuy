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
