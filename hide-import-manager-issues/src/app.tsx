// global CSS
// import globalCss from './style.css';
// CSS modules
// import styles, { stylesheet } from './style.module.css';

(function () {
  'use strict';

  // Convenience function to execute your callback only after an element matching readySelector has been added to the page.
  // Example: runWhenReady('.search-result', augmentSearchResults);
  // Gives up after 1 minute.
  function runWhenReady(
    readySelector: string,
    callback: { (): Promise<void>; (arg0: unknown): void }
  ) {
    let numAttempts = 0;
    const tryNow = () => {
      const elem = document.querySelector(readySelector);
      if (elem) {
        callback(elem);
      } else {
        numAttempts++;
        if (numAttempts >= 34) {
          console.warn(
            'Giving up after 34 attempts. Could not find: ' + readySelector
          );
        } else {
          setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
        }
      }
    };
    tryNow();
  }

  const hide = (parent: Element): void => {
    const topPanel = parent.querySelector(
      'div[class="import-item__top-panel"]'
    );
    topPanel.setAttribute('style', 'display:none');

    const bottomPanel = parent.querySelector('div[aria-label="Show tags"]');
    bottomPanel.setAttribute('style', 'display:none');

    const checkboxLabel =
      parent.querySelector(
        'div:nth-child(1) > div.import-item__top-panel > div.flex-column.block.import-item__info > div:nth-child(1) > span:nth-child(1)'
      ).textContent +
      parent.querySelector(
        'div:nth-child(1) > div.import-item__top-panel > div.flex-column.block.import-item__info > div:nth-child(1) > span:nth-child(2)'
      ).textContent;
    console.log(checkboxLabel);
  };

  const show = (parent: Element): void => {
    const topPanel = parent.querySelector(
      'div[class="import-item__top-panel"]'
    );
    topPanel.removeAttribute('style');

    const bottomPanel = parent.querySelector('div[aria-label="Show tags"]');
    bottomPanel.removeAttribute('style');
  };

  function addCheckbox(
    parent: Element,
    id: string,
    ischecked: string,
    onclick
  ): HTMLInputElement {
    const div = document.createElement('div');
    div.setAttribute('class', 'import-item__bottom-panel ');
    div.setAttribute('aria-label', 'Hide log');

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', id);
    checkbox.onclick = onclick;

    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = 'Hide';

    if (ischecked === 'true') {
      checkbox.setAttribute('checked', '1');
      hide(parent);
    } else {
      show(parent);
    }

    div.append(checkbox, label);
    parent.append(div);

    return checkbox;
  }

  const addToggle = async (): Promise<void> => {
    // alert("addToggle() !");
    const nodes = document.querySelectorAll(
      '#importLogsManager > div > div.scrollableLogsWrapper > div > div'
    );

    for (const n of nodes) {
      const id =
        'show' +
        n
          .querySelector(
            'div.import-item__top-panel > div.import-item__id-block > span'
          )
          .textContent.substring(4);
      const isChecked = (await GM.getValue(id)) as string;
      const checkbox = addCheckbox(n, id, isChecked, () => {
        if (checkbox.checked) {
          GM.setValue(id, 'true');
          hide(n);
        } else {
          GM.setValue(id, 'false');
          show(n);
        }
      });
    }
  };

  runWhenReady(
    '#importLogsManager > div > div.scrollableLogsWrapper > div',
    addToggle
  );
})();
