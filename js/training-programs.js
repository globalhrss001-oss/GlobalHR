(function () {
  var movedPrograms = {
    "program-panel-keppel": "services.html#program-panel-keppel",
    "program-panel-hss": "services.html#program-panel-hss",
    "program-panel-mechanical": "services.html#program-panel-mechanical",
    "program-panel-scaffolding": "services.html#program-panel-scaffolding",
    "program-panel-alpine-scaffolding": "services.html#program-panel-alpine-scaffolding",
    "program-panel-forklift": "services.html#program-panel-forklift",
  };
  var movedHash = (location.hash || "").replace("#", "");
  if (movedPrograms[movedHash]) {
    location.replace(movedPrograms[movedHash]);
    return;
  }

  var programRoot = document.getElementById("programs");
  if (programRoot) {
    var programs = programRoot.querySelectorAll(".training-program");
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
  }

  var storyRoot = document.getElementById("highlights-stories");
  if (!storyRoot) return;

  var stories = storyRoot.querySelectorAll(".story-preview");
  if (!stories.length) return;

  function closeStories() {
    stories.forEach(function (story) {
      story.classList.remove("is-open");
      var trigger = story.querySelector(".story-preview__trigger");
      var panel = story.querySelector(".story-preview__panel");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
    });
  }

  function openStory(story, scroll) {
    closeStories();
    var trigger = story.querySelector(".story-preview__trigger");
    var panel = story.querySelector(".story-preview__panel");
    story.classList.add("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    if (panel) {
      panel.hidden = false;
      if (scroll) {
        story.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  stories.forEach(function (story) {
    var trigger = story.querySelector(".story-preview__trigger");
    var panel = story.querySelector(".story-preview__panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", function () {
      if (story.classList.contains("is-open")) {
        closeStories();
        return;
      }
      openStory(story, false);
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  function openFromHash() {
    var id = (window.location.hash || "").replace("#", "");
    if (!id) return;
    var story = document.getElementById(id);
    if (!story || !story.classList.contains("story-preview")) return;
    openStory(story, true);
  }

  openFromHash();
  window.addEventListener("hashchange", openFromHash);
})();
