// Function to replace words with their censored versions in text nodes
function censorWords(wordsToCensor) {
  // Create a recursive function to handle text nodes
  function walk(node) {
    // Only process text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.nodeValue;

      // Loop through the words to censor
      for (const [word, replacement] of Object.entries(wordsToCensor)) {
        const regex = new RegExp(`\\b${word}\\b`, "gi"); // Case-insensitive match
        text = text.replace(regex, replacement);
      }

      // Update the text node's value
      node.nodeValue = text;
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "SCRIPT" && node.tagName !== "STYLE") {
      // Recursively process child nodes, excluding <script> and <style>
      for (const child of node.childNodes) {
        walk(child);
      }
    }
  }

  // Start walking the DOM from the body
  walk(document.body);
}

// Words to censor and their replacements
const wordsToCensor = {
  france: "fr*nce",
  french: "fr*nch",
};

// Load the censorship state and apply it
chrome.storage.local.get("censorshipEnabled", (data) => {
  if (data.censorshipEnabled ?? true) { // Default to true
    censorWords(wordsToCensor);
  }
});

// Listen for messages to toggle censorship
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleCensorship") {
    if (message.enabled) {
      censorWords(wordsToCensor);
    } else {
      window.location.reload(); // Reload the page to reset the content
    }
  }
});