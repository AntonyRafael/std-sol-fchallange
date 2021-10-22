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

function numberToDrawn(element, number) {
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
  switch (number) {
    case "0":
      element.classList.add(classToDrawn[0]);
      break;
    case "1":
      element.classList.add(classToDrawn[1]);
      break;
    case "2":
      element.classList.add(classToDrawn[2]);
      break;
    case "3":
      element.classList.add(classToDrawn[3]);
      break;
    case "4":
      element.classList.add(classToDrawn[4]);
      break;
    case "5":
      element.classList.add(classToDrawn[5]);
      break;
    case "6":
      element.classList.add(classToDrawn[6]);
      break;
    case "7":
      element.classList.add(classToDrawn[7]);
      break;
    case "8":
      element.classList.add(classToDrawn[8]);
      break;
    case "9":
      element.classList.add(classToDrawn[9]);
      break;
  }
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
  resetNumbersOnScreen();
  if (n1) {
    numberToDrawn(firstDigit, n1);
  }
  if (n2) {
    secondDigit.style.display = "block";
    numberToDrawn(secondDigit, n2);
  }
  if (n3) {
    thirdDigit.style.display = "block";
    numberToDrawn(thirdDigit, n3);
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
