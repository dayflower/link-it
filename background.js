chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  id: 'link-it',
  title: 'Copy link with title',
  contexts: ['browser_action'],
  onclick: function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'html',
      });
    });
  },
});
