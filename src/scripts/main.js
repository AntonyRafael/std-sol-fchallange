let drawnNumberApi;
// Api fetch
const getApi = async (url) => {
  const response = await fetch(url);
  const value = await response.json();
  return value;
};

let input = document.querySelector("#number");
const btnSend = document.querySelector(".send");

let tip = document.querySelector(".tip");

let digitsContainer = document.querySelector(".digits");

let firstDigit = document.querySelector(".digit-1");
let secondDigit = document.querySelector(".digit-2");
let thirdDigit = document.querySelector(".digit-3");

const colorClass = ["correct", "error"];

const btnNewGame = document.querySelector(".btn-new-game");

const cheatCheckbox = document.querySelector("#cheat");

let invalidValueInput = document.querySelector(".invalid-value-input");

function isOutOfRangeInput() {
  if (Number(input.value) < 0 || Number(input.value) > 300) {
    invalidValueInput.innerHTML = "Os valores permitidos são entre 0 e 300";
    return true;
  } else {
    invalidValueInput.innerHTML = "";
    return false;
  }
}

function isInputEmpty() {
  if (input.value.length === 0) {
    invalidValueInput.innerHTML =
      "Preencha um valor antes de enviar uma resposta";
    return true;
  } else {
    invalidValueInput.innerHTML = "";
    return false;
  }
}

function isCheatActivated() {
  return cheatCheckbox.checked;
}

function resetNumbersOnScreen() {
  firstDigit.classList = Array.from(firstDigit.classList)[0];
  secondDigit.classList = Array.from(secondDigit.classList)[0];
  thirdDigit.classList = Array.from(thirdDigit.classList)[0];
  secondDigit.style.display = "none";
  thirdDigit.style.display = "none";
}

function drawnNumberOnScreen(number) {
  let [n1, n2, n3] = number.toString();
  const classToDrawn = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  resetNumbersOnScreen();
  if (n1) {
    firstDigit.classList.add(classToDrawn[Number(n1)]);
  }
  if (n2) {
    secondDigit.style.display = "block";
    secondDigit.classList.add(classToDrawn[Number(n2)]);
  }
  if (n3) {
    thirdDigit.style.display = "block";
    thirdDigit.classList.add(classToDrawn[Number(n3)]);
  }
}

let isCorrect = true;
async function verifyAnswer() {
  // verifica se o input está no intervalo de 0 a 300, ou se a algum número preenchido,
  // caso não esteja não realiza a requisição na API,pois não esta no intervalo de uma possível resposta
  // Caso o cheat esteja ativado ele realiza a requisição mesmo assim
  if (
    isCheatActivated() ||
    (!isOutOfRangeInput() && !isInputEmpty() && isCorrect)
  ) {
    isCorrect = false;
    drawnNumberApi = await getApi(
      "https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300"
    );
  } else {
    letdrawnNumberApi = drawnNumberApi;
  }

  if (isCheatActivated()) input.value = drawnNumberApi.value; // Sempre ira acertar a resposta, exceto se a API retornar o error 502
  // Verificações para o sorteio do número

  if (Number(drawnNumberApi.value) === Number(input.value)) {
    tip.innerHTML = "Você acertou!!!";
    drawnNumberOnScreen(drawnNumberApi.value);
    tip.classList.add(colorClass[0]);
    digitsContainer.classList.add(colorClass[0]);

    btnSend.disabled = true;
    input.disabled = true;
    isCorrect = true;
    btnNewGame.style.display = "block";
  } else if (drawnNumberApi.hasOwnProperty("StatusCode")) {
    tip.innerHTML = "ERRO";
    drawnNumberOnScreen(drawnNumberApi.StatusCode);
    tip.classList.add(colorClass[1]);
    digitsContainer.classList.add(colorClass[1]);

    btnSend.disabled = true;
    input.disabled = true;
    isCorrect = true;
    btnNewGame.style.display = "block";
  } else if (Number(input.value) > Number(drawnNumberApi.value)) {
    tip.innerHTML = "É menor !";
    drawnNumberOnScreen(input.value);
    input.value = "";
    input.focus();
  } else {
    tip.innerHTML = "É maior !";
    drawnNumberOnScreen(input.value);

    input.value = "";
    input.focus();
  }
}

function resetTipElement() {
  tip.innerHTML = "";
  tip.classList.remove(colorClass[0]);
  tip.classList.remove(colorClass[1]);
}

function resetDrawnNumberClass() {
  digitsContainer.classList.remove(colorClass[0]);
  digitsContainer.classList.remove(colorClass[1]);
}

function newGame() {
  resetTipElement();
  resetDrawnNumberClass();
  drawnNumberOnScreen(0);
  input.value = "";
  btnNewGame.style.display = "none";

  btnSend.removeAttribute("disabled");
  input.removeAttribute("disabled");
}
