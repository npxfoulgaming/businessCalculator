let selectedUpgrades = {};
let selectedDiscount = 0;

document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener('change', updateBill);
});

// Handle custom discount input
document.getElementById('customDiscount').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        updateBill();  
    }
});

document.getElementById('customDiscount').addEventListener('blur', function() {
    updateBill();  
});

// Add event listeners for checkboxes to update the bill
document.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', updateBill);
});

function updateBill() {
    const billList = document.querySelector('.bill-list');
    const totalSpan = document.getElementById('total');
    billList.innerHTML = '';

    let total = 0;

    selectedUpgrades = {}; 

    // Process radio button selections
    document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        let category = input.name;
        let itemText = input.nextSibling.textContent.trim();
        let itemValue = parseFloat(input.value);

        if (category === "discount") {
            selectedDiscount = itemValue;
            return;
        }

        selectedUpgrades[category] = { itemText, itemValue };
        total += itemValue;
    });

    // Process checkbox selections for "systems" category
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
        let category = "systems"; // Fixed category for checkbox
        let itemText = input.nextSibling.textContent.trim();
        let itemValue = parseFloat(input.value);

        // Add the checkbox item to the selected upgrades
        selectedUpgrades[category] = selectedUpgrades[category] || {}; // Initialize if not yet
        selectedUpgrades[category][itemText] = itemValue;
        total += itemValue;
    });

    // Display selected upgrades
    for (const category in selectedUpgrades) {
        if (category === "systems") {
            // For the systems category, display multiple items selected
            for (const itemText in selectedUpgrades[category]) {
                let itemValue = selectedUpgrades[category][itemText];
                let li = document.createElement('li');
                li.textContent = `${itemText}: $${itemValue.toFixed(2)}`;
                billList.appendChild(li);
            }
        } else {
            let { itemText, itemValue } = selectedUpgrades[category];
            let li = document.createElement('li');
            li.textContent = `${itemText}: $${itemValue.toFixed(2)}`;
            billList.appendChild(li);
        }
    }

    // Check if custom discount is provided
    const customDiscount = document.getElementById('customDiscount').value;
    if (customDiscount) {
        selectedDiscount = parseFloat(customDiscount) / 100;  
    }

    let discountAmount = total * selectedDiscount;
    let discountedTotal = total - discountAmount;

    if (selectedDiscount > 0) {
        let discountLi = document.createElement('li');
        discountLi.innerHTML = `<strong>Discount (${(selectedDiscount * 100).toFixed(0)}%): -$${discountAmount.toFixed(2)}</strong>`;
        billList.appendChild(discountLi);
    }

    totalSpan.textContent = discountedTotal.toFixed(2);
}

function copyBill() {
    const popup = document.getElementById("popupMessage");
    const billItems = document.querySelectorAll('.bill-list li');
    const totalElement = document.getElementById('total');

    if (!totalElement || billItems.length === 0) {
        showPopup("Nothing to copy!", "orange");
        return;
    }

    let billText = `Legacy Roleplay Nepal Tuner Bill:\n`;
    billItems.forEach(li => {
        billText += li.textContent + '\n';
    });
    billText += `Total: $${totalElement.textContent}`;

    navigator.clipboard.writeText(billText).then(() => {
        showPopup("Bill copied to clipboard!", "green");
    }).catch(err => {
        console.error("Failed to copy:", err);
        showPopup("Failed to copy bill!", "red");
    });

    function showPopup(message, bgColor) {
        if (!popup) return;
        popup.textContent = message;
        popup.style.display = "block";
        popup.style.backgroundColor = bgColor;
        setTimeout(() => {
            popup.style.display = "none";
            popup.textContent = "";
            popup.style.backgroundColor = "";
        }, 2000);
    }
}

/*
function copyBill() {
    let billText = `Legacy Roleplay Nepal Tuner Bill:\n`;
    document.querySelectorAll('.bill-list li').forEach(li => {
        billText += li.textContent + '\n';
    });
    billText += `Total: $${document.getElementById('total').textContent}`;

    navigator.clipboard.writeText(billText).then(() => {
        let popup = document.getElementById("popupMessage");
        popup.style.display = "block";
        setTimeout(() => { popup.style.display = "none"; }, 2000);
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}
*/

// Show the popup and overlay
document.getElementById('commissionBtn').addEventListener('click', function() {
    document.getElementById('commissionPopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.body.style.overflow = 'none'; // Disable scrolling on body
});

// Hide the popup and overlay when clicking the close button
document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('commissionPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = ''; // Enable scrolling on body
});

// Hide the popup and overlay if the user clicks outside the popup
document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('commissionPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = ''; // Enable scrolling on body
});

document.getElementById('vehiclePrice').addEventListener('input', function() {
    let price = parseFloat(this.value) || 0;
    let commission = price * 0.1; // 10% Commission
    document.getElementById('commissionAmount').textContent = commission.toFixed(2);
});

document.getElementById('copyCommission').addEventListener('click', function() {
    let price = document.getElementById('vehiclePrice').value;
    let commission = document.getElementById('commissionAmount').textContent;

    let commissionText = `Vehicle Price: $${price}\nCommission (10%): $${commission}`;

    navigator.clipboard.writeText(commissionText).then(() => {
        alert("Commission copied successfully!");
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
});
