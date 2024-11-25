let list = document.getElementById("list");

function getGoods(arr) {
  list.innerHTML = "";
  arr.forEach((element) => {
    addElements(element);
  });
}

function writeHtml(product_name, product_description, product_price) {
  return (
    `
      <p data-product="product_name" class="product_name product-item">${product_name}</p>
      <p data-product="product_description" class="product_description product-item">${product_description}</p>
      <p data-product="product_price" class="product_price product-item">${product_price}</p>
      <button class="addProduct form-control">ADD</button>
      <button class="deleteProduct form-control">DELETE</button>
      <button class="editProduct form-control">EDIT</button>
      <form class="editForm">
      <input
        type="text"
        class="product_name edit-input"
        name="product_name"
        placeholder="product_name"
      />
      <input
        type="text"
        class="product_description edit-input"
        name="product_description"
        placeholder="product_description"
      /><input
        type="text"
        class="product_price edit-input"
        name="product_price"
        placeholder="product_price"
      /><input
        type="text"
        class="store_name edit-input"
        name="store_name"
        placeholder="store_name"
      /><input
        type="text"
        class="store_address edit-input"
        name="store_address"
        placeholder="store_address"
      />
      <button>SAVE</button>
    </form>
            `
  )
}

function handleEdit(ev, id, li) {
  ev.preventDefault();
  let formData = Object.fromEntries([...new FormData(ev.target)]);
  fetch(`http://localhost:5000/change-admin/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.case) {
        console.log(data);
        //   getFetch();
        let obj = { ...formData }
        delete obj.store_name
        delete obj.store_address

        let editTags = li.querySelectorAll(".product-item");
        editTags.forEach(
          (item) => (item.innerText = obj[item.dataset.product])
        );
      } else {
        alert(data.text);
      }
    });
}

function handleAdd(product) {
  fetch(`http://localhost:5000/add-mybag/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.case) {
        console.log(data);
      } else {
        alert(data.text);
      }
    });
}

function handleDelete(li, id) {
  axios.delete(`http://localhost:5000/delete-admin/${id}`)
    .then((responce) => {
      console.log(data)
      if (responce.data.case) {
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

  li.querySelector(".editForm").style.display = "none";

  let flag = false;

  li.querySelector(".editProduct").addEventListener("click", () => {
    let editInputs = li.querySelectorAll(".editForm .edit-input");
    editInputs.forEach(
      (item) => (item.value = product[item.className.split(" ")[0]])
    );

    flag = !flag;
    if (flag) {
      li.querySelector(".editForm").style.display = "block";
    } else {
      li.querySelector(".editForm").style.display = "none";
    }
  });

  li.querySelector(".editForm").addEventListener("submit", (ev) => handleEdit(ev, product.id, li));
  li.querySelector(".addProduct").addEventListener("click", () => handleAdd(product));


  li.querySelector(".deleteProduct").addEventListener("click", () => handleDelete(li, product.id));

  list.appendChild(li);
}

// function getFetch() {
//   fetch(`http://localhost:5000/goods`, {
//     method: "GET",
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       getGoods(data);
//     });
// }

async function getFetch() {
  let responce = await fetch(`http://localhost:5000/goods`, {
    method: "GET",
  })
  let data = await responce.json()

  getGoods(data);
}

getFetch();

// document.getElementById("addForm").addEventListener("submit", async (ev) => {
//   ev.preventDefault();
//   let formData = Object.fromEntries([...new FormData(ev.target)]);
//   let responce = await fetch(`http://localhost:5000/add-admin/`, {
//     method: "POST",
//     headers: {
//       "Content-type": "application/json",
//     },
//     body: JSON.stringify(formData),
//   })

//   let data = await responce.json()

//   if (data && data.case) {
//     console.log(data);
//     // getFetch();
//     formData.id = data.id;
//     addElements(formData);
//   } else {
//     alert(data.text);
//   }
// });


document.getElementById("addForm").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  let formData = Object.fromEntries([...new FormData(ev.target)]);
  let responce = await axios.post(`http://localhost:5000/add-admin/`, formData)

  if (responce.data && responce.data.case) {
    console.log(responce.data);
    // getFetch();
    formData.id = responce.data.id;
    addElements(formData);
  } else {
    alert(responce.data.text);
  }
});