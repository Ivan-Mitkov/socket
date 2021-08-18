//get socket.io
const socket = io("http://localhost:8000");

//listen for nsList - list of all namespaces
//socket is connected to the main namespace
socket.on("nsList", (nsData) => {
  console.log(nsData);
  //update DOM with namespaces
  let domNamespaces = document.querySelector(".namespaces");

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
      const singleNSenpoint=ns.endpoint
    });
  });
});
