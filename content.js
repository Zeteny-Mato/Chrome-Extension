// Function to replace words with their censored versions in text nodes
function censorWords(wordsToCensor) {
  // Create a recursive function to handle text nodes
  function walk(node) {
    // Only process text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.nodeValue;

      // Loop through the words to censor
      for (const [word, replacement] of Object.entries(wordsToCensor)) {
        // Modify the word pattern to handle spaces, hyphens, and underscores
        const regexPattern = word.replace(/[-_ ]/g, "[-_ ]?");
        const regex = new RegExp(`\\b${regexPattern}\\b`, "gi"); // Case-insensitive match
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
  "African-American": "black",
  "african-american": "black",
  "African American": "black",
  "african american": "black",
  "african_american": "black",
  "African_American": "black",
};

// Load the censorship state and apply it
chrome.storage.local.get("censorshipEnabled", (data) => {
  const isEnabled = data.censorshipEnabled !== undefined ? data.censorshipEnabled : true; // Default to true
  if (isEnabled) {
    censorWords(wordsToCensor);
  }
});

// Listen for messages to toggle censorship
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleCensorship") {
    if (message.enabled) {
      censorWords(wordsToCensor);
    } else {
      window.location.reload(); // Reload to reset content
    }
  }
});
