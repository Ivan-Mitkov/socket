// prom for username
const username = prompt("What is your username");
//get socket.io
// const socket = io("http://localhost:8000");
const socket = io("http://localhost:8000", {
  query: {
    username: username,
  },
});
let nsSocket = "";
//listen for nsList - list of all namespaces
//socket is connected to the main namespace

socket.on("nsList", (nsData) => {
  // console.log(nsData);
  //update DOM with namespaces
  let domNamespaces = document.querySelector(".namespaces");
  if (domNamespaces.childElementCount > 0) {
    Array.from(domNamespaces.childNodes).forEach((el) => el.remove());
  }
  nsData.forEach((ns) => {
    let singleNamespace = document.createElement("div");
    singleNamespace.classList.add("namespace");
    let namespaceImage = document.createElement("img");
    namespaceImage.setAttribute("src", ns.img);
    namespaceImage.setAttribute("ns", ns.endpoint);
    singleNamespace.appendChild(namespaceImage);
    domNamespaces.appendChild(singleNamespace);
    //add a click listener to each namespace
    singleNamespace.addEventListener("click", () => {
      const singleNSenpoint = ns.endpoint;
      joinNs(singleNSenpoint);
    });
  });

  joinNs("/wiki");
});
