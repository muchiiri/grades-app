// Store all grades under one key in local storage
const STORAGE_KEY = 'studentGrades';

// Get references to DOM elements
const gradeForm = document.getElementById('gradeForm');
const gradeTableBody = document.getElementById('gradesTableBody');
const message = document.getElementById('message');
const clearAllBtn = document.getElementById('clearAllBtn');

// Load grades from local storage and display them
gradeForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const studentName = document.getElementById('studentName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const studentGrade = document.getElementById('studentGrade').value.trim();
    const studentEmail = document.getElementById('studentEmail').value.trim();

    //Input validation
    if (!studentName || !studentId || !studentGrade || !studentEmail) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    const grades = getGrades();

    // Create object for new grade entry
    const newRecord = {
        id: Date.now(),
        name: studentName,
        studentId: studentId,
        studentGrade: studentGrade,
        studentEmail: studentEmail
    };

    //Add new record to grades array and save to local storage
    grades.push(newRecord);
    saveGrades(grades);
    renderGrades();
    gradeForm.reset();
    showMessage('Grade added successfully!', 'success');
});

// Clear all grades from local storage and update display
clearAllBtn.addEventListener('click', function() {
    const grades = getGrades();

    if (grades.length === 0) {
        showMessage('No grades to clear.', 'error');
        return;
    }

    localStorage.removeItem(STORAGE_KEY);
    renderGrades();
    showMessage('All grades cleared successfully!', 'success');
});

//retrieve grades from local storage
function getGrades() {
    const savedGrades = localStorage.getItem(STORAGE_KEY);
    return savedGrades ? JSON.parse(savedGrades) : [];
}

//save grades to local storage
function saveGrades(grades) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
}

//display grades in the table
function renderGrades() {
    const grades = getGrades();
    
    if (grades.length === 0) {
        gradeTableBody.innerHTML = '<tr><td colspan="5">No grades available.</td></tr>';
        return;
    }   

gradeTableBody.innerHTML = grades
    .map(function (record) {
        return `
        <tr>
            <td>${record.name}</td>
            <td>${record.studentId}</td>
            <td>${record.studentGrade}</td>
            <td>${record.studentEmail}</td>
                <td><button class="delete-btn" data-id="${record.id}">Delete</button>
            </td>
        </tr>
        `;
    })
    .join('');

//Delete a specific grade entry
const deleButtons = document.querySelectorAll('.delete-btn');
deleButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        deleteGrade(button.dataset.id);
    });
});
}

//Delete grade by ID
function deleteGrade(recordid) {
    const grades = getGrades();
    const updatedGrades = grades.filter(function(record) {
        return record.id !== Number(recordid);
    });
    saveGrades(updatedGrades);
    renderGrades();
    showMessage('Grade deleted successfully!', 'success');
}

//Show feedback message to user
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}

renderGrades();
