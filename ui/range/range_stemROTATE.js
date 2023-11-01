const range_stemROTATE = document.getElementById("range_stemROTATE");

range_stemROTATE.addEventListener("input",event => {
  if (stemObject) {
    stemObject.rotation.y = Number(range_stemROTATE.value);
    cylinderObject.rotation.y = Number(range_stemROTATE.value);
  }
})