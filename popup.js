document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggleCensorship");
  
    // Load the saved toggle state
    chrome.storage.local.get("censorshipEnabled", (data) => {
      toggle.checked = data.censorshipEnabled || false;
    });
  
    // Handle toggle changes
    toggle.addEventListener("change", () => {
      const enabled = toggle.checked;
      chrome.storage.local.set({ censorshipEnabled: enabled }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "toggleCensorship",
            enabled
          });
        });
      });
    });
  });
  