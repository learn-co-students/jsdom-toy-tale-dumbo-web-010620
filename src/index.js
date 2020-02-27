let addToy = false;


  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".container");
  addBtn.addEventListener("click", event => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block";
      toyForm.addEventListener("submit", event => {
        event.preventDefault()
        createToy(event.target)
      })
    } else {
      toyForm.style.display = "none";
    }
  });


  const toyList = document.getElementById("toy-collection")

  function renderSingleToy(toy) {
    const newDiv = document.createElement("div")
    newDiv.className = "card"
    newDiv.innerHTML = `
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p> ${toy.likes} Likes </p>
      `
    const button = document.createElement("button")
    button.className = "like-btn"
    button.textContent = "Like <3"
    button.id = toy.id
    newDiv.append(button)
    
    toyList.append(newDiv)
    button.addEventListener('click', (e) => {
      likes(e)
    })
  }

  function renderAllToys(toyArray) {
    toyArray.forEach(toy => {
      renderSingleToy(toy)
    })
  }

  fetch(`http://localhost:3000/toys`)
    .then(r => r.json())
    .then(toyArray => {
      renderAllToys(toyArray)
    })

  function createToy(toy_info) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "name": toy_info.name.value,
        "image": toy_info.image.value,
        "likes": 0
      })
    })
    .then(response => response.json())
    .then(newObj => {
      const newToy = renderSingleToy(newObj)
      toyCollection.append(newToy)
    })
  }



  function likes(e) {
    e.preventDefault()
    let more = parseInt(e.target.previousElementSibling.innerText) + 1
  
    fetch(`http://localhost:3000/toys/${e.target.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
  
        },
        body: JSON.stringify({
          "likes": more
        })
      })
      .then(res => res.json())
      .then((like_obj => {
        e.target.previousElementSibling.innerText = `${more} likes`;
      }))
  }

