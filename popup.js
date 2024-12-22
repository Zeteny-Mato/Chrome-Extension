document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggleCensorship");
    const statusText = document.getElementById("statusText");
  
    // Load the saved toggle state, default to true (enabled)
    chrome.storage.local.get("censorshipEnabled", (data) => {
      const isEnabled = data.censorshipEnabled ?? true; // Default to true
      toggle.checked = isEnabled;
      statusText.textContent = isEnabled ? "Enabled" : "Disabled";
    });
  
    // Handle toggle changes
    toggle.addEventListener("change", () => {
      const isEnabled = toggle.checked;
      chrome.storage.local.set({ censorshipEnabled: isEnabled }, () => {
        statusText.textContent = isEnabled ? "Enabled" : "Disabled";
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "toggleCensorship",
            enabled: isEnabled
          });
        });
      });
    });
  });
  