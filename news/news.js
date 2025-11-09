// const apiKey = "75dccaa6f5384bc1aa66f42126435eff";
const apiKey = "c642e979076e4aaca4e1c25a984a95a0";
const url = `https://api.spoonacular.com/recipes/random?number=10&apiKey=${apiKey}`;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    console.log("👉 API response:", data);
    const container = document.getElementById("news-container");

    if (!data || !data.recipes) {
      container.innerHTML = `
        <p style="color:red; font-weight:bold;">
          ❌ Không thể tải dữ liệu (API key sai, hết quota, hoặc bị chặn CORS).
        </p>`;
      return;
    }

    data.recipes.forEach((recipe) => {
      const div = document.createElement("div");
      div.className = "article";

      div.innerHTML = `
        <a href="${recipe.sourceUrl}" target="_blank" class="article-link">
          <img class="image" src="${recipe.image}" alt="${recipe.title}">
          <div class="article-content">
            <h2>${recipe.title}</h2>
            <p>${recipe.summary.replace(/<[^>]*>?/gm, '').slice(0, 180)}...</p>
          </div>
        </a>
      `;
      container.appendChild(div);
    });

  })
  .catch((err) => {
    console.error("Fetch error:", err);
    document.getElementById("news-container").innerHTML =
      "<p style='color:red;'>⚠️ Lỗi khi kết nối tới API.</p>";
  });
// Lấy phần tử nút
const backToTop = document.getElementById("backToTop");

// Hiện nút khi cuộn xuống 200px
window.addEventListener("scroll", () => {
  if (document.documentElement.scrollTop > 100) {
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
