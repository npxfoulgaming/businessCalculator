let selectedItems = [];

document.querySelectorAll('.food').forEach(item => {
    item.addEventListener('change', updateBill);
});

// Adding event listener for quantity selection
document.querySelectorAll('.quantity').forEach(select => {
    select.addEventListener('change', updateBill);
});

document.querySelectorAll('input[name="discount"]').forEach(discount => {
    discount.addEventListener('change', updateBill);
});

// Handle "Enter" key press to apply custom discount
document.getElementById('customDiscount').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        updateBill();  // Update the bill when "Enter" is pressed
    }
});

// Handle clicking outside (losing focus) to apply custom discount
document.getElementById('customDiscount').addEventListener('blur', function() {
    updateBill();  // Update the bill when the input loses focus
});

function updateBill() {
    const billList = document.querySelector('.bill-list');
    const totalSpan = document.getElementById('total');
    billList.innerHTML = '';  // Clear the current bill list

    let total = 0;

    // Add selected items and their quantities
    document.querySelectorAll('.food:checked').forEach(item => {
        const itemText = item.nextSibling.textContent.trim();
        const itemValue = parseFloat(item.value);
        const quantitySelect = item.closest('label').querySelector('.quantity');  // Find the corresponding quantity dropdown
        const quantity = quantitySelect ? parseInt(quantitySelect.value) : 1;  // Default to 1 if no quantity is selected

        total += itemValue * quantity;  // Multiply the item price by the selected quantity

        let li = document.createElement('li');
        li.textContent = `${itemText} (x${quantity}): Rs ${(itemValue * quantity).toFixed(2)}`;
        billList.appendChild(li);

        // Show meal description if applicable
        const mealDescriptionId = item.getAttribute('data-repair') + 'Description';
        const descriptionElement = document.getElementById(mealDescriptionId);
        if (descriptionElement) {
            descriptionElement.classList.remove('hidden');
        }
    });

    // Hide descriptions if the meal pack is unchecked
    document.querySelectorAll('.food:not(:checked)').forEach(item => {
        const mealDescriptionId = item.getAttribute('data-repair') + 'Description';
        const descriptionElement = document.getElementById(mealDescriptionId);
        if (descriptionElement) {
            descriptionElement.classList.add('hidden');
        }
    });

    // Add discount section
    let discountRate = parseFloat(document.querySelector('input[name="discount"]:checked')?.value || 0);
    
    // Apply custom discount if provided
    let customDiscount = parseFloat(document.getElementById('customDiscount').value || 0);
    if (customDiscount > 0) {
        discountRate = customDiscount / 100;
    }

    const discountAmount = total * discountRate;
    total -= discountAmount;

    // Show discount in bill with percentage
    if (discountRate > 0 || customDiscount > 0) {
        let discountLi = document.createElement('li');
        let discountText = `Discount (${(discountRate > 0 ? (discountRate * 100) : customDiscount)}%): Rs <span>-${discountAmount.toFixed(2)}</span>`;
        discountLi.innerHTML = discountText;
        billList.appendChild(discountLi);
    }

    // Final total
    totalSpan.textContent = total.toFixed(2);
}

function copyBill() {
    const billText = [...document.querySelectorAll('.bill-list li')].map(li => li.textContent).join('\n');
    const totalText = `Total: Rs ${document.getElementById('total').textContent}`;
    const fullText = `${billText}\n\n${totalText}`;

    navigator.clipboard.writeText(fullText).then(() => {
        let popupMessage = document.getElementById('popupMessage');
        popupMessage.style.display = 'block';
        setTimeout(() => {
            popupMessage.style.display = 'none';
        }, 2000);
    });
}
