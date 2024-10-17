// const contents = document.getElementById('contents');
// const contentsParent = contents.parent();

// contents.parentNode.removeChild(contents);

const parent = document.parentNode;

console.log(parent);

const image = document.createElement('img');
image.className = 'funian';
image.src = chrome.runtime.getURL('assets/zoof-icon-min.png');
// document.getElementsByTagName('body')[0].appendChild(image);
document.body.appendChild(image);

//const img = document.createElement('img');

// img.src = '../assets/zoof-icon-min.png';
// img.src = chrome.runtime.getURL('assets/zoof-icon-min.png');

// img.

//document.body.appendChild(img);
