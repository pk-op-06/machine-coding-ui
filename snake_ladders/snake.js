let players = [];
let frag = null;
let currentCoin = 0;
let number = 1;
const colors = [];
const completed = [];

const MAX_SNAKES = 5;
const MAX_LADDERS = 5;
const snakes = [];
const ladders = [];

// create a static snake and ladders layout
frag = document.createDocumentFragment();
for (let i = 10; i > 0; i--) {
  const cFrag = document.createElement("div");
  const isEven = i % 2 === 0;
  if (!isEven) {
    cFrag.classList.add("reverse");
  }
  for (let j = 0; j < 10; j++) {
    const gridItem = document.createElement("div");
    const id = i * 10 - j;
    gridItem.setAttribute("id", "item_" + id);
    gridItem.innerHTML = id;
    gridItem.classList.add("grid-item");

    cFrag.appendChild(gridItem);
  }
  cFrag.classList.add("grid");

  frag.appendChild(cFrag);
}
document.getElementsByClassName("sLContainer")[0].appendChild(frag);
document.getElementsByClassName("diceContainer")[0].style.display = "none";
document.getElementById("number").innerHTML = "";

function start() {
  document.getElementsByClassName("sLContainer")[0].style.pointerEvents =
    "none";
  document.getElementsByClassName("coins")[0].innerHTML = "";
  let coins;

  try {
    coins = parseInt(document.getElementsByTagName("input")[0].value);
    document.getElementsByClassName("sLContainer")[0].style.pointerEvents =
      "auto";

    const tempCoin = document
      .querySelector("#temp-coin")
      .content.querySelector("div");

    frag = document.createDocumentFragment();
    for (let i = 0; i < coins; i++) {
      const coin = tempCoin.cloneNode(true);
      const color = generateRandomColor();
      coin.setAttribute("id", "player_" + i);
      coin.style.backgroundColor = color;

      players.push({
        id: "player_" + i,
        color,
        position: 0,
      });

      frag.appendChild(coin);
    }
    document.getElementsByClassName("coins")[0].appendChild(frag);

    document.querySelectorAll(".movingCoin").forEach((e) => e.remove());
    // generate moving coins as well.
    for (let i = 0; i < players.length; i++) {
      const player = document.querySelector("#player_" + i);

      const movingCoin = player.cloneNode(true);
      movingCoin.setAttribute("id", "movingCoin_" + i);
      movingCoin.classList.add("movingCoin");

      const pOffset = getOffset(player);

      movingCoin.style.top = pOffset.top + "px";
      movingCoin.style.left = pOffset.left + "px";
      document.getElementsByClassName("players")[0].appendChild(movingCoin);
      // movingCoin.style.transform = "translateY(" + (pOffset.top + 30) + "px)";
      // movingCoin.style.transform += "translateX(" + (pOffset.left + 30) + "px)";
    }

    getCurrentCoin(0);
    document.getElementsByClassName("diceContainer")[0].style.display = "flex";
  } catch (error) {
    document.getElementsByClassName("sLContainer").style.pointerEvents = "none";
    console.error("Enter a number");
  }
}

function generateRandomColor() {
  let maxVal = 0xffffff; // 16777215
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);
  const finalColor = `#${randColor.toUpperCase()}`;
  if (colors.includes(finalColor)) {
    return generateRandomColor();
  }
  colors.push(finalColor);
  return finalColor;
}

function getCurrentCoin(id) {
  document.getElementById("currentCoin").innerHTML = "";
  const temp = document.querySelector("#player_" + id).cloneNode(true);
  temp.setAttribute("id", "display_coin");

  document.getElementById("currentCoin").appendChild(temp);
}

function rollDice() {
  number = Math.ceil(Math.random() * 6);
  document.getElementById("number").innerHTML = number;
  if (players[currentCoin].position + number <= 100) {
    players[currentCoin].position += number;
  }

  if (players[currentCoin].position === 100) {
    completed.push(currentCoin);
  }

  setTimeout(() => {
    setMovingCoinPosition();
  }, 100);
}

