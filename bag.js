let list = document.getElementById("list");

function getGoods(arr) {
  list.innerHTML = "";
  arr.forEach((element) => {
    addElements(element);
  });
}

function writeHtml(product_name, product_description, product_price) {
     return(
        `
      <p data-product="product_name" class="product_name product-item">${product_name}</p>
      <p data-product="product_description" class="product_description product-item">${product_description}</p>
      <p data-product="product_price" class="product_price product-item">${product_price}</p>
      <button class="deleteProduct">DELETE</button>
      
            `
     )
}

function handleDelete(li, id) {
    fetch(`http://localhost:5000/delete-mybag/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.case) {
          li.remove();
          // getFetch()
        } else {
          alert("THIS ELEMENT ALREADY DELETED");
        }
      });
}

function addElements(product) {
  let li = document.createElement("li");
  li.innerHTML = writeHtml(product.product_name, product.product_description, product.product_price)
  li.querySelector(".deleteProduct").addEventListener("click", () => handleDelete(li, product.id));

  list.appendChild(li);
}

function getFetch() {
  fetch(`http://localhost:5000/my-bag`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      getGoods(data);
    });
}

getFetch();


