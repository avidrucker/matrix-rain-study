const container = document.getElementById("matrixContainer");
const characters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ";
const streamLength = 22; // Number of characters in a stream
const trailingLength = 10;
// This is the probability that a character will be swapped on any given frame.
const swapProbability = 0.05; // 5% chance

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
const numberOfStreamColumns = Math.floor(widthOfMatrixContainer / widthOfHiddenText) - 1;
console.log("numberOfStreamColumns", numberOfStreamColumns);
const selectors = createSelectors(numberOfStreamColumns);

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

// Function to generate a random stream of characters
function generateRandomStream(streamLength) {
  let stream = "";
  for (let i = 0; i < streamLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    stream += characters[randomIndex];
  }
  return stream;
}

// Function to check if the character is Katakana
function isKatakana(character) {
  const index = characters.indexOf(character);
  // Assuming the Katakana characters are at the end of the 'characters' string
  // Update the start index of Katakana characters according to your 'characters' string
  const katakanaStartIndex = characters.indexOf("ﾊ");
  return index >= katakanaStartIndex;
}

// Call this function to initialize the streams with random characters
function initializeStreams(selectors) {
	selectors
		.map((x) => "#" + x)
		.forEach((selector) => {
			const streamContainer = document.querySelector(selector);
			const randomStream = generateRandomStream(streamLength);
			let streamHTML = ""; // Create a single string of HTML
			for (const char of randomStream) {
				let spanClass = "o-0";
				if (isKatakana(char)) {
					spanClass += " katakana";
				}
				streamHTML += `<span class="${spanClass}">${char}</span>`; // Add each span to the HTML string
			}
			streamContainer.innerHTML = streamHTML; // Set the innerHTML of the container once
		});
}

function reinitializeStream(selector) {
  const streamContainer = document.querySelector(selector);
  const randomStream = generateRandomStream(streamLength);
  streamContainer.innerHTML = ""; // Clear the current stream
  for (const char of randomStream) {
    const span = document.createElement("span");
    span.textContent = char;
    span.classList.add("o-0");
    // Optionally add a class if it's a Katakana character
    if (isKatakana(char)) {
      span.classList.add("katakana");
    }
    streamContainer.appendChild(span);
  }
}

// Call this function before starting the animations
initializeStreams(selectors);

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
        reinitializeStream(selector);
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
