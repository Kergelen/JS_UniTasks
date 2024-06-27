document.addEventListener('DOMContentLoaded', function () {
	const dashboardCanvas = document.getElementById('dashboardCanvas');
	const ctx = dashboardCanvas.getContext('2d');
  
	dashboardCanvas.width = 1000;
  
	let timeLabels = [];
	let cpuUsageData = [];
  
	function drawXYGraph() {
	  	ctx.clearRect(0, 0, dashboardCanvas.width / 2, dashboardCanvas.height);
	  	ctx.fillStyle = '#ffffff';
	  	ctx.fillRect(0, 0, dashboardCanvas.width / 2, dashboardCanvas.height);
  
	  	ctx.beginPath();
	  	ctx.moveTo(50, 50);
	  	ctx.lineTo(50, 350);
		ctx.lineTo(dashboardCanvas.width / 2 - 50, 350);
	  	ctx.stroke();
  
	  	for (let i = 0; i <= 100; i += 10) {
			const y = 350 - i * 3;
			ctx.beginPath();
			ctx.moveTo(45, y);
			ctx.lineTo(50, y);
			ctx.stroke();
			ctx.fillStyle = '#000000';
			ctx.fillText(`${i}%`, 10, y + 5);
		}
  
	  	ctx.strokeStyle = '#007bff';
	  	ctx.beginPath();
	  	for (let i = 0; i < timeLabels.length; i++) {
			const x = 50 + i * 35;
			const y = 350 - cpuUsageData[i] * 3;
			if (i === 0) {
		  	ctx.moveTo(x, y);
			} else {
		  	ctx.lineTo(x, y);
			}
			ctx.fillStyle = '#000000';
			ctx.fillText(cpuUsageData[i].toFixed(1) + '%', x, y - 10);
	  	}
	  	ctx.stroke();

	  	ctx.fillStyle = '#000000';
  		ctx.font = '14px Arial';
  		ctx.fillText('Time', dashboardCanvas.width / 4 - 20, 380);
  		ctx.fillText('CPU Usage', 10, 20);
	}
  
	function drawDoughnutChart(cpuUsage) {
		ctx.clearRect(dashboardCanvas.width / 2, 0, dashboardCanvas.width / 2, dashboardCanvas.height);
		ctx.fillStyle="#ffffff"
		ctx.fillRect(dashboardCanvas.width / 2, 0, dashboardCanvas.width / 2, dashboardCanvas.height);
	  
		ctx.beginPath();
		ctx.arc(dashboardCanvas.width * 3 / 4, 200, 100, 0, 2 * Math.PI);
		ctx.fillStyle = '#ffffff';
		ctx.fill();
	  
		ctx.beginPath();
		ctx.arc(dashboardCanvas.width * 3 / 4, 200, 100, 0, 2 * Math.PI);
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 2;
		ctx.stroke();
	  
		ctx.beginPath();
		ctx.moveTo(dashboardCanvas.width * 3 / 4, 200);
		ctx.arc(dashboardCanvas.width * 3 / 4, 200, 100, -Math.PI / 2, (2 * Math.PI * cpuUsage) / 100 - Math.PI / 2);
		ctx.fillStyle = '#007bff';
		ctx.fill();

		ctx.fillStyle = '#000000';
  		ctx.font = '14px Arial';
  		ctx.fillText(`${cpuUsage.toFixed(2)}%`, dashboardCanvas.width * 3 / 4 - 15, 200);
	}
	  
  
	function updateCharts(cpuUsage) {
	  	const currentTime = new Date();
	  	const formattedTime = currentTime.toLocaleTimeString();
	  	timeLabels.push(formattedTime);
	  	cpuUsageData.push(cpuUsage);

	 	if (timeLabels.length > 10) {
			timeLabels.shift();
			cpuUsageData.shift();
	  	}
  
	  	drawXYGraph();
	  	drawDoughnutChart(cpuUsage);
	}
  
	function fetchCPUUsage() {
	  	fetch('http://localhost:3030/cpu-usage')
			.then(response => response.json())
			.then(data => {
		  		const cpuUsage = parseFloat(data.cpuUsage.toFixed(2));
		  		updateCharts(cpuUsage * 100);
			})
			.catch(error => {
		  		console.error('Error fetching CPU usage:', error);
		});
	}
  
	setInterval(fetchCPUUsage, 1000);
});
  