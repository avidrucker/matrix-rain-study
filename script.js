const container = document.getElementById('matrixContainer');
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ';
const streamLength = 20; // Number of characters in a stream

function startMatrixAnimation(fps) {
	const framesPerSecond = fps || 10; // Default to 10 FPS if not provided
	const interval = 1000 / framesPerSecond;
	const stream = document.querySelector('.stream');
	const children = stream.children;
	let i = 0;
	let blippingIn = true; // Variable to track whether we're adding or removing the "blip"
	
	function blipNext() {
	  if (blippingIn) {
		if (i < children.length) {
		  if (i !== 0) {
			children[i - 1].classList.add('rain-body');
		  }
		  children[i].classList.add('fade-out', 'rain-body');
		  i++;
		} else {
		  blippingIn = false;
		  i = 0;
		}
	  } else {
		if (i < children.length) {
		  children[i].classList.remove('fade-out', 'rain-body');
		  i++;
		} else {
		  blippingIn = true;
		  i = 0;
		}
	  }
	}
	
	setInterval(blipNext, interval);
  }
  
  // Start the animation at 1 FPS for demonstration purposes
  startMatrixAnimation(6);
  