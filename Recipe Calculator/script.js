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

    addRecipe("Ham Burger Recipe", hamQty, [`${hamQty * 2}x Burger Buns`, `${hamQty}x Lettuce`, `${hamQty}x Burger Patty`]);
    addRecipe("Cheese Burger Recipe", cheeseQty, [`${cheeseQty * 2}x Burger Buns`, `${cheeseQty}x Lettuce`, `${cheeseQty}x Burger Patty`, `${cheeseQty}x Cheese`]);
    addRecipe("Bacon Cheese Burger Recipe", baconCheeseQty, [`${baconCheeseQty * 2}x Burger Buns`, `${baconCheeseQty}x Lettuce`, `${baconCheeseQty}x Burger Patty`, `${baconCheeseQty}x Cheese`, `${baconCheeseQty}x Bacon`]);
    addRecipe("Bacon n' Egg Burger Recipe", baconEggQty, [`${baconEggQty * 2}x Burger Buns`, `${baconEggQty}x Lettuce`, `${baconEggQty}x Burger Patty`, `${baconEggQty}x Bacon`, `${baconEggQty}x Egg`]);
    addRecipe("Veggie Burger Recipe", vegQty, [`${vegQty * 2}x Burger Buns`, `${vegQty}x Lettuce`]);

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