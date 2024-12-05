// Function to replace words with their censored versions
function censorWords(wordsToCensor) {
    const bodyText = document.body.innerHTML;
  
    // Loop through the words to censor
    for (const [word, replacement] of Object.entries(wordsToCensor)) {
      const regex = new RegExp(`\\b${word}\\b`, "gi"); // Case-insensitive match for the exact word
      document.body.innerHTML = document.body.innerHTML.replace(
        regex,
        replacement
      );
    }
  }
  
  // Words to censor and their replacements
  const wordsToCensor = {
    France: "Fr*nce",
    French: "Fr*nch"
  };
  
  // Apply censorship
  censorWords(wordsToCensor);
  