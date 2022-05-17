'use strict';

// Elements
const formEl = document.querySelector('.main-form');
const timeStartEl = document.querySelector('.timeStart');
const timeEndEl = document.querySelector('.timeEnd');
const TFPerDayEl = document.querySelector('.TFPerDay');
const minimumDurationEl = document.querySelector('.minimumDuration');
const repeaterButtonsEl = document.querySelector('.repeater-buttons');
const repeaterAddBtnEl = document.querySelector('.repeater-button-add');
const repeatedRemoveBtnEl = document.querySelector('.repeater-button-remove');
const generateBtnEl = document.querySelector('.generate-button');
let gapCount = 1;

// Repeater fields
const addGap = () => {
  gapCount++;
  const numbering = String(gapCount).padStart(2, '0');
  const exclusionGroup = `<div class="w-100" id="gapSpacer-${numbering}"></div>
    <div class="col-sm-3 mb-3" id="gapStart-${numbering}">
        <label for="gapStartField-${numbering}" class="form-label">Excluded hours from</label>
        <input type="time" class="form-control form-control-lg gapStart" id="gapStartField-${numbering}">
    </div>
    <div class="col-sm-3 mb-3" id="gapEnd-${numbering}">
        <label for="gapEndField-${numbering}" class="form-label">Excluded hours to</label>
        <input type="time" class="form-control form-control-lg gapEnd" id="gapEndField-${numbering}">
    </div>`;

  repeaterButtonsEl.insertAdjacentHTML('beforebegin', exclusionGroup);
  if (gapCount === 2) repeatedRemoveBtnEl.classList.remove('hidden');
  if (gapCount === 10) repeaterAddBtnEl.classList.add('hidden');
};

const removeGap = () => {
  const numbering = String(gapCount).padStart(2, '0');
  document.getElementById(`gapSpacer-${numbering}`).remove();
  document.getElementById(`gapStart-${numbering}`).remove();
  document.getElementById(`gapEnd-${numbering}`).remove();
  gapCount--;
  if (gapCount < 2) repeatedRemoveBtnEl.classList.add('hidden');
  if (gapCount < 10) repeaterAddBtnEl.classList.remove('hidden');
};

// Validation
const fieldsValidation = () => {
  if (timeStartEl.value >= timeEndEl.value) {
    highlightFields([timeStartEl, timeEndEl]);
    displayError('Start time must be before End time.');
    return false;
  }
  return true;
};

const highlightFields = fields => {
  fields.forEach(f => (f.style.borderColor = 'red'));
};

const clearHighlights = () => {
  document.querySelectorAll('input').forEach(f => (f.style.borderColor = ''));
};

const displayError = error => {
  formEl.insertAdjacentHTML(
    'afterend',
    `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        ${error}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    </div>`
  );
};

const resetErrors = () => {
  const errors = document.querySelectorAll('.alert-dismissible');
  if (errors) errors.forEach(err => err.remove());
};

// Get time fields elements and values
const getGapsFieldData = () => {
  const gapStart = document.querySelectorAll('.gapStart');
  const gapEnd = document.querySelectorAll('.gapEnd');
  const result = [];

  for (let i = 0; i < gapCount; i++) {
    result.push({
      startEl: gapStart[i],
      endEl: gapEnd[i],
      start: gapStart[i].value,
      end: gapEnd[i].value,
    });
  }

  return result;
};

// Create array of 24 * 60 with all gaps
const gapsArray = () => {
  const gapFieldsData = getGapsFieldData();
  const result = Array(24 * 60).fill(1);

  gapFieldsData.forEach(ex => {
    // Convert to minutes
    const startH = Number(ex.start.split(':')[0]);
    const startM = Number(ex.start.split(':')[1]);
    const endH = Number(ex.end.split(':')[0]);
    const endM = Number(ex.end.split(':')[1]);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;

    // Handle case if end time is less than start time
    if (start < end) result.fill(0, start, end);
    if (start > end) result.fill(0, 0, end).fill(0, start);
  });

  return result;
};

const generateTF = e => {
  e.preventDefault();
  clearHighlights();
  resetErrors();

  if (!fieldsValidation()) return;

  const start = new Date(timeStartEl.value).getTime();
  const end = new Date(timeEndEl.value).getTime();
  const perDay = TFPerDayEl.value;
  const duration = minimumDurationEl.value;
  const gaps = gapsArray();
  const result = [];

  console.log(start, end, perDay, duration, gaps);

  // generate random index from 0 to 1339 and check if there are
  const randomTime = Math.trunc(Math.random() * 1339);
  // check if there are enough minutes available after the index
  for (let i = 0; i < perDay; i++) {
    const start = Math.trunc(Math.random() * 1339);
    if (!validateTF(start, gaps, duration)) continue;
    else {
    }
  }
  // mark indexes as used
};

// Validate time frame
const validateTF = (start, gaps, duration) => {
  for (let i = start; i < start + duration; i++) {
    if (gaps[i] === 0) return false;
  }
  return true;
};

// Event handlers
formEl.addEventListener('submit', generateTF);
repeaterAddBtnEl.addEventListener('click', addGap);
repeatedRemoveBtnEl.addEventListener('click', removeGap);
