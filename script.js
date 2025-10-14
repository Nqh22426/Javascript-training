const menuItems = document.querySelectorAll(".sidebar ul li");
const sections = document.querySelectorAll(".section");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    // Bỏ active ở các mục khác
    menuItems.forEach(li => li.classList.remove("active"));
    item.classList.add("active");

    // Lấy id của section cần hiển thị
    const sectionId = item.getAttribute("data-section");

    // Ẩn tất cả section, chỉ hiện section được chọn
    sections.forEach(sec => {
      sec.classList.remove("active");
      if (sec.id === sectionId) {
        sec.classList.add("active");
      }
    });
  });
});