export {};

const copyToClipboard = async (mode: 'html' | 'markdown') => {
  const ctTextHtml = 'text/html';
  const ctTextPlain = 'text/plain';

  const runCopier = async (
    contentGetter: (title: string, url: string) => Record<string, string>
  ) => {
    const selection = window.getSelection();

    let title: string;
    if (selection == null || selection.toString().length <= 0) {
      title = document.title;
    } else {
      title = selection.toString();
    }

    const contents = contentGetter(title, document.URL);

    await navigator.clipboard.write([
      new ClipboardItem(
        Object.fromEntries(
          Object.entries(contents).map(([type, content]) => [
            type,
            new Blob([content], { type }),
          ])
        )
      ),
    ]);
  };

  const copyAsHtml = () =>
    runCopier((title, url) => {
      const a = document.createElement('a');
      a.href = url;
      a.appendChild(document.createTextNode(title));
      const content = a.outerHTML;
      a.remove();

      return {
        [ctTextHtml]: content,
        [ctTextPlain]: url,
      };
    });

  const copyAsMarkdown = () =>
    runCopier((title, url) => {
      return {
        [ctTextPlain]: `[${title.replace(/([\[\]])/g, '\\$1')}](${url})`,
      };
    });

  try {
    switch (mode) {
      case 'html':
        await copyAsHtml();
        break;
      case 'markdown':
        await copyAsMarkdown();
        break;
    }
  } catch (e) {
    console.error(e);
  }
};

const updateContextMenus = () => {
  chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    id: 'link-it-html',
    title: 'Copy as html',
    contexts: ['action'],
  });

  chrome.contextMenus.create({
    id: 'link-it-markdown',
    title: 'Copy as markdown',
    contexts: ['action'],
  });
};

chrome.runtime.onInstalled.addListener(updateContextMenus);
chrome.runtime.onStartup.addListener(updateContextMenus);

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (tab != null && tab.id != null) {
    switch (info.menuItemId) {
      case 'link-it-html':
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: copyToClipboard,
          args: ['html'],
        });
        break;
      case 'link-it-markdown':
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: copyToClipboard,
          args: ['markdown'],
        });
        break;
    }
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id != null) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: copyToClipboard,
      args: ['html'],
    });
  }
});
