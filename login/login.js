function check() {
  var input1 = document.getElementById("name").value.trim();
  var input2 = document.getElementById("password").value.trim();
  const output1 = localStorage.getItem("username");
  const output2 = localStorage.getItem("password");
  if (input1 == output1) {
    if (input2 === output2) {
      window.location.href = "../homepage/homepage.html";
    } else {
          document.getElementById("wrongPass").innerText = "Password không đúng!";
    }
  } else {
    document.getElementById("wrongName").innerText = "Username không đúng!";
  }
}
