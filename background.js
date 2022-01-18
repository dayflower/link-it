chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  id: 'link-it-html',
  title: 'Copy as html',
  contexts: ['browser_action'],
  onclick: function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'html',
      });
    });
  },
});

chrome.contextMenus.create({
  id: 'link-it-markdown',
  title: 'Copy as markdown',
  contexts: ['browser_action'],
  onclick: function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'markdown',
      });
    });
  },
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'click' });
});
