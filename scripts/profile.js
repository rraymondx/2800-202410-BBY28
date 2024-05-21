function enableEditing() {
    document.getElementById('username').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('city').disabled = false;
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('save-btn').style.display = 'inline';
}

function disableEditing() {
    document.getElementById('username').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('city').disabled = true;
    document.getElementById('edit-btn').style.display = 'inline';
    document.getElementById('save-btn').style.display = 'none';
}

function handleFormSubmit(event) {
    enableEditing(); // Ensure fields are enabled before submitting
}