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
    const popup = document.getElementById('popup');
    const priceInput = document.getElementById('price');
    const commissionInput = document.getElementById('commission');

    const price = parseFloat(priceInput.value);
    const commission = parseFloat(commissionInput.value);

    if (isNaN(price) || price <= 0 || isNaN(commission)) {
        showPopup("Invalid price or commission!", "orange");
        return;
    }

    const commissionAmount = (price * commission) / 100;
    const text = `Commission Rate: ${commission}%\nVehicle Price: ${price}\nCommission Price: ${commissionAmount.toFixed(2)}`;

    navigator.clipboard.writeText(text).then(() => {
        showPopup("Copied commission details!", "green");
    }).catch(err => {
        console.error("Copy failed:", err);
        showPopup("Failed to copy!", "red");
    });

    function showPopup(message, bgColor) {
        if (!popup) return;
        popup.textContent = message;
        popup.style.display = 'block';
        popup.style.backgroundColor = bgColor;
        setTimeout(() => {
            popup.style.display = 'none';
            popup.textContent = '';
            popup.style.backgroundColor = '';
        }, 3000);
    }
}

/*
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
*/