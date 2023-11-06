const container = document.getElementById("matrixContainer");
const characters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ";
const streamLength = 22; // Number of characters in a stream
const trailingLength = 10;
// This is the probability that a character will be swapped on any given frame.
const swapProbability = 0.05; // 5% chance

/**
 * Creates an array of selectors based on the given count.
 * @param {number} cnt - The number of selectors to create.
 * @returns {string[]} - An array of selectors.
 */
function createSelectors(cnt) {
  let selectors = [];
  for (let i = 0; i < cnt; i++) {
    selectors.push(`stream${i}`);
  }
  return selectors;
}
const hiddenTextTester = document.getElementById("hiddenTextTester");
const widthOfHiddenText = hiddenTextTester.offsetWidth;
const widthOfMatrixContainer = container.offsetWidth; // 100vw
const numberOfStreamColumns =
  Math.floor(widthOfMatrixContainer / widthOfHiddenText) - 1;
console.log("numberOfStreamColumns", numberOfStreamColumns);
const selectors = createSelectors(numberOfStreamColumns);

/**
 * Sets up columns in the DOM for the matrix rain effect.
 * @param {string} docSelector - The CSS selector for the container element.
 * @param {string[]} streamSelectors - An array of CSS selectors for the stream elements.
 */
function setupColumns(docSelector, streamSelectors) {
  const streamContainer = document.querySelector(docSelector);
  streamSelectors.forEach((selector, idx) => {
    // <div class="stream" id="stream01"></div>
    const div = document.createElement("div");
    div.classList.add("stream");
    div.id = selector;
    streamContainer.appendChild(div);
  });
}

setupColumns("#matrixContainer", selectors);

/**
 * Generates a stream: a random string of characters with the specified length
 * from the 'characters' array of valid characters(num, ABC.., Kanji).
 * @param {number} streamLength - The length of the generated string.
 * @returns {string} The generated string.
 */
function generateRandomStreamString(streamLength) {
  let stream = "";
  for (let i = 0; i < streamLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    stream += characters[randomIndex];
  }
  return stream;
}

/**
 * Checks if a given character is a Katakana character.
 * @param {string} character - The character to check.
 * @returns {boolean} - True if the character is a Katakana character, false otherwise.
 */
function isKatakana(character) {
  const index = characters.indexOf(character);
  // Assuming the Katakana characters are at the end of the 'characters' string
  // Update the start index of Katakana characters according to your 'characters' string
  const katakanaStartIndex = characters.indexOf("ﾊ");
  return index >= katakanaStartIndex;
}

/**
 * Initializes streams for the given selectors by generating random streams
 * of characters and adding them to the corresponding containers.
 * @param {string[]} selectors - An array of CSS selectors for the containers where the streams will be added.
 * @example: initializeStreams(["#stream01", "#stream02", ..., "#streamN"])
 */
function initializeStreams(selectors) {
  selectors
    .map((x) => "#" + x)
    .forEach((selector) => {
      const streamContainer = document.querySelector(selector);
      const streamHTML = generateRandomStreamHTML(streamLength);
      streamContainer.innerHTML = streamHTML; // Set the innerHTML of the container once
    });
}

// Call this function to reinitialize the streams with random characters
/**
 * Reinitializes the stream by generating a new random stream and updating the DOM.
 * @param {string} selector - The CSS selector for the stream container element.
 * @example: reinitializeAStream("#stream01")
 */
function reinitializeAStream(selector) {
  const streamContainer = document.querySelector(selector);
  const randomStream = generateRandomStreamString(streamLength);
  streamContainer.innerHTML = ""; // Clear the current stream
  const streamHTML = generateRandomStreamHTML(streamLength);
  streamContainer.innerHTML = streamHTML; // Set the innerHTML of the container once
}

/**
 * Generates a valid stream(number, ABC.., Kanji) of the specified length
 * and returns a string of HTML representing the stream.
 * @param {number} streamLength - The length of the stream to generate.
 * @returns {string} A string of HTML representing the random stream.
 */
function generateRandomStreamHTML(streamLength) {
  const randomStream = generateRandomStreamString(streamLength);
  let streamHTML = ""; // Create a single string of HTML
  for (const char of randomStream) {
    let spanClass = "o-0";
    if (isKatakana(char)) {
      spanClass += " katakana";
    }
    streamHTML += `<span class="${spanClass}">${char}</span>`; // Add each span to the HTML string
  }
  return streamHTML;
}

// Call this function before starting the animations
initializeStreams(selectors);

/**
 * Starts the matrix animation on a single stream with the given frames per second
 * and loop with setInterval.
 * @param {number} fps - The frames per second for the animation.
 * @param {string} selector - The CSS selector for the stream to animate.
 * @example: startMatrixAnimation(12, "#stream01")
 */
function startMatrixAnimation(fps, selector) {
  const interval = 1000 / fps;
  const children = document.querySelector(selector).children; // stream.children
  let i = 0;

  function swapRandomCharacter() {
    // Only swap characters in the visible part of the stream
    const visibleCharacters = Array.from(children).slice(0, i);
    if (visibleCharacters.length > 0) {
      const randomIndex = Math.floor(Math.random() * visibleCharacters.length);
      const randomCharIndex = Math.floor(Math.random() * characters.length);
      const newChar = characters[randomCharIndex];

      visibleCharacters[randomIndex].textContent = newChar;

      // If you're using the isKatakana function elsewhere to style Katakana,
      // you should update the class here as well:
      if (isKatakana(newChar)) {
        visibleCharacters[randomIndex].classList.add("katakana");
      } else {
        visibleCharacters[randomIndex].classList.remove("katakana");
      }
    }
  }

  function blipNext() {
    if (i < children.length) {
      children[i].classList.add("o-100", "white");
      children[i].classList.remove("matrix-green", "fade-out");
    }

    if (i !== 0 && i < children.length + 1) {
      children[i - 1].classList.add("matrix-green", "fade-out");
    }

    if (i > trailingLength - 1 && i < children.length + trailingLength) {
      children[i - trailingLength].classList.remove("o-100");
    }

    i++;

    // Random chance to swap a character
    if (Math.random() < swapProbability) {
      swapRandomCharacter();
    }

    if (i >= children.length + trailingLength) {
      if (Math.random() >= 0.95) {
        i = 0;
        // reinitialize stream once before it rains again
        reinitializeAStream(selector);
      }
    }
  }

  setInterval(blipNext, interval);
}

// Start the animations for each stream
selectors
  .map((x) => "#" + x)
  .forEach((selector) => {
    startMatrixAnimation(12, selector);
  });
