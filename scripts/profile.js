function enableEditing() {
    document.getElementById('picture').disabled = false;
    document.getElementById('username').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('city').disabled = false;
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('save-btn').style.display = 'inline';
}

function disableEditing() {
    document.getElementById('picture').disabled = true;
    document.getElementById('username').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('city').disabled = true;
    document.getElementById('edit-btn').style.display = 'inline';
    document.getElementById('save-btn').style.display = 'none';
}

function handleFormSubmit(event) {
    enableEditing(); // Ensure fields are enabled before submitting
}

document.getElementById('picture').addEventListener('change', function(event) {
    const imagePreview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    document.getElementById('changed').value = true;
    
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = '';
    }
  });