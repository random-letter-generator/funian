//////////////////////////////////////////
// Global Parameters
const moveStepSize = 5;
const refreshTime = 5;
let gifs = [
  'frog-rainbow',
  'snoopdogg2',
  'seridertroll',
  'dollar',
  'blackhole',
  'cat1',
  'cat-huh',
];
gifs = gifs.map((str) => 'assets/' + str + '.gif');
console.log(gifs);

const additionalStyles = document.createElement('style');
additionalStyles.innerHTML = `
  @keyframes shake {
    0% { transform: translate(5px, 5px) rotate(0deg); }
    10% { transform: translate(-5px, -5px) rotate(-1deg); }
    20% { transform: translate(-10px, 0px) rotate(1deg); }
    30% { transform: translate(10px, 5px) rotate(0deg); }
    40% { transform: translate(5px, -5px) rotate(1deg); }
    50% { transform: translate(-5px, 5px) rotate(-1deg); }
    60% { transform: translate(-10px, 5px) rotate(0deg); }
    70% { transform: translate(10px, 5px) rotate(-1deg); }
    80% { transform: translate(-5px, -5px) rotate(1deg); }
    90% { transform: translate(5px, 5px) rotate(0deg); }
    100% { transform: translate(5px, -5px) rotate(-1deg); }
    }
    .shake-effect {
      animation: shake 0.5s;
    }
  }
`;
document.head.appendChild(additionalStyles); // Inject these styles into the head of whatever the webpage user is viewing

////////////////////////////////////////////////
class Head {
  constructor(board, apple, moveStepSize, refreshTime) {
    // create the head element and style it
    this.node = document.createElement('img');
    this.node.src = chrome.runtime.getURL('assets/zoof-icon-min.png');
    this.node.style.width = '50px';
    this.node.style.height = '50px';
    this.node.style.position = 'absolute';

    // Initialize the starting position
    this.node.style.top = '0px';
    this.node.style.left = '0px';

    // append the head element to the board
    board.appendChild(this.node);

    // this is for referencing them easier in the head method
    this.apple = apple;
    this.moveStepSize = moveStepSize;

    // set the initial direction and speed
    this.currentDirection = 'right';
    this.SPEED = refreshTime;

    // Bind the move function
    this.boundMove = this.move.bind(this);

    // Start moving
    setTimeout(this.boundMove, this.SPEED);
  }

  move() {
    const step = this.moveStepSize;

    // parse the position numbers from the node style
    let topPosition = parseInt(this.node.style.top);
    let leftPosition = parseInt(this.node.style.left);

    // Update position based on direction
    if (this.currentDirection === 'right') {
      leftPosition += step;
    } else if (this.currentDirection === 'left') {
      leftPosition -= step;
    } else if (this.currentDirection === 'up') {
      topPosition -= step;
    } else if (this.currentDirection === 'down') {
      topPosition += step;
    }

    // Keep the head within the viewport
    const headWidth = this.node.offsetWidth;
    const headHeight = this.node.offsetHeight;
    const maxWidth = window.innerWidth - headWidth;
    const maxHeight = window.innerHeight - headHeight;
    // ensure the head stays within window left-right wise
    if (leftPosition < 0) {
      leftPosition = 0;
    } else if (leftPosition > maxWidth) {
      leftPosition = maxWidth;
    }
    // ensure the head stays within window top-bottom wise
    if (topPosition < 0) {
      topPosition = 0;
    } else if (topPosition > maxHeight) {
      topPosition = maxHeight;
    }

    // write the head position back to the style property
    this.node.style.left = `${leftPosition}px`;
    this.node.style.top = `${topPosition}px`;

    // Check for collision with the apple
    if (this.ifHitsApple()) {
      // add some cool effects to apple
      this.apple.node.classList.add('shake-effect');

      // after some short amount of time
      setTimeout(() => {
        // remove the effects from apple
        this.apple.node.classList.remove('shake-effect');

        // move the apple to somewhere else randomly
        this.apple.moveApple();
      }, 200);
    }

    // Continue moving the head
    setTimeout(this.boundMove, this.SPEED);
  }

  ifHitsApple() {
    const headWidth = this.node.offsetWidth;
    const headHeight = this.node.offsetHeight;
    const headLeft = parseInt(this.node.style.left);
    const headTop = parseInt(this.node.style.top);
    const headRight = headLeft + headWidth;
    const headBottom = headTop + headHeight;

    const appleWidth = this.apple.node.offsetWidth;
    const appleHeight = this.apple.node.offsetHeight;
    const appleLeft = this.apple.position.left;
    const appleTop = this.apple.position.top;
    const appleRight = appleLeft + appleWidth;
    const appleBottom = appleTop + appleHeight;

    const isOverlapHorizontally =
      headLeft < appleRight && headRight > appleLeft;

    const isOverlapVertically = headTop < appleBottom && headBottom > appleTop;

    return isOverlapHorizontally && isOverlapVertically;
  }
}
////////////////////////////////////////////////////////////////

class Apple {
  constructor(board) {
    // create apple element and style it
    this.node = document.createElement('img');
    this.gifIndex = 0;
    this.node.src = chrome.runtime.getURL(gifs[this.gifIndex]);
    this.node.style.width = '100px';
    this.node.style.height = '100px';
    this.node.style.position = 'absolute';

    // give apple an initial position
    this.position = {
      left: Math.floor(Math.random() * window.innerWidth),
      top: Math.floor(Math.random() * window.innerHeight),
    };
    this.node.style.left = `${this.position.left}px`;
    this.node.style.top = `${this.position.top}px`;

    // append the apple element to the board
    board.appendChild(this.node);
  }

  moveApple() {
    const appleWidth = this.node.offsetWidth;
    const appleHeight = this.node.offsetHeight;

    // randomly generate a new location
    this.position = {
      left: Math.random() * 0.8 * window.innerWidth + appleWidth,
      top: Math.random() * 0.8 * window.innerHeight + appleHeight,
    };

    // write the new location back to the stype property of apple element
    this.node.style.left = `${this.position.left}px`;
    this.node.style.top = `${this.position.top}px`;

    // Each time after moving the apple,
    // We loop over the gifs array to give apple a new picture
    this.gifIndex = (this.gifIndex + 1) % gifs.length;
    this.node.src = chrome.runtime.getURL(gifs[this.gifIndex]);
  }
}

/////////////////////////////////////////////////////////

// Main code to initialize the game
const runSnakeGame = () => {
  // generate the board element and style it
  const board = document.createElement('div');
  board.style.position = 'fixed';
  board.style.left = '0px';
  board.style.top = '0px';
  board.style.width = '100%'; // board occupies the entire window
  board.style.height = '100%';
  board.style.zIndex = '999999';
  board.style.pointerEvents = 'none'; // !!!! Allows clicks to pass through

  // append the board element to the body
  const body = document.body;
  body.appendChild(board);

  // create apple and head instances
  const apple = new Apple(board);
  const head = new Head(board, apple, moveStepSize, refreshTime);

  // Event listener for key presses
  document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
      e.preventDefault(); // !!!!! Disables the default action of arrow keys (i.e. scrolling)
      head.currentDirection = 'left';
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      head.currentDirection = 'right';
    } else if (e.code === 'ArrowUp') {
      e.preventDefault();
      head.currentDirection = 'up';
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      head.currentDirection = 'down';
    }
  });
};

////////////////////////////////////////////////////

// actually running the game
runSnakeGame();
