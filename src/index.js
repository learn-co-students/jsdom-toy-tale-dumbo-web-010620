let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection")

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

  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(result => renderAllToys(result))


  function renderAllToys(toyArray) {
    toyCollection.innerHTML = ""
    toyArray.forEach(toy => renderOneToy(toy))
  }

  function renderOneToy(toy) {
    const card = document.createElement("div")
    card.className = "card"
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar"/>
      <p>${toy.likes} Likes</p>
    `
    const button = document.createElement("button")
    button.className = "like-btn"
    button.textContent = "Like <3"
    button.id = toy.id
    card.append(button)
    toyCollection.append(card)

    button.addEventListener('click', (e) => {
      likes(e)
    })
  }

  
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
      const newToy = renderOneToy(newObj)
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

});
