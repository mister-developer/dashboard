const addModalBtn = document.querySelector('.open-modal');
const modalAddCard = document.querySelector('.add-card');
const cancelAddModalBtn = modalAddCard.querySelector('.btn--cancel');
const addCardBtn = document.querySelector('.btn--add');

const modalInfo = document.querySelector('.modal--info');
const closeInfoModalBtn = document.querySelector('.btn--close');

const modalRemoveCard = document.querySelector('.remove-card');
const cancelRemoveModalBtn = modalRemoveCard.querySelector('.btn--cancel');
let removeCardBtn = modalRemoveCard.querySelector('.btn--remove');

const entryText = document.querySelector('.entry-text');
const backdrop = document.querySelector('.backdrop');
const userInputs = modalAddCard.querySelectorAll('input');
const cardsList = document.querySelector('.cards');

const cards = [];

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

const toggleBackdrop = () => {
  backdrop.classList.toggle('visible');
};

const showAddModal = () => {
  modalAddCard.classList.add('visible');
  toggleBackdrop();
};

const closeAddModal = () => {
  modalAddCard.classList.remove('visible');
  clearUserInputs();
};

const closeInfoModal = () => {
  modalInfo.classList.remove('visible');
  modalAddCard.style.zIndex = '11';
  backdrop.addEventListener('click', BackdropClickHandler);
};

const showInfoModal = () => {
  modalInfo.classList.add('visible');
  modalAddCard.style.zIndex = '9';
  backdrop.removeEventListener('click', BackdropClickHandler);
};

const showRemoveModal = cardId => {
  modalRemoveCard.classList.add('visible');
  toggleBackdrop();
  backdrop.removeEventListener('click', BackdropClickHandler);

  removeCardBtn.replaceWith(removeCardBtn.cloneNode(true));
  removeCardBtn = modalRemoveCard.querySelector('.btn--remove');
  removeCardBtn.addEventListener('click', removeCardHandler.bind(this, cardId));
};

const closeRemoveModal = () => {
  modalRemoveCard.classList.remove('visible');
  backdrop.addEventListener('click', BackdropClickHandler);
  toggleBackdrop();
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

  const removeModalBtn = card.querySelector('.open-remove-modal');
  removeModalBtn.addEventListener('click', removeModalHandler.bind(this, +card.id));
};

const removeCard = cardId => {
  let cardIndex = 0;
  cardsList.querySelectorAll('.cards').forEach(card => {
    if (+card.id === cardId) {
      return;
    }
    cardIndex++;
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

const BackdropClickHandler = () => {
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

backdrop.addEventListener('click', BackdropClickHandler);