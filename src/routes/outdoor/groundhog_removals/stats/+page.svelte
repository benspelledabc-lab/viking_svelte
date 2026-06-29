<script>
import { onMount, tick } from 'svelte';
import { apiUrl } from "$lib/api";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

let removals = [];
let error = '';
let loading = true;
let chartsReady = false;

let yearChart;
let monthChart;
let hourChart;
let sexChart;

let yearData = {};
let monthData = {};
let hourData = {};
let sexData = {};

async function fetchRemovals() {
    try {
        const res = await fetch(apiUrl('/groundhog_removals'));
        if (res.ok) {
            removals = await res.json();
            processData();
        } else {
            error = 'Failed to fetch groundhog removals';
        }
    } catch (err) {
        error = err.message;
    } finally {
        loading = false;
    }
}

async function processData() {
    // Process data for charts
    yearData = {};
    monthData = {};
    hourData = {};
    sexData = {};

    removals.forEach(removal => {
        // Year
        if (removal.removal_date) {
            const year = new Date(removal.removal_date).getFullYear();
            yearData[year] = (yearData[year] || 0) + 1;
        }

        // Month
        if (removal.removal_date) {
            const month = new Date(removal.removal_date).getMonth() + 1; // 1-12
            monthData[month] = (monthData[month] || 0) + 1;
        }

        // Hour
        if (removal.time_of_removal) {
            const hour = parseInt(removal.time_of_removal.split(':')[0]);
            hourData[hour] = (hourData[hour] || 0) + 1;
        }

        // Sex
        if (removal.sex) {
            const sex = removal.sex.toLowerCase() === 'male' ? 'Male' : removal.sex.toLowerCase() === 'female' ? 'Female' : 'Unknown';
            sexData[sex] = (sexData[sex] || 0) + 1;
        } else {
            sexData['Unknown'] = (sexData['Unknown'] || 0) + 1;
        }
    });

    // Wait for DOM to update, then create charts
    await tick();
    chartsReady = true;
    createCharts();
}

function createCharts() {
    // Destroy existing charts if they exist
    if (yearChart) yearChart.destroy();
    if (monthChart) monthChart.destroy();
    if (hourChart) hourChart.destroy();
    if (sexChart) sexChart.destroy();

    // Check if canvas elements exist
    const yearCanvas = document.getElementById('yearChart');
    const monthCanvas = document.getElementById('monthChart');
    const hourCanvas = document.getElementById('hourChart');
    const sexCanvas = document.getElementById('sexChart');

    if (!yearCanvas || !monthCanvas || !hourCanvas || !sexCanvas) {
        console.error('Canvas elements not found');
        return;
    }

    // Year Chart
    const yearCtx = yearCanvas.getContext('2d');
    const years = Object.keys(yearData).sort();
    yearChart = new Chart(yearCtx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Removals by Year',
                data: years.map(y => yearData[y]),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#fff', font: { size: 14 } }
                },
                title: {
                    display: true,
                    text: 'Groundhog Removals by Year',
                    color: '#fff',
                    font: { size: 18, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        color: '#fff',
                        stepSize: 1
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Month Chart
    const monthCtx = monthCanvas.getContext('2d');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    monthChart = new Chart(monthCtx, {
        type: 'bar',
        data: {
            labels: monthNames,
            datasets: [{
                label: 'Removals by Month',
                data: months.map(m => monthData[m] || 0),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#fff', font: { size: 14 } }
                },
                title: {
                    display: true,
                    text: 'Groundhog Removals by Month',
                    color: '#fff',
                    font: { size: 18, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        color: '#fff',
                        stepSize: 1
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Hour Chart
    const hourCtx = hourCanvas.getContext('2d');
    const hours = Array.from({ length: 24 }, (_, i) => i);
    hourChart = new Chart(hourCtx, {
        type: 'bar',
        data: {
            labels: hours.map(h => `${h}:00`),
            datasets: [{
                label: 'Removals by Hour',
                data: hours.map(h => hourData[h] || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#fff', font: { size: 14 } }
                },
                title: {
                    display: true,
                    text: 'Groundhog Removals by Hour of Day',
                    color: '#fff',
                    font: { size: 18, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        color: '#fff',
                        stepSize: 1
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { 
                        color: '#fff',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    // Sex Chart
    const sexCtx = sexCanvas.getContext('2d');
    const sexLabels = Object.keys(sexData).sort();
    sexChart = new Chart(sexCtx, {
        type: 'pie',
        data: {
            labels: sexLabels,
            datasets: [{
                label: 'Removals by Sex',
                data: sexLabels.map(s => sexData[s]),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#fff', font: { size: 14 } },
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Groundhog Removals by Sex',
                    color: '#fff',
                    font: { size: 18, weight: 'bold' }
                }
            }
        }
    });
}

onMount(() => {
    fetchRemovals();
});
</script>

<svelte:head>
  <title>Groundhog Removal Statistics</title>
  <meta name="description" content="Statistics and graphs for groundhog removals" />
</svelte:head>

<div class="p-bubble parent-bubble">
    <div class="table-container">
        <h1>Groundhog Removal Statistics</h1>
        
        {#if loading}
            <p>Loading data...</p>
        {:else if error}
            <p class="error">{error}</p>
        {:else}
            <p class="total-count">Total Removals: {removals.length}</p>
            
            <div class="nav-links">
                <a href="/outdoor/groundhog_removals" class="back-link">← Back to All Removals</a>
            </div>

            <div class="charts-container">
                <div class="chart-wrapper">
                    <canvas id="yearChart"></canvas>
                </div>

                <div class="chart-wrapper">
                    <canvas id="monthChart"></canvas>
                </div>

                <div class="chart-wrapper">
                    <canvas id="hourChart"></canvas>
                </div>

                <div class="chart-wrapper">
                    <canvas id="sexChart"></canvas>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
.p-bubble {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px;
    margin: 20px auto;
    max-width: 1400px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

.table-container {
    color: #fff;
    text-align: center;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.total-count {
    text-align: center;
    font-size: 1.3em;
    margin: 20px 0;
    color: #4CAF50;
    font-weight: bold;
}

.nav-links {
    text-align: center;
    margin: 20px 0;
}

.back-link {
    color: #4CAF50;
    text-decoration: none;
    font-weight: bold;
    padding: 10px 20px;
    border: 2px solid #4CAF50;
    border-radius: 10px;
    transition: all 0.3s;
    display: inline-block;
}

.back-link:hover {
    background: #4CAF50;
    color: #fff;
}

.charts-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin-top: 30px;
}

.chart-wrapper {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    height: 400px;
}

.error {
    color: #ff6b6b;
    text-align: center;
    font-size: 1.1em;
}

@media (max-width: 768px) {
    .p-bubble {
        padding: 15px;
        margin: 10px;
    }

    .chart-wrapper {
        height: 300px;
        padding: 15px;
    }

    h1 {
        font-size: 1.5em;
    }

    .total-count {
        font-size: 1.1em;
    }
}
</style>
