// Khi load trang
document.addEventListener("DOMContentLoaded", () => {
  // Lấy màu đã lưu nếu có
  const savedColor = localStorage.getItem("bgColor");
  if (savedColor) {
    document.body.style.backgroundColor = savedColor;
  }

  // Giả sử bạn có nút đổi màu
  const btnChangeColor = document.getElementById("btnChangeColor");
  btnChangeColor.addEventListener("click", () => {
    const newColor = prompt("Nhập màu nền mới (tên màu hoặc hex):");
    if (newColor && newColor.trim() !== "") {
      document.body.style.backgroundColor = newColor;

      // Lưu vào localStorage
      localStorage.setItem("bgColor", newColor);
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartContainer");
  const selectedFoods = JSON.parse(localStorage.getItem("selectedFoods")) || [];

  if (selectedFoods.length === 0) {
    cartContainer.innerHTML = `<p class="text-center">Chưa có món nào được chọn.</p>`;
    return;
  }

  selectedFoods.forEach((food) => {
    const div = document.createElement("div");
    div.classList.add("col-md-3", "mb-3");
    div.innerHTML = `
      <div class="card">
        <img src="${food.image}" class="card-img-top" height="175" alt="${food.name}">
        <div class="card-body text-center">
          <h5 class="card-title">${food.name}</h5>
          <h6 class="card-text">${food.describe}</h6>
          <p class="card-text">${food.price}.000 VND</p>
          <button class="btn btn-success btn-sm mt-2">Xóa món</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(div);
  });
});
