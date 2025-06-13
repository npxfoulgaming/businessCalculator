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
        li.textContent = `${itemText} (x${quantity}): $${(itemValue * quantity).toFixed(2)}`;
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
        let discountText = `Discount (${(discountRate > 0 ? (discountRate * 100) : customDiscount)}%): $<span>-${discountAmount.toFixed(2)}</span>`;
        discountLi.innerHTML = discountText;
        billList.appendChild(discountLi);
    }

    // Final total
    totalSpan.textContent = total.toFixed(2);
}

function copyBill() {
    const billItems = [...document.querySelectorAll('.bill-list li')];
    const popupMessage = document.getElementById('popupMessage');
    const totalElement = document.getElementById('total');

    if (!billItems.length || !totalElement) {
        return showPopup("Nothing to copy!", "orange");
    }

    const billText = billItems.map(li => li.textContent).join('\n');
    const totalText = `Total: Rs ${totalElement.textContent}`;
    const fullText = `${billText}\n\n${totalText}`;

    // Fallback if clipboard API fails (common in older FiveM CEF)
    if (!navigator.clipboard) {
        const textarea = document.createElement('textarea');
        textarea.value = fullText;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showPopup("Bill copied!", "green");
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showPopup("Copy failed!", "red");
        }
        document.body.removeChild(textarea);
        return;
    }

    navigator.clipboard.writeText(fullText).then(() => {
        showPopup("Bill copied!", "green");
    }).catch(err => {
        console.error("Clipboard API failed:", err);
        showPopup("Copy failed!", "red");
    });

    function showPopup(message, bgColor) {
        popupMessage.textContent = message;
        popupMessage.style.display = 'block';
        popupMessage.style.backgroundColor = bgColor;

        setTimeout(() => {
            popupMessage.style.display = 'none';
            popupMessage.textContent = '';
            popupMessage.style.backgroundColor = '';
        }, 2000);
    }
}

//-------------------------------------//

document.getElementById('recipeBtn').addEventListener('click', function() {
    document.getElementById('recipePopup').classList.remove('hidden');
});

document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('recipePopup').classList.add('hidden');
});

// Close the popup if the user clicks outside of it
window.addEventListener('click', function(event) {
    const popup = document.getElementById('recipePopup');
    // Check if the clicked area is outside the popup
    if (!popup.contains(event.target) && event.target !== document.getElementById('recipeBtn')) {
        popup.classList.add('hidden');
    }
});

/*
// Function to copy recipe text
function copyToClipboard(text, iconElement) {
    navigator.clipboard.writeText(text).then(() => {
        // Show confirmation check mark ✅
        iconElement.innerHTML = "✅";
        setTimeout(() => {
            iconElement.innerHTML = "📋"; // Reset back to copy icon
        }, 1000);
    }).catch(err => {
        console.log('Failed to copy:', err);
    });
}
*/

function copyToClipboard(text, iconElement) {
    const popup = document.getElementById("popupMessage");

    // Check if there's text to copy
    if (!text || text.trim() === "") {
        iconElement.innerHTML = "❌";
        showPopup("Nothing to copy!", "orange");
        setTimeout(() => {
            iconElement.innerHTML = "📋";
        }, 1000);
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        iconElement.innerHTML = "✅";
        showPopup("Copied to clipboard!", "green");
        setTimeout(() => {
            iconElement.innerHTML = "📋";
        }, 1000);
    }).catch(err => {
        console.error("Failed to copy:", err);
        iconElement.innerHTML = "❌";
        showPopup("Failed to copy!", "red");
        setTimeout(() => {
            iconElement.innerHTML = "📋";
        }, 1000);
    });

    function showPopup(message, color) {
        if (!popup) return;
        popup.textContent = message;
        popup.style.display = "block";
        popup.style.backgroundColor = color;
        setTimeout(() => {
            popup.style.display = "none";
            popup.textContent = "";
            popup.style.backgroundColor = "";
        }, 2000);
    }
}

// Function to update recipe dynamically
function updateRecipe() {
    const browniesQty = parseInt(document.getElementById('browniesQty').value) || 0;
    const weedGummiesQty = parseInt(document.getElementById('wGummiesQty').value) || 0;
    const weedJointQty = parseInt(document.getElementById('jointQty').value) || 0;

    let recipes = [];

    function addRecipe(name, qty, ingredients) {
        if (qty > 0) {
            // Create the recipe text as plain text
            let recipeText = `\n${name} for ${qty}x:\n${ingredients.join(", ")}\n`;

            // Add recipe item with a copy icon that triggers the copy function
            recipes.push(
                `<div class="recipe-item">
                    <span>${recipeText}</span>
                    <span class="copy-icon" data-recipe-text="${recipeText}">📋</span>
                </div>`
            );
        }
    }

    addRecipe("Browines Recipe", browniesQty, [`${browniesQty * 2}x  Cocoa Powder`, `${browniesQty * 1}x Weed 1oz`]);
    addRecipe("Weed Gummies Recipe", weedGummiesQty, [`${weedGummiesQty * 2}x Jolly Ranchers`, `${weedGummiesQty * 1}x Weed 1oz`]);
    addRecipe("Joint Recipe", weedJointQty, [`${weedJointQty * 1}x Weed 1q`, `${weedJointQty}x Rolling Paper`]);

    document.getElementById('ingredientsList').innerHTML = recipes.length > 0 ? recipes.join("") : "No burgers selected.";

    // Attach event listener to the copy icons
    document.querySelectorAll('.copy-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const recipeText = this.getAttribute('data-recipe-text');
            copyToClipboard(recipeText, this);
        });
    });
}

// Attach event listeners to update automatically
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', updateRecipe);
});
