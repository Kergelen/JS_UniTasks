document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('voteChart');
    const ctx = canvas.getContext('2d');
    let socket = new WebSocket('ws://localhost:8080');
    let data = {};

    socket.onopen = function(event) {
        console.log('WebSocket opened');
    };

    socket.onmessage = function(event) {
        data = JSON.parse(event.data);
        drawChart(data);
    };

    const drawChart = (data) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const candidates = Object.keys(data);
        const totalVotes = Object.values(data).reduce((acc, curr) => acc + curr, 0);
        let startY = 20;
        const barWidth = 30;
        const spacing = 60;

        candidates.forEach((candidate, index) => {
            const votes = data[candidate];
            const barHeight = (canvas.height - 50) * (votes / totalVotes);

            ctx.fillStyle = getColor(index);
            ctx.fillRect((index * spacing) + 50, canvas.height - barHeight - 20, barWidth, barHeight);

            ctx.fillStyle = '#000';
            ctx.fillText(candidate + ": " + votes, (index * spacing) + 50, canvas.height - barHeight - 25);
        });
    };

    const getColor = (index) => {
        const colors = ['#ff9999', '#99ff99', '#9999ff']; 
        return colors[index % colors.length];
    };

    document.getElementById('voteForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const key = document.getElementById('key').value;
        const candidate = document.getElementById('candidate').value;
        const voteData = { key: key, candidate: candidate };
        socket.send(JSON.stringify(voteData));
    });

    document.getElementById('generateKey').addEventListener('click', function() {
        window.location.href = '/authorize';
    });
});
