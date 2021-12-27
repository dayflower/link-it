chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'html') {
    const selection = window.getSelection();
    let title;
    if (selection == null || selection.toString().length <= 0) {
      title = document.title;
    } else {
      title = selection.toString();
    }

    const url = document.URL;

    const a = document.createElement('a');
    a.href = url;
    a.appendChild(document.createTextNode(title));
    const content = a.outerHTML;
    a.remove();

    const clipboardEventListener = (e) => {
      e.preventDefault();
      e.clipboardData.setData('text/html', content);
      e.clipboardData.setData('text/plain', url);
    };

    document.addEventListener('copy', clipboardEventListener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', clipboardEventListener);
  }
});
