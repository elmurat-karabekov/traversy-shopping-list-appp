const form = document.querySelector('#item-form');
const inputField = document.getElementById('item-input');
const filterField = document.querySelector('.form-input-filter');
const itemsList = document.querySelector('ul');
const clearBtn = document.querySelector('#clear');
const submitBtn = document.querySelector('.btn');
// Nullish coalescing operator
// const foo = (null/undefined) ?? default
let itemsArrayInLS = JSON.parse(localStorage.getItem('items')) ?? [];
let isEditMode = false;
let itemToEdit;

function displayItems() {
  for (itemName of itemsArrayInLS) {
    const itemNode = createItem(itemName);
    itemsList.appendChild(itemNode);
  }
}

function addItem(e) {
  e.preventDefault();
  const itemName = inputField.value.trim();

  if (!itemName) {
    alert('Please add an item');
    return;
  }

  if (isEditMode) {
    removeItem(itemToEdit);
    isEditMode = false;
    updateSubmitBtnVisual();
  }

  if (
    itemsArrayInLS
      .map((item) => item.toLowerCase())
      .includes(itemName.toLowerCase())
  ) {
    alert('This item is already in the shopping list');
  } else {
    // dicard filter field state
    filterField.value = '';
    filterField.dispatchEvent(new Event('input', { bubbles: true }));

    const item = createItem(itemName);
    itemsList.appendChild(item);
    itemsArrayInLS.push(itemName);
    updateLS(itemsArrayInLS);
    checkIfEmpty();

    inputField.value = '';
  }
}

function onItemClick(e) {
  if (e.target.tagName === 'BUTTON') {
    removeItem(e.target.parentElement);
  } else if ((e.target.tagName = 'LI')) {
    setItemToEdit(e.target);
  }
}

function removeItem(item) {
  if (
    isEditMode ||
    confirm(
      `Are you sure you want to remove item "${item.textContent}" from the shopping list?`
    )
  ) {
    item.remove();
    itemsArrayInLS = itemsArrayInLS.filter((el) => el !== item.textContent);
    updateLS(itemsArrayInLS);
    checkIfEmpty();
  }
}

function setItemToEdit(item) {
  inputField.value = item.textContent;
  Array.from(itemsList.children).forEach((li) => (li.style.color = 'inherit'));
  item.style.color = '#ccc';
  isEditMode = true;
  updateSubmitBtnVisual();
  itemToEdit = item;
}

function updateSubmitBtnVisual() {
  submitBtn.replaceChildren();
  if (isEditMode) {
    const penIcon = document.createElement('i');
    penIcon.className = 'fa-solid fa-pen';
    submitBtn.appendChild(penIcon);
    const text = document.createTextNode('Update item');
    submitBtn.appendChild(text);
    submitBtn.style.backgroundColor = 'rgb(34, 139, 34)';
  } else {
    const plusIcon = document.createElement('i');
    plusIcon.className = 'fa-solid fa-plus';
    submitBtn.appendChild(plusIcon);
    const text = document.createTextNode('Add item');
    submitBtn.appendChild(text);
    submitBtn.style.backgroundColor = 'rgb(51, 51, 51)';
  }
}

function clearItems(e) {
  itemsList.replaceChildren();
  itemsArrayInLS = [];
  updateLS(itemsArrayInLS);
  checkIfEmpty();
  inputField.value = '';
  filterField.value = '';
}

function filterItems(e) {
  const searchString = e.target.value.trim().toLowerCase();

  for (let li of itemsList.childNodes) {
    if (li.textContent.toLowerCase().indexOf(searchString) === -1) {
      li.style.display = 'none';
    } else {
      li.style.display = 'flex';
    }
  }
}

function updateLS(itemsArray) {
  localStorage.setItem('items', JSON.stringify(itemsArray));
}

function checkIfEmpty() {
  if (!itemsArrayInLS.length) {
    filterField.style.display = 'none';
    clearBtn.style.display = 'none';
  } else {
    filterField.style.display = 'inline-block';
    clearBtn.style.display = 'inline-block';
  }
}

function createItem(itemName) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(itemName));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  return li;
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

checkIfEmpty();
displayItems();
form.addEventListener('submit', addItem);
itemsList.addEventListener('click', onItemClick);
clearBtn.addEventListener('click', clearItems);
filterField.addEventListener('input', filterItems);
