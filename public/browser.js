// Render HTML List Template
function itemTemplate(item) {
    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>
    `;
}

// Initial Page Load Render
let ourHTML = items
    .map(item => {
        return itemTemplate(item);
    })
    .join('');
document.getElementById('item-list').insertAdjacentHTML('beforeend', ourHTML);

// Add New
let createField = document.getElementById('create-field');
let itemList = document.getElementById('item-list');

document.getElementById('create-form').addEventListener('submit', e => {
    e.preventDefault();
    axios
        .post('/create-item', { text: createField.value })
        .then(response => {
            // Create the HTML for a new item
            itemList.insertAdjacentHTML(
                'beforeend',
                itemTemplate(response.data)
            );
            createField.value = '';
            createField.focus();
        })
        .catch(() => {
            console.log(`Added Successfully`);
        });
});

document.addEventListener('click', e => {
    // Delete
    if (e.target.classList.contains('delete-me')) {
        if (confirm('Do you want to delete permanently?')) {
            axios
                .post('/delete-item', { id: e.target.getAttribute('data-id') })
                .then(() => {
                    e.target.parentElement.parentElement.remove();
                })
                .catch(() => {
                    console.log(`Please Try Again`);
                });
        }
    }

    // Update
    if (e.target.classList.contains('edit-me')) {
        let userInput = prompt(
            'Enter your desired text',
            e.target.parentElement.parentElement.querySelector('.item-text')
                .innerHTML
        );
        if (userInput) {
            axios
                .post('/update-item', {
                    text: userInput,
                    id: e.target.getAttribute('data-id')
                })
                .then(() => {
                    e.target.parentElement.parentElement.querySelector(
                        '.item-text'
                    ).innerHTML = userInput;
                })
                .catch(() => {
                    console.log(`Please try Again`);
                });
        }
    }
});
