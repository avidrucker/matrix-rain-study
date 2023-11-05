const container = document.getElementById('matrixContainer');
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ';
const streamLength = 20; // Number of characters in a stream

function startMatrixAnimation(fps) {
	const framesPerSecond = fps || 10; // Default to 10 FPS if not provided
	const interval = 1000 / framesPerSecond;
	const stream = document.querySelector('.stream');
	const children = stream.children;
	let i = 0;
	let goingDown = true; // New variable to track direction of animation
  
	function blipNext() {
	  if (goingDown) {
		if (i < children.length) {
		  children[i].classList.add('blip');
		  i++;
		} else {
		  goingDown = false;
		  i--; // Start removing classes from the last element
		}
	  } else {
		if (i >= 0) {
		  children[i].classList.remove('blip');
		  i--;
		} else {
		  goingDown = true;
		  i++; // Start adding classes from the first element
		}
	  }
	}
  
	setInterval(blipNext, interval);
  }
  
  // Start the animation at 1 FPS for demonstration purposes
  startMatrixAnimation(1);
  