(function () {
  var btn = document.createElement("a");
  btn.href = "demo.html";
  btn.setAttribute("title", "Voltar para o menu da demo");
  btn.innerHTML = "🗂️ Menu da demo";
  btn.style.position = "fixed";
  btn.style.bottom = "18px";
  btn.style.right = "18px";
  btn.style.zIndex = "9999";
  btn.style.background = "#ffffff";
  btn.style.color = "#1f365c";
  btn.style.fontFamily = "'Poppins', sans-serif";
  btn.style.fontWeight = "700";
  btn.style.fontSize = "13px";
  btn.style.padding = "10px 18px";
  btn.style.borderRadius = "999px";
  btn.style.textDecoration = "none";
  btn.style.border = "2px solid #d9b38c";
  btn.style.boxShadow = "0 4px 14px rgba(0,0,0,0.18)";
  btn.style.transition = "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease";
  btn.onmouseenter = function () {
    btn.style.transform = "translateY(-2px)";
    btn.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
    btn.style.background = "#fdf6ee";
  };
  btn.onmouseleave = function () {
    btn.style.transform = "translateY(0)";
    btn.style.boxShadow = "0 4px 14px rgba(0,0,0,0.18)";
    btn.style.background = "#ffffff";
  };
  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(btn);
  });
})();