function setMovingCoinPosition() {
  moveCoin(currentCoin);
  useLadder(currentCoin);

  if (completed.length === players.length) {
    document.getElementsByClassName("roller")[0].style.pointerEvents = "none";
    return;
  }

  // update currenPlayer
  currentCoin += 1;

  // initial check
  if (currentCoin === players.length) {
    currentCoin = 0;
  }
  while (completed.includes(currentCoin)) {
    currentCoin += 1;
  }

  // after check
  if (currentCoin === players.length) {
    currentCoin = 0;
  }
  while (completed.includes(currentCoin)) {
    currentCoin += 1;
  }
  getCurrentCoin(currentCoin);
}

function moveCoin(pos) {
  console.log("currentCoin: ", pos);
  const mCoin = document.getElementById("movingCoin_" + pos);
  const item = document.getElementById("item_" + players[pos].position);
  console.log("position:", players[pos].position);

  const iOffset = getOffset(item);

  mCoin.style.top = iOffset.top + 18 + "px";
  mCoin.style.left = iOffset.left + 15 + "px";
}

function useLadder(pos) {
  const cPos = players[pos].position;
  let hasLadder = false;
  let nextPos = players[pos].position;
  ladders.forEach((ld) => {
    if (ld[0] === cPos) {
      hasLadder = true;
      nextPos = ld[1];
    }
  });
  if (hasLadder) {
    players[pos].position = nextPos;

    setTimeout(() => moveCoin(pos), 500);
  }
}

function getOffset(el) {
  var _x = 0;
  var _y = 0;
  var rect = el.getBoundingClientRect();
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return {
    top: _y,
    left: _x,
    width: rect.width,
    height: rect.height,
  };
}

const oNums = [];

function createSankes() {}

function createLadders() {
  for (let i = 0; i < 5; i++) {
    let f = gRN();
    while (true) {
      if (f > 89) {
        f = gRN();
        continue;
      }
      if (oNums.includes(f)) {
        f = gRN();
        continue;
      }
      oNums.push(f);
      break;
    }

    let s = gRN();
    while (true) {
      if (oNums.includes(s)) {
        s = gRN();
        continue;
      }

      if (s < f) {
        s = gRN();
        continue;
      }

      // f & s should not be on the same line
      if (Math.floor((s - 1) / 10) === Math.floor(f / 10)) {
        s = gRN();
        continue;
      }

      const angle = connect(
        document.getElementById("item_" + f),
        document.getElementById("item_" + s)
      );

      if (angle > 135 || angle < 45) {
        s = gRN();
        continue;
      }

      oNums.push(s);
      ladders.push([f, s]);
      break;
    }
  }

  console.log(ladders);

  ladders.forEach((ld) => {
    connect(
      document.getElementById("item_" + ld[0]),
      document.getElementById("item_" + ld[1]),
      true
    );
  });
}

function connect(div1, div2, draw = false, color = "black", thickness = 2) {
  // draw a line connecting elements
  var off1 = getOffset(div1);
  var off2 = getOffset(div2);
  // bottom right
  var x1 = off1.left + off1.width / 2;
  var y1 = off1.top + off1.height / 2;
  // top right
  var x2 = off2.left + off2.width / 2;
  var y2 = off2.top + off2.height / 2;
  // distance
  var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  // center
  var cx = (x1 + x2) / 2 - length / 2;
  var cy = (y1 + y2) / 2 - thickness / 2;
  // angle
  var angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);
  if (!draw) {
    return angle;
  }
  // make hr
  var htmlLine =
    "<div style='padding:0px; margin:0px; height:" +
    thickness +
    "px; background-color:" +
    color +
    "; line-height:1px; position:absolute; left:" +
    cx +
    "px; top:" +
    cy +
    "px; width:" +
    length +
    "px; -moz-transform:rotate(" +
    angle +
    "deg); -webkit-transform:rotate(" +
    angle +
    "deg); -o-transform:rotate(" +
    angle +
    "deg); -ms-transform:rotate(" +
    angle +
    "deg); transform:rotate(" +
    angle +
    "deg);' />";
  //
  // alert(htmlLine);
  document.body.innerHTML += htmlLine;
}

createLadders();

function gRN() {
  const nm = Math.ceil(Math.random() * 100);
  if (nm === 100 || nm === 1) {
    return gRN();
  }
  return nm;
}
