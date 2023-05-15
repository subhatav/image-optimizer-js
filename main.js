const uploadBox = document.querySelector(".upload-box");

const fileInput = uploadBox.querySelector("input");
const previewImage = uploadBox.querySelector("img");

const widthInput = document.querySelector(".width input");
const heightInput = document.querySelector(".height input");

const ratioInput = document.querySelector(".ratio input");
const qualityInput = document.querySelector(".quality input");

const downloadButton = document.querySelector(".download-btn");
const cancelButton = document.querySelector(".cancel-btn");

let originalRatio;

const loadFile = (event) => {

  const file = event.target.files[0];

  if (!file) return;

  // Pass the selected Image to the Preview Source
  previewImage.src = URL.createObjectURL(file);

  // Execute the function after the Image is loaded
  previewImage.addEventListener("load", () => {

    widthInput.value = previewImage.naturalWidth;
    heightInput.value = previewImage.naturalHeight;

    originalRatio = previewImage.naturalWidth / previewImage.naturalHeight;

    document.querySelector(".wrapper").classList.add("active");
  });
}

["change", "keyup"].forEach((event) => {

  return widthInput.addEventListener(event, () => {

    let height = heightInput.value;

    // Compute the height if the `Lock Aspect Ratio` checkbox is ticked
    if (ratioInput.checked) height = widthInput.value / originalRatio;

    heightInput.value = Math.floor(height);
  });
});

["change", "keyup"].forEach((event) => {

  return heightInput.addEventListener(event, () => {

    let width = widthInput.value;

    // Compute the width if the `Lock Aspect Ratio` checkbox is ticked
    if (ratioInput.checked) width = heightInput.value * originalRatio;

    widthInput.value = Math.floor(width);
  });
});

const optimizeAndDownload = () => {

  const imageCanvas = document.createElement("canvas");
  const imageContext = imageCanvas.getContext("2d");

  const downloadElement = document.createElement("a");

  // Choose a Quality Level in the scale of [0.1 .. 1.0]
  const imageQuality = qualityInput.checked ? 0.7 : 1.0;

  imageCanvas.width = widthInput.value;
  imageCanvas.height = heightInput.value;

  // Draw the selected Image with the input dimensions onto the Canvas created
  imageContext.drawImage(previewImage, 0, 0, imageCanvas.width, imageCanvas.height);

  // Pass the Canvas Data URL to the `href` value of the `<a>` element
  downloadElement.href = imageCanvas.toDataURL("image/png", imageQuality);
  downloadElement.download = new Date().getTime();

  downloadElement.click(); // clicking <a> element so the file download
}

uploadBox.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", loadFile);

downloadButton.addEventListener("click", optimizeAndDownload);
cancelButton.addEventListener("click", () => window.location.reload());
