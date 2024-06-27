document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('authorizationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('surname', surname);
        formData.append('phone', phone);
        formData.append('email', email);

        fetch('/add-entry', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('Entry added successfully');
            } else {
                console.error('Failed to add entry');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        window.location.href = '/generatekey';
    });
});
