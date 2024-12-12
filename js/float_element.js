const codename = document.getElementById("rotXY");

document.addEventListener("mousemove", (e) => {
  rotateElement(e, codename);
});


function rotateElement(event, element) {
  const x = event.clientX;
  const y = event.clientY;

  const middleX = window.innerWidth / 2;
  const middleY = window.innerHeight / 2;

  const offsetX = ((x - middleX) / middleX) * 50;
  const offsetY = ((y - middleY) / middleY) * 50;

  element.style.setProperty("--rotX", -1 * offsetY + "deg");
  element.style.setProperty("--rotY", offsetX + "deg");

}