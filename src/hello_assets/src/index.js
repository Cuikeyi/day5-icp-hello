import { hello } from "../../declarations/hello";

async function post() {
  let postButton = document.getElementById("post")
  let textarea = document.getElementById("message")
  let text = textarea.value
  if (text.length == 0) {
    window.alert("请输入发布内容")
    return
  }
  // 刷新
  let otp = document.getElementById("otp").value
  if (otp.length == 0) {
    window.alert("请输入otp")
    return
  }
  postButton.disabled = true
  try {
    await hello.post(text, otp)
    window.alert("发布成功")
    load()
  } catch (error) {
    window.alert("Post Failed，OTP错误")
  } finally {
    postButton.disabled = false
  }
}

async function loadPosts() {
  let postSection = document.getElementById("posts")
  postSection.replaceChildren([])
  let posts = await hello.posts(1547677549)
  posts.forEach(element => {
    let post = document.createElement("p")
    let time = new Date(parseInt(element.time)/1_000_000)
    post.innerText = `Author  : ${element.author}\nMessage  : ${element.text}\nTime : ${time}`
    postSection.appendChild(post)
  });
}

async function loadFollows() {
  let followSection = document.getElementById("followSection")
  followSection.replaceChildren([])
  let follows = await hello.follows()
  follows.forEach(element => {
    let follow = document.createElement("p")
    follow.innerText = element.toString()
    followSection.appendChild(follow)
  })
}

async function loadTimeLine() {
  let timeLineSection = document.getElementById("timeLineSection")
  timeLineSection.replaceChildren([])
  let posts = await hello.timeline(1547677549)
  posts.forEach(element => {
    let post = document.createElement("p")
    let time = new Date(parseInt(element.time)/1_000_000)
    post.innerText = `Author  : ${element.author}\nMessage  : ${element.text}\nTime : ${time}`
    timeLineSection.appendChild(post)
  })
}

async function load() {
  let postButton = document.getElementById("post")
  postButton.onclick = post
  loadPosts()
  loadFollows()
  loadTimeLine()
}

window.onload = load