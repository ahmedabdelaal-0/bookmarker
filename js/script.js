'use strict';

/* ----------------- Variables ---------------- */
const inputSiteName = document.querySelector('#siteName');
const inputSiteUrl = document.querySelector('#siteUrl');
const btnAddSite = document.querySelector('#addSite');
const bookmarksTableEle = document.querySelector('.bookmarks-table__body');
const modalEle = document.querySelector('.overlay');
const closeModal = document.getElementById('close');

// Here we will store every new bookmarks data
let bookmarksDB = [];

/* -------------------- App ------------------- */
function getBookmarksFromLocalStorage() {
  const localBookmarksData = window.localStorage.getItem('bookmarks');

  if (localBookmarksData) {
    bookmarksDB = JSON.parse(localBookmarksData);

    addBookmarksToPage(bookmarksDB);
  }
}
getBookmarksFromLocalStorage();

function validateInput(input, testRegex) {
  if (testRegex.test(input.value)) {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
  } else {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
  }

  return testRegex.test(input.value);
}

function addSiteToBookmarksDB(siteName, siteUrl) {
  // Site data
  const bookmark = {
    name: siteName,
    url: siteUrl,
  };

  // Add the new bookmark data to the bookmarkDB
  bookmarksDB.push(bookmark);
}

function removeBookmarkFromBookmarksDB(bookmarkIndex) {
  for (let i = 0; i < bookmarksDB.length; i++) {
    if (i === Number(bookmarkIndex)) {
      bookmarksDB.splice(bookmarkIndex, 1);
    }
  }
}

function addBookmarksToPage(arrayOfBookmarks) {
  // Empty bookmarks table UI
  bookmarksTableEle.innerHTML = '';

  // Add bookmarks to the UI
  for (let i = 0; i < arrayOfBookmarks.length; i++) {
    bookmarksTableEle.innerHTML += `
    <tr>
      <td>${i + 1}</td>
      <td>${arrayOfBookmarks[i].name}</td>              
      <td>
        <a href="${
          arrayOfBookmarks[i].url
        }" class="btn btn-visit" target="_blank">
          <i class="fa-solid fa-eye pe-2"></i>Visit
        </a>
      </td>
      <td>
        <button class="btn btn-delete pe-2" data-index="${i}">
          <i class="fa-solid fa-trash-can"></i>
          Delete
        </button>
      </td>
    </tr>
    `;
  }
}

function addBookmarksToLocalStorage(arrayOfBookmarks) {
  window.localStorage.setItem('bookmarks', JSON.stringify(arrayOfBookmarks));
}

/* ------------------ Events ------------------ */
// Validate inputs
const siteNameRegex = /^\w{3,}(\s+\w+)*$/;
const siteUrlRegex =
  /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

const inputsEle = document.querySelectorAll('.form-control');
for (let i = 0; i < inputsEle.length; i++) {
  inputsEle[i].addEventListener('keyup', e => {
    if (e.target === inputSiteName) {
      validateInput(e.target, siteNameRegex);
    } else if (e.target === inputSiteUrl) {
      validateInput(e.target, siteUrlRegex);
    }
  });
}

// Add site
btnAddSite.addEventListener('click', () => {
  validateInput(inputSiteName, siteNameRegex);
  validateInput(inputSiteUrl, siteUrlRegex);

  if (
    validateInput(inputSiteName, siteNameRegex) &&
    validateInput(inputSiteUrl, siteUrlRegex)
  ) {
    addSiteToBookmarksDB(inputSiteName.value, inputSiteUrl.value);

    inputSiteName.value = '';
    inputSiteUrl.value = '';

    addBookmarksToPage(bookmarksDB);

    addBookmarksToLocalStorage(bookmarksDB);

    inputSiteName.classList.remove('is-valid', 'is-invalid');
    inputSiteUrl.classList.remove('is-valid', 'is-invalid');
  } else {
    modalEle.classList.remove('d-none');
  }
});

// Delete site
bookmarksTableEle.addEventListener('click', e => {
  if (e.target.classList.contains('btn-delete')) {
    // Remove bookmark from bookmarksDB
    const bookmarkIndex = e.target.getAttribute('data-index');
    removeBookmarkFromBookmarksDB(bookmarkIndex);

    // Update the local storage
    addBookmarksToLocalStorage(bookmarksDB);

    // Update the UI
    addBookmarksToPage(bookmarksDB);
  }
});

// Close modal
modalEle.addEventListener('click', e => {
  if (e.target === modalEle || e.target === closeModal) {
    modalEle.classList.add('d-none');
  }
});
