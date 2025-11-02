// function check() {
//   var input1 = document.getElementById("name").value.trim();
//   const hasLetter = /[a-zA-Z]/.test(input1);
//   var input2 = document.getElementById("password").value.trim();
//   var input3 = document.getElementById("email").value.trim();
//   var length1 = input1.length;
//   var length2 = input2.length;
//   var length3 = input3.length;
//   if (length1 == 0) {
//     document.getElementById("wrongName").innerText = "Username không được bỏ trống";
//   } else if (hasLetter) {
//     if (length3 == 0) {
//       document.getElementById("wrongEmail").innerText = "Email không được bỏ trống";
//     } else if (length2 == 0) {
//       document.getElementById("wrongPass").innerText = "Password không được bỏ trống";
//     } else if (input3.includes("@gmail.com")) {
//       if (length2 < 5) {
//         document.getElementById("wrongPass").innerText = "Password phải trên 5 ký tự";
//       } else {
//         localStorage.setItem("username", input1);
//         localStorage.setItem("password", input2);
//         localStorage.setItem("email", input3);
//         window.location.href = "../login/login.html";
//       }
//     } else {
//       document.getElementById("wrongEmail").innerText = "Email phải có @gmail.com";
//     }
//   } else {
//     document.getElementById("wrongName").innerText = "Username phải có chữ trong đó";
//   }
// }
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { auth, db } from '../firebase-config.js'



//la
const inpUsername = document.querySelector("#name");
const inpEmail = document.querySelector("#email");
const inpPwd = document.querySelector("#password");
const registerForm = document.querySelector("#signup");


async function handleRegister(event) {
    event.preventDefault(); // ngan ko cho form reload

    let username = inpUsername.value.trim();
    let email = inpEmail.value.trim();
    let password = inpPwd.value;

    let role_id = 2 //guest=2, admin =1


    //kiem tra rong
    if (!username || !email || !password) {
        alert("Vui long dien du cac truong")
        return
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; //lay thong tin user vua tao

        const userData = {
            username,
            email,
            role_id,
            balance: 0,
            createdAt: new Date() // thoidiem dang ky
        }
        await setDoc(doc(db, "users", user.uid), userData);
        alert("Sign up successully, YES SIRRRRR")
        registerForm.reset()
        
    }
    catch (error) {
        console.error("Error: ", error.message)
        alert("loi" + error.message)
    }
}
//gan su kien submit cho Form
registerForm.addEventListener('submit', handleRegister)