import { formatCurrency } from "./utilities";

let myChart;

const transactionChart = {
    populate(transactions) {
        // copy array and reverse it
        let reversed = transactions.slice().reverse();
        let sum = 0;

        // create date labels for chart
        let labels = reversed.map(t => {
            let date = new Date(t.date);
            return `${t.name} [${formatCurrency(t.value)}]`;
        });

        // create incremental values for chart
        let data = reversed.map(t => {
            sum += parseInt(t.value);
            return sum;
        });

        // remove old chart if it exists
        if (myChart) {
            myChart.destroy();
        }

        let ctx = document.getElementById("myChart").getContext("2d");

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: "Running Balance / Transaction",
                    fill: true,
                    backgroundColor: "#6666ff",
                    data
                }]
            },
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Transactions'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Balance'
                        },
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return formatCurrency(value);
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return `Balance: ${formatCurrency(tooltipItem.yLabel)}`;
                        }
                    }
                }
            }
        });
    }
};

export default transactionChart;