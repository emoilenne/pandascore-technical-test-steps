function draw_popularity_chart(id) {
  $.getJSON('/data/popularity_data.json', function(data) {
    popularity_data_raw = data[id];
    var popularity = document.getElementById("popularity_chart");
    var popularity_labels = [];
    var popularity_data = [];
    for (entry in popularity_data_raw) {
      popularity_labels.push(popularity_data_raw[entry]['date']);
      popularity_data.push(parseFloat(popularity_data_raw[entry]['popularity']));
    }

    popularity_chart = new Chart(popularity, {
        type: 'line',
        data: {
          labels: popularity_labels,
          datasets: [{
            data: popularity_data,
            backgroundColor: 'rgba(84, 137, 183, 0.8)'
          }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
            }]
          },
          tooltips: {
            mode: 'single',
            custom: function(tooltip) {
              if (!tooltip) return;
              // disable displaying the color box;
              tooltip.displayColors = false;
            },
            callbacks: {
                label: function(tooltipItems, data) {
                    return tooltipItems.yLabel + "%";
                }
            }
          },
        },
    });
  });
}
