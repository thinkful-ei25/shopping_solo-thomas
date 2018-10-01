'use strict';

const STORE = {
  items:   [ 
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  hideCompleted: false,
  searchValue: '',

};


function generateItemElement(item, itemIndex, template){
  return `
  <li class="js-item-index-element" data-item-index="${itemIndex}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
      </button>
      <form class="js-shopping-list-edit-form">
      <label for="shopping-list-edit">Edit item</label>
      <input type="text" name="shopping-list-edit" class="js-shopping-list-edit" placeholder="e.g., broccoli">
      <button class="shopping-item-edit js-item-edit">
          <span class="button-label">submit</span>
      </button>
      </form>
    </div>
  </li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}

function renderShoppingList() {
  let filteredItems = Array.from(STORE.items);
  
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  
  if (STORE.searchValue) {
    filteredItems = filteredItems.filter(item => item.name.includes(STORE.searchValue));
  }

  // this function will be responsible for rendering the shopping list in
  // the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  // this function will be responsible for when users add a new shopping list item
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    console.log(newItemName);
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function handleNewSearch() {
  $('#js-shopping-list-search-form').submit(function(event) {
    event.preventDefault();
    console.log('handleNewSearch called');
    const newSearchItemName = $('.js-search-shopping-list').val();
    console.log(newSearchItemName);
    $('.js-search-shopping-list').val('');
    STORE.searchValue = newSearchItemName;
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  // this function will be responsible for when users click the "check" button on
  // a shopping list item.
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log(itemIndex);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);
  STORE.items.splice(itemIndex, 1);
}

function toggleHideItems() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
}

function handleToggleHideClick() {
  $('#toggle-completed-filter').click(() => {
    toggleHideItems();
    renderShoppingList();
  });
}

function editItem(itemIndex, editItemName) {
  STORE.items[itemIndex].name = editItemName;
}

function handleEditItem() {
  $('.js-shopping-list').submit('.js-shopping-list-edit-form', function(event) {
    event.preventDefault();
    const itemIndex = getItemIndexFromElement(event.target);
    console.log(event.target);
    const editItemName = $(event.target).find('.js-shopping-list-edit').val();
    $(event.target).find('.js-shopping-list-edit').val('');
    console.log(itemIndex);
    console.log(editItemName);
    editItem(itemIndex, editItemName);
    renderShoppingList();
  });

  // $('.js-shopping-list').on('click', '.js-item-edit', event => {
  //   console.log('`handleEditItem` ran');
  //   event.preventDefault();
  //   const itemIndex = getItemIndexFromElement(event.currentTarget);
  //   const editItemName = $('.js-shopping-list-edit').val();
  //   console.log(itemIndex);
  //   console.log(editItemName);
  //   // $('.js-shopping-list-edit').val('');
  //   STORE.items[itemIndex].name = editItemName;
  //   renderShoppingList();
  // });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideClick();
  handleNewSearch();
  handleEditItem();
}

$(handleShoppingList);