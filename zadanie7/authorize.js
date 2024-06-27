document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('authorizationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        window.location.href = '/generatekey';
    });
});
