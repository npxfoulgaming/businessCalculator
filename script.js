document.querySelector('#search').addEventListener('input', filterList)

    function filterList(){
        const search = document.querySelector('#search')
        const filter = search.value.toLowerCase()
        const listItems = document.querySelectorAll('.card')

        listItems.forEach((card) =>{
            let text = card.textContent;
            if(text.toLowerCase().includes(filter.toLowerCase())){
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }