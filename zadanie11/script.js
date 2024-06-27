$(document).ready(function() {
    $('#elCalculator').submit(function(event) {
        event.preventDefault();
        
        var power = parseFloat($('#power').val()) / 1000; 
        var hours = parseFloat($('#hours').val());
        var wojewodztwo = $('#wojewodztwo').val();

        var wojewodztwoCosts = {
            warszawa: 1.17,
            gdansk: 1.21,
            olsztyn: 1.21,
            katowice: 1.14,
            krakow: 1.12,
            opole: 1.12,
            wroclaw: 1.12,
            poznan: 1.11,
            zielona_gora: 1.11,
            bydgoszcz_torun: 1.11,
            szczecin: 1.11,
            bialystok: 1.19,
            radom_mazowieckie: 1.19,
            kielce: 1.19,
            rzeszow: 1.19,
            lublin: 1.19,
            lodz: 1.19
        };

        var electricityCost = wojewodztwoCosts[wojewodztwo]; 
        var kWh = power * hours;
        var costPerDay = kWh * electricityCost;
        var costPerMonth = costPerDay * 30;
        var costPerYear = costPerDay * 365;

        $('#result').html(`
            Koszt zużytej energii elektrycznej dla urządzenia:<br>
            Dzienny: ${costPerDay.toFixed(2)} zł<br>
            Miesięczny: ${costPerMonth.toFixed(2)} zł<br>
            Roczny: ${costPerYear.toFixed(2)} zł
        `);
    });
});
