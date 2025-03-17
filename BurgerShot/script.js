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

// Function to update recipe dynamically
function updateRecipe() {
    const hamQty = parseInt(document.getElementById('hamBurgerQty').value) || 0;
    const cheeseQty = parseInt(document.getElementById('cheeseBurgerQty').value) || 0;
    const baconCheeseQty = parseInt(document.getElementById('baconCheeseBurgerQty').value) || 0;
    const baconEggQty = parseInt(document.getElementById('baconEggBurgerQty').value) || 0;
    const vegQty = parseInt(document.getElementById('vegBurgerQty').value) || 0;
    const rPotato = parseInt(document.getElementById('friesQty').value) || 0;
    const cBreast = parseInt(document.getElementById('cNuggetsQty').value) || 0;
    const gBecon = parseInt(document.getElementById('beconQty').value) || 0;
    const avocado = parseInt(document.getElementById('avocadoQty').value) || 0;
    const fEgg = parseInt(document.getElementById('fEggsQty').value) || 0;

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

    addRecipe("Ham Burger Recipe", hamQty, [`${hamQty * 1}x Burger Buns`, `${hamQty}x Lettuce`, `${hamQty}x Burger Patty`]);
    addRecipe("Cheese Burger Recipe", cheeseQty, [`${cheeseQty * 1}x Burger Buns`, `${cheeseQty}x Lettuce`, `${cheeseQty}x Burger Patty`, `${cheeseQty}x Cheese`]);
    addRecipe("Bacon Cheese Burger Recipe", baconCheeseQty, [`${baconCheeseQty * 1}x Burger Buns`, `${baconCheeseQty}x Lettuce`, `${baconCheeseQty}x Burger Patty`, `${baconCheeseQty}x Cheese`, `${baconCheeseQty}x Grilled Bacon`]);
    addRecipe("Bacon n' Egg Burger Recipe", baconEggQty, [`${baconEggQty * 1}x Burger Buns`, `${baconEggQty}x Lettuce`, `${baconEggQty}x Burger Patty`, `${baconEggQty}x Grilled Bacon`, `${baconEggQty}x Egg`]);
    addRecipe("Veggie Burger Recipe", vegQty, [`${vegQty * 1}x Burger Buns`, `${vegQty}x Lettuce`]);
    addRecipe("Belgian Fries", rPotato, [`${rPotato * 2}x Potato`]);
    addRecipe("Chicken Nuggets", cBreast, [`${cBreast * 1}x Chicken Breast`, `${cBreast}x Breadcrumbs`]);
    addRecipe("Grilled Becon", gBecon, [`${gBecon * 2}x Raw Bacon`]);
    addRecipe("Avocado Smoothie", avocado, [`${avocado * 2}x Avocado`]);
    addRecipe("Fried Egg", fEgg, [`${fEgg * 2}x `]);

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
