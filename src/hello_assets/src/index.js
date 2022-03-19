import { hello } from "../../declarations/hello";

async function post() {
  let postButton = document.getElementById("post")
  postButton.disabled = true
  let textarea = document.getElementById("message")
  let text = textarea.value
}

async function loadPosts() {
  let postSection = document.getElementById("posts")
  postSection.replaceChildren([])
  let posts = await hello.posts(1547677549)
  posts.forEach(element => {
    console.log(element)
    let post = document.createElement("p")
    post.innerText = element
    postSection.appendChild(post)
  });
}

async function load() {
  let postButton = document.getElementById("post")
  postButton.onclick = post
  loadPosts()
}

window.onload = load