document.addEventListener("DOMContentLoaded", function() {
    
    const generateRandomKey = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 10;
        let randomKey = '';
        for (let i = 0; i < length; i++) {
            randomKey += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomKey;
    };

    const randomKey = generateRandomKey();
    document.getElementById('randomKey').innerText = randomKey;

    fetch('/generatekey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: randomKey })
    });

    document.getElementById('returnButton').addEventListener('click', function() {
        window.location.href = '/';
    });
});
