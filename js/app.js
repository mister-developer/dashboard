const addModalBtn = document.querySelector('.open-modal');
const modalAddCard = document.querySelector('.add-card');
const cancelAddModalBtn = modalAddCard.querySelector('.btn--cancel');
const addCardBtn = document.querySelector('.btn--add');

const modalInfo = document.querySelector('.modal--info');
const closeInfoModalBtn = document.querySelector('.btn--close');

const modalRemoveCard = document.querySelector('.remove-card');
const cancelRemoveModalBtn = modalRemoveCard.querySelector('.btn--cancel');

const entryText = document.querySelector('.entry-text');
const backdrop = document.querySelector('.backdrop');
const userInputs = modalAddCard.querySelectorAll('input');
const cardsList = document.querySelector('.cards');

const cards = [];

const toggleBackdrop = () => {
  backdrop.classList.toggle('visible');
};

const showAddModal = () => {
  modalAddCard.classList.add('visible');
  backdrop.classList.add('visible');
};

const closeAddModal = () => {
  modalAddCard.classList.remove('visible');
  clearUserInputs();
};

const closeInfoModal = () => {
  modalInfo.classList.remove('visible');
  modalAddCard.style.zIndex = '11';
  backdrop.addEventListener('click', backdropClickHandler);
};

const showInfoModal = () => {
  modalInfo.classList.add('visible');
  modalAddCard.style.zIndex = '9';
  backdrop.removeEventListener('click', backdropClickHandler);
};

const showRemoveModal = cardId => {
  modalRemoveCard.classList.add('visible');
  backdrop.removeEventListener('click', backdropClickHandler);
  backdrop.classList.add('visible');

  let removeCardBtn = modalRemoveCard.querySelector('.btn--remove');

  removeCardBtn.replaceWith(removeCardBtn.cloneNode(true));
  removeCardBtn = modalRemoveCard.querySelector('.btn--remove');
  removeCardBtn.addEventListener('click', removeCardHandler.bind(this, cardId));
};

const closeRemoveModal = () => {
  modalRemoveCard.classList.remove('visible');
  backdrop.addEventListener('click', backdropClickHandler);
  backdrop.classList.remove('visible');
};

const clearUserInputs = () => {
  userInputs.forEach(input => input.value = '');
};

const updateUI = () => {
  if (cards.length == 0) {
    entryText.style.display = 'block';
  } else {
    entryText.style.display = 'none';
  }
};

const moveCard = (event, card) => {
  // distance from cursor to upper left corner of card
  let shiftLeft = event.clientX - card.getBoundingClientRect().left;
  let shiftTop = event.clientY - card.getBoundingClientRect().top;

  const SHIFT = 30;
  
  const moveCardAt = (pageX, pageY) => {
    let newShiftX = pageX - shiftLeft;
    let newShiftY = pageY - shiftTop;

    let newBottom = newShiftY + card.offsetHeight;

    const cardListRightSide = cardsList.offsetWidth - card.offsetWidth - SHIFT;
    const documentBottom = document.documentElement.clientHeight;

    console.log(documentBottom)

    if (newShiftX < 0) {
      newShiftX = 0;
    } else if (newShiftY < 0) {
      newShiftY = 0;
    } else if (newShiftX > cardListRightSide) {
      newShiftX = cardListRightSide;
    }

    card.style.left = newShiftX + 'px';
    card.style.top = newShiftY + 'px';
  };

  const mouseMoveHandler = (event) => {
    moveCardAt(event.pageX, event.pageY);
  };

  const removeBtnTarget = event.target.closest('.open-remove-modal');

  if (!removeBtnTarget) {
    card.style.position = 'absolute';
    moveCardAt(event.pageX, event.pageY);
    document.addEventListener('mousemove', mouseMoveHandler);
  } else {
    removeBtnTarget.addEventListener('click', removeModalHandler.bind(this, +card.id));
  }

  card.onmouseup = () => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    card.onmouseup = null;
  };
};

const createNewCard = (cardId, imgUrl, name, age, adress) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = cardId;
  card.innerHTML = `
    <span class="material-icons open-remove-modal">close</span>
    <div class="card__img">
      <img src="${imgUrl}" alt="img">
    </div>
    <div class="card__info">
      <h1 class="card__name">Name: ${name}</h1>
      <p class="card__age"><b>Age</b>: ${age}</p>
      <p class="card__adress"><b>Adress</b>: ${adress}</p>
    </div>
  `
  cardsList.append(card);

  card.addEventListener('mousedown', (event) => {
    moveCard(event, card);
  });
  
  card.ondragstart = () => { return false }; // disable browser drag&drop event
};

const removeCard = cardId => {
  const cardsArray = Array.from(cardsList.querySelectorAll('.card'));
  let cardIndex = 0;
  cardsArray.map((card, index) => {
    if (cardId == card.id) {
      cardIndex = index;
    }
  });
  cards.splice(cardIndex, 1);
  cardsList.children[cardIndex].remove();
  closeRemoveModal();
  updateUI();
};

const addModalHandler = () => {
  showAddModal();
};

const cancelAddModalHandler = () => {
  closeAddModal();
  toggleBackdrop();
};

const removeModalHandler = cardId => {
  showRemoveModal(cardId);
};

const cancelRemoveModalHandler = () => {
  closeRemoveModal();
};

const closeInfoModalHandler = () => {
  closeInfoModal();
};

const backdropClickHandler = () => {
  closeAddModal();
  toggleBackdrop();
};

const addCardHandler = () => {
  const image = userInputs[0].value;
  const name = userInputs[1].value;
  const age = userInputs[2].value;
  const adress = userInputs[3].value;

  if (image.trim() === '' || name.trim() === '' || age.trim() === '' || adress.trim() === '' || age <= 0) {
    showInfoModal();
    return;
  }

  const newCard = {
    imageURL: image,
    name: name,
    age: age,
    adress: adress,
  };
  
  cards.push(newCard);
  const cardId = cards.indexOf(newCard);
  createNewCard(cardId, newCard.imageURL, newCard.name, newCard.age, newCard.adress);

  closeAddModal();
  toggleBackdrop();
  updateUI();
};

const removeCardHandler = cardId => {
  removeCard(cardId);
};

addModalBtn.addEventListener('click', addModalHandler);
cancelAddModalBtn.addEventListener('click', cancelAddModalHandler);
addCardBtn.addEventListener('click', addCardHandler);
closeInfoModalBtn.addEventListener('click', closeInfoModalHandler);
cancelRemoveModalBtn.addEventListener('click', cancelRemoveModalHandler);
backdrop.addEventListener('click', backdropClickHandler);