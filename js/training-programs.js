(function () {
  var root = document.getElementById("programs");
  if (!root) return;

  var programs = root.querySelectorAll(".training-program");
  if (!programs.length) return;

  programs.forEach(function (program) {
    var trigger = program.querySelector(".training-program-trigger");
    var panel = program.querySelector(".training-program-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", function () {
      var isOpen = program.classList.contains("is-open");

      programs.forEach(function (other) {
        other.classList.remove("is-open");
        var otherTrigger = other.querySelector(".training-program-trigger");
        var otherPanel = other.querySelector(".training-program-panel");
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        if (otherPanel) otherPanel.hidden = true;
      });

      if (!isOpen) {
        program.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.hidden = false;
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });
})();
