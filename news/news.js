const apiKey = "cd1000a4e0c347c28f59e50014505706";
const topic = '"street food" OR "local dishes" OR "hawker food"';
const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
  topic
)}&language=en&domains=bonappetit.com,foodandwine.com,eater.com&pageSize=10&sortBy=publishedAt&apiKey=${apiKey}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("news-container");
    if (data.articles.length === 0) {
      container.innerHTML = "<p>Không tìm thấy bài viết nào.</p>";
    } else {
      data.articles.forEach((article) => {
        const div = document.createElement("div");
        div.className = "article";
        div.innerHTML = `
              <h2>${article.title}</h2>
              <p>${article.description || "Không có mô tả."}</p>
              <a href="${article.url}" target="_blank">Đọc thêm</a>
            `;
        container.appendChild(div);
      });
    }
  })
  .catch((error) => {
    document.getElementById("news-container").innerHTML =
      "<p>Không thể tải dữ liệu tin tức.</p>";
    console.error(error);
  });
// Lấy phần tử nút
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
