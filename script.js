const fileInput = document.querySelector("#file");
const uploadBox = document.querySelector(".upload-box");
const preview = document.querySelector("#preview");
const content = document.querySelector(".content");
const extractBtn = document.querySelector(".Extract");
const txtContainer = document.querySelector(".txtContainer");
const extractedTxt = document.querySelector("#extractedTxt");
const statusBar = document.querySelector("#status");
const progressBar = document.querySelector(".progress-box");
const progressFill = document.querySelector("#progress-fill");
const confidenceBar = document.querySelector(".confidence");
const output = document.querySelector(".output");
const copyBtn = document.querySelector(".copy");
const formatSelector = document.querySelector(".Format_Selector");
const resetBtn = document.querySelector(".reset");
let file = null;
uploadBox.addEventListener("click", () => {
  fileInput.click();
});
fileInput.addEventListener("change", () => {
  file = fileInput.files[0];
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
  content.style.display = "none";
  formatSelector.style.display = "block";
});
extractBtn.addEventListener("click", () => {
  progressBar.style.display = "block";
  const lang = document.querySelector("#format").value;
  statusBar.innerText = "processing.....";
  Tesseract.recognize(file, lang, {
    logger: (m) => {
      const percent = Math.round(m.progress * 100);
      statusBar.innerText = `${m.status} (${percent}%)`;
      progressFill.style.width = percent + "%";
    },
  })
    .then(({ data: { text, confidence } }) => {
      txtContainer.style.display = "block";
      
      progressBar.style.display = "none";
      confidenceBar.innerText = "Confidence: " + Math.round(confidence) + "%";
      confidenceBar.style.display = "block";
      extractedTxt.innerText = text;
    })
    .catch((err) => {
      console.log(err);
    });
});
copyBtn.addEventListener("click", () => {
  if (!extractedTxt.innerText) {
    alert("No text to copy!!");
    return;
  }
  navigator.clipboard
    .writeText(extractedTxt.innerText)
    .then(() => {
      alert("Copied to clip board!");
    })
    .catch(() => {
      alert("Failed to Copy!!");
    });
});
resetBtn.addEventListener("click", () => {
  file = null;
  preview.src = "";
  preview.style.display = "none";
  content.style.display = "block";
  formatSelector.style.display = "none";
  txtContainer.style.display = "none";
  confidenceBar.style.display = "none";
  extractedTxt.innerText = "";
  progressBar.style.display = "none";
  document.querySelector("#format").value = "eng";
});
