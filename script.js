function searchProducts() {
    let input = document.querySelector('.search-bar').value.toLowerCase();
    let products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        let title = product.querySelector('h3').innerText.toLowerCase();
        let desc = product.querySelector('p').innerText.toLowerCase();
        
        if (title.includes(input) || desc.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}
