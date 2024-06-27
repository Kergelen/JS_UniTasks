document.addEventListener('DOMContentLoaded', function () 
{
    const form = document.getElementById('benchmarkForm');
    const resultsTableBody = document.querySelector('#benchmarkResults tbody');

    form.addEventListener('click', function (event) 
    {
        if (event.target.tagName === 'BUTTON') 
        {
            event.preventDefault();
            resultsTableBody.innerHTML = '';
            const inputCount = parseInt(document.getElementById('input').value);
            runBenchmark(inputCount);
        }
    });

    function runBenchmark(inputCount) 
    {
        const benchmarkData = [];

        const inputs = document.querySelectorAll('input[benchmarkId]');
        const createInputsTime = OperationTime(() => createInputs(inputCount));
        const getInputsTime = OperationTime(() => getInputs(inputs));
        const saveInputsTime = OperationTime(() => saveInputs(inputs));
        const deleteInputsTime = OperationTime(() => deleteInputs(inputs));

        benchmarkData.push(['Tworzenie pól wejściowych', createInputsTime]);
        benchmarkData.push(['Pobieranie pół wejściowych', getInputsTime]);
        benchmarkData.push(['Zapisywanie pół wejściowych', saveInputsTime]);
        benchmarkData.push(['Usunięcie pół wejściowych', deleteInputsTime]);

        displayBenchmarkResults(benchmarkData);
    }

    function createInputs(count) 
    {
        for (let i = 0; i < count; i++) 
        {
            const input = document.createElement('input');
            input.type = 'text';
            input.setAttribute('benchmarkId', i);
            document.body.appendChild(input);
        }
    }

    function getInputs(inputs) 
    {
        inputs.forEach(input => input.value);
    }

    function saveInputs(inputs) 
    {
        inputs.forEach(input => input.dataset.savedValue = input.value);
    }

    function deleteInputs(inputs) 
    {
        inputs.forEach(input => input.remove());
    }

    function OperationTime(operation) 
    {
        const startTime = performance.now();
        operation();
        const endTime = performance.now();
        return (endTime - startTime).toFixed(2) + ' ms';
    }

    function displayBenchmarkResults(data) 
    {
        data.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${entry[0]}</td><td>${entry[1]}</td>`;
            resultsTableBody.appendChild(row);
        });
    }
});
