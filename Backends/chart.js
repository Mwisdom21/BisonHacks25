// Example: Send a POST request to the /optimize endpoint
fetch('http://localhost:5000/optimize', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    // Replace 'uploads/your_uploaded_file.csv' with the correct file path
    body: JSON.stringify({ file_path: 'uploads/your_uploaded_file.csv' })
})
.then(response => response.json())
.then(data => {
    console.log(data);
    const optimizedAllocations = data.optimized_allocation;
    
    // Generate labels dynamically (e.g., Hospital 1, Hospital 2, ...)
    const labels = optimizedAllocations.map((_, index) => `Hospital ${index + 1}`);
    
    // Create the chart using Chart.js
    const ctx = document.getElementById('allocationChart').getContext('2d');
    const allocationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Optimized Allocation',
                data: optimizedAllocations,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
})
.catch(error => console.error('Error:', error));
