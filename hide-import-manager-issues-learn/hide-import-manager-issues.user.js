// ==UserScript==
// @name        New script - oomnitza.com
// @namespace   Violentmonkey Scripts
// @match       https://tech-develop.oomnitza.com/assets/assets/import
// @grant       none
// @version     1.0
// @author      -
// @description 8/30/2022, 9:07:04 PM
// @run-at      document-idle
// ==/UserScript==

(function () {
  "use strict";

  // Convenience function to execute your callback only after an element matching readySelector has been added to the page.
  // Example: runWhenReady('.search-result', augmentSearchResults);
  // Gives up after 1 minute.
  function runWhenReady(readySelector, callback) {
    var numAttempts = 0;
    var tryNow = function () {
      var elem = document.querySelector(readySelector);
      if (elem) {
        callback(elem);
      } else {
        numAttempts++;
        if (numAttempts >= 34) {
          console.warn(
            "Giving up after 34 attempts. Could not find: " + readySelector
          );
        } else {
          setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
        }
      }
    };
    tryNow();
  }

  // function addCheckbox(parent, ischecked, onclick) {
  //     const checkbox = document.createElement('input');
  //     checkbox.setAttribute('type', 'checkbox');
  //     checkbox.setAttribute('class', 'journal-link');
  //     if (ischecked) checkbox.setAttribute('checked', 1);
  //     checkbox.onclick = onclick;
  //     parent.appendChild(checkbox);
  //     return checkbox;
  //   }

  function addCheckbox(parent, ischecked, onclick) {
    const div = document.createElement("div");
    div.setAttribute("class", "import-item__bottom-panel ")
    div.setAttribute("aria-label", "Hide log")

    const id =
      "show" +
      parent
        .querySelector(
          "div.import-item__top-panel > div.import-item__id-block > span"
        )
        .textContent.substring(4);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", id);
    if (ischecked) checkbox.setAttribute("checked", 1);
    checkbox.onclick = onclick;

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = "Hide";
    
    div.append(checkbox, label);
    parent.append(div)
    
    return checkbox;
  }

  /* load settings */
  const storageKey = "oomnitza";
  const issue = location.pathname.split("/")[3];
  const settings = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (!settings[issue]) settings[issue] = [];

  runWhenReady(
    "#importLogsManager > div > div.scrollableLogsWrapper > div",
    addToggle
  );

  function addToggle() {
    // alert("addToggle() !");
    const nodes = document.querySelectorAll(
      "#importLogsManager > div > div.scrollableLogsWrapper > div > div"
    );

    for (const n of nodes) {
      const checkbox = addCheckbox(n, false, () => {
        const topPanel = n.querySelector('div[class="import-item__top-panel"]');
        if (checkbox.checked) {
          // journal.classList.remove('hidden');
          // const idx = settings[issue].indexOf(journal.id);
          // settings[issue].splice(idx, 1);
          topPanel.setAttribute("style", "display:none");
        } else {
          // journal.classList.add('hidden');
          // settings[issue].push(journal.id);
          topPanel.removeAttribute("style");
        }
        // localStorage.setItem(storageKey, JSON.stringify(settings));
      });      
    }
  }
})();
