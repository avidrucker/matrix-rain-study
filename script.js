const container = document.getElementById('matrixContainer');
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ';
const streamLength = 20; // Number of characters in a stream

function startMatrixAnimation(fps) {
	const framesPerSecond = fps || 10; // Default to 10 FPS if not provided
	const interval = 1000 / framesPerSecond;
	const stream = document.querySelector('.stream');
	const children = stream.children;
	let i = 0;
  
	function blipNext() {
	  if (i < children.length) {
		children[i].classList.add('blip');
		i++;
	  } else {
		clearInterval(intervalId); // Stop the interval when done
	  }
	}
  
	const intervalId = setInterval(blipNext, interval);
  }
  
  // Start the animation at 1 FPS for demonstration purposes
  startMatrixAnimation(1);
  