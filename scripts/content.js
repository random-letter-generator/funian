// const contents = document.getElementById('contents');
// const contentsParent = contents.parent();

// contents.parentNode.removeChild(contents);

// const parent = document.parentNode;

// console.log(parent);

const image = document.createElement('img');
image.className = 'funian';
image.src = chrome.runtime.getURL('assets/zoof-icon-min.png');
image.style.zIndex = '9999';
image.style.position = 'fixed';
image.style.height = '100px';
image.style.width = '100px';

// have to manually set up the top and left positions
// default value won't let it show up
image.style.top = '10px';
image.style.left = '10px';

image.style.backgroundColor = 'red';
//document.body.appendChild(image);
const body = document.getElementsByTagName('body')[0];

body.appendChild(image);

body.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') {
    console.log('pressed left');
  }
});
body.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowRight') {
    console.log('pressed right');
  }
});

body.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp') {
    console.log('pressed up');
  }
});

body.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowDown') {
    console.log('pressed down');
  }
});

//const img = document.createElement('img');

// img.src = '../assets/zoof-icon-min.png';
// img.src = chrome.runtime.getURL('assets/zoof-icon-min.png');

// img.

//document.body.appendChild(img);
