document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('authorizationForm').addEventListener('submit', async function(event) { // Async oznacza, że funkcja jest asynchroniczna i może używać await
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

        try {
            const response = await fetch('/add-entry', { // Await oczekuje na rozwiązanie Obietnic przed kontynuacją
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Entry added successfully');
            } else {
                console.error('Failed to add entry');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        window.location.href = '/generatekey';
    });
});