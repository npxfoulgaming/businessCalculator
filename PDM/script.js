function calculateCommission() {
    let price = parseFloat(document.getElementById('price').value);
    let commissionInput = document.getElementById('commission');
    let commission = parseFloat(commissionInput.value);
    
    if (isNaN(commission) || commission < 0) {
        commission = 10; // Default to 10% if invalid
        commissionInput.value = 10;
    }

    let commissionAmount = (isNaN(price) || price <= 0) ? 0 : (price * commission) / 100;
    document.getElementById('result').innerHTML = `
        Vehicle Price: $${price.toFixed(2)}<br>
        Commission Price: $${commissionAmount.toFixed(2)}
    `;
}

function copyToClipboard() {
    let price = parseFloat(document.getElementById('price').value);
    let commission = parseFloat(document.getElementById('commission').value);
    let commissionAmount = (isNaN(price) || price <= 0) ? 0 : (price * commission) / 100;
    let text = `Commission Rate: ${commission}%\nVehicle Price: ${price}\nCommission Price: ${commissionAmount.toFixed(2)}`;
    navigator.clipboard.writeText(text).then(() => {
        let popup = document.getElementById('popup');
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 5000);
    });
}