function draw_roles_chart(id) {
  $.getJSON('/data/roles_data.json', function(data) {
    var roles_data_raw = data[id];

    var roles = document.getElementById("roles_chart");
    // var roles_data_raw = get_roles_data(matches, champion_id);
    var roles_labels = [];
    var roles_data = [];
    for (role in roles_data_raw) {
      roles_labels.push(roles_data_raw[role]['role']);
      roles_data.push(roles_data_raw[role]['data']);
    }

    roles_chart = new Chart(roles, {
        type: 'horizontalBar',
        data: {
            labels: roles_labels,
            datasets: [{
                label: 'Roles',
                data: roles_data,
                backgroundColor: 'rgba(84, 137, 183, 0.8)'
            }]
        },
        options: {
          scaleShowVerticalLines: false,
          tooltips: {
            mode: 'single',
            custom: function(tooltip) {
              if (!tooltip) return;
              // disable displaying the color box;
              tooltip.displayColors = false;
            },
            callbacks: {
                label: function(tooltipItems, data) {
                    return tooltipItems.xLabel + "%";
                }
            }
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              ticks: {
                min: 0,
                max: 100,
                display: false
              },
              gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }
            }],
            yAxes: [{
              barPercentage: 0.85,
              gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }
            }]
          }
        }
    });
  });
}
