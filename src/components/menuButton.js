export default function menuButton() {
    console.log("This is menuButton")
    var button = document.createElement("button");
    button.innerHTML = "Do Something";
    button.addEventListener ("click", function() {
        alert("did something");
      });
      var body = document.getElementsByTagName("body")[0];
body.appendChild(button);
}