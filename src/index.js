let addToy = false;

const addBtn = document.querySelector("#new-toy-btn")
const toyForm = document.querySelector(".container")
const divCollect = document.querySelector("#toy-collection")

const getToys = () => {
  return fetch("http://localhost:3000/toys")
            .then( res => res.json())
}

getToys().then(toys => {
  toys.forEach(toy => {
    //function to render toys goes here or something
    renderToys(toy)
  })
})

const renderToys = toy => {

  let divCard = document.createElement("div")
  let h2 = document.createElement("h2")
  let img = document.createElement("img")
  let p = document.createElement("p")
  let btn = document.createElement("button")

  img.setAttribute("src", toy.image)
  img.setAttribute("class", "toy-avatar")
  btn.setAttribute("class", "like-btn")
  btn.setAttribute("id", toy.id)
  divCard.setAttribute("class", "card")

  h2.innerText = toy.name
  p.innerText = `${toy.likes} likes`
  btn.innerText = "like"

  divCard.append(h2, img, p, btn)
  divCollect.append(divCard)

  btn.addEventListener("click", event => likes(event))
  
}

const likes = event => {
  event.preventDefault()
  let more = parseInt(event.target.previousElementSibling.innerText) + 1

  fetch(`http://localhost:3000/toys/${event.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": more
    })
  })
  .then( res => res.json() )
  .then( like_obj => event.target.previousElementSibling.innerText = `${more} likes`)
  
}


const postToy = toyData => {
  fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": toyData.name.value,
      "image": toyData.image.value,
      "likes": 0
    })
  })
  .then( res => res.json())
  .then( toyObj => {
    let newToy = renderToys(toyObj)
    divCollect.append(newToy)
  })
}


addBtn.addEventListener("click", () => {

  addToy = !addToy
  if(addToy) {
    toyForm.style.display = "block"
    toyForm.addEventListener("submit", event =>{
      event.preventDefault()
      postToy(event.target)
    })
  } else {
    toyForm.style.display = "none"
  }
})