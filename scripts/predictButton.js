var predictButton = document.querySelector(".fancy-button");
// var disaserType = predictButton.value;

if (predictButton) {
    predictButton.addEventListener("click", async function() {
        try {
            const response = await axios.post('http://localhost:3000/predictDamage', {disaster: disaserType});
            const data = response.data;
            alert(`Predicted Damage: ${data.prediction}`);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to predict damage');
        }
    });
} else {
    console.error("Predict button not found");
}