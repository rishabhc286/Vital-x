fetch("../../sidebar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("sidebar-container").innerHTML = html;
    });
function toggleSidebar() {
    document.body.classList.toggle("sidebar-open");
}
document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        document.body.classList.remove("sidebar-open");
    });
});
