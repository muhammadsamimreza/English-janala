const synonymSpan = (arr) => {
  const synName = arr.map((synonym) => `<span class="btn">${synonym}</span>`);
  return synName.join(" ");
};
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-GB"; // English
  window.speechSynthesis.speak(utterance);
}

function pronounceWordUs(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-Us"; // English
  window.speechSynthesis.speak(utterance);
}


const loading = (status) => {
  if (status === true) {
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("words-container").classList.add("hidden");
  } else {
    document.getElementById("words-container").classList.remove("hidden");
    document.getElementById("loading").classList.add("hidden");
  }
};
const lavelName = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLavelNo(json.data));
};

const displayLavelNo = (lessonNo) => {
  const levelContainer = document.getElementById("lession-container");
  levelContainer.innerHTML = "";
  for (let lessNo of lessonNo) {
    const div = document.createElement("div");
    div.innerHTML = `
                <button id="lession-btn-${lessNo.level_no}" onclick="lessionDetails(${lessNo.level_no})" 
                class="btn btn-outline btn-primary activeBtn">
                  <i class="fa-solid fa-book-open"></i>Learn - ${lessNo.level_no}
                </button>
         `;
    levelContainer.append(div);
  }
};
const removeActive = () => {
  const activeBtn = document.querySelectorAll(".activeBtn");
  activeBtn.forEach((btn) => btn.classList.remove("active"));
};

const lessionDetails = (id) => {
  loading(true);
  fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const lessBtn = document.getElementById(`lession-btn-${id}`);
      lessBtn.classList.add("active");
      wordsDetailShow(data.data);
    });
};

const wordsDetailShow = (data) => {
  const wordContainer = document.getElementById("words-container");
  wordContainer.innerHTML = "";

  if (data.length === 0) {
    wordContainer.innerHTML = `
        <div class="text-center col-span-3 space-y-3 bn-font">
            <img class="mx-auto" src="./assets/alert-error.png"/>
          <p class="text-md font-"> এই Lession এ কোন Vocabulary যুক্ত করা হয়নি</p>
          <p class="text-3xl font-bold">Next Lession ভিজিট করুন</p>
          
        </div>
        `;
    loading(false);
    return;
  }
  data.forEach((word) => {
    const wordDiv = document.createElement("div");
    wordDiv.innerHTML = `
       <div class="bg-white p-3 text-center rounded-lg bn-font">
            <div class="content text-center space-y-4">
              <h1 class="text-2xl font-bold">${
                word.word ? word.word : "কোন শব্দ নাই"
              }</h1>
              <p class="text-xl font-md "> meaning / pronunciation</p>
              <h1 class="text-xl bn-font font-bold text-[#42424a]">${
                word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
              }/${
      word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"
    }</h1>
            </div>
            <div class="flex justify-between items-center mx-5 mt-5 mb-2">
              <span onclick="loadSingleWordDetails(${
                word.id
              })" class="bg-gray-100 p-3 rounded-md">
              <i class="fa-solid fa-circle-info"></i></span>
              <div>
              <span onclick="pronounceWord('${word.word}')" class="bg-gray-100 p-3 rounded-md">
              <i class="fa-solid fa-volume-high"></i></span>
              <span onclick="pronounceWordUs('${word.word}')" class="bg-gray-100 p-3 rounded-md">
              <i class="fa-solid fa-volume-high"></i></span>
              </div>
            </div>
        </div>
       `;
    wordContainer.append(wordDiv);
  });
  loading(false);
};

const loadSingleWordDetails = (id) => {
  fetch(`https://openapi.programming-hero.com/api/word/${id}`)
    .then((res) => res.json())
    .then((data) => displaySingleWordDetails(data.data));
};

const displaySingleWordDetails = (word) => {
  const box = document.getElementById("detailsBox");
  console.log(word);
  //     {
  //     "word": "Grateful",
  //     "meaning": "কৃতজ্ঞ",
  //     "pronunciation": "গ্রেটফুল",
  //     "level": 3,
  //     "sentence": "I am grateful for your help.",
  //     "points": 3,
  //     "partsOfSpeech": "adjective",
  //     "synonyms": [
  //         "thankful",
  //         "appreciative",
  //         "obliged"
  //     ],
  //     "id": 7
  // }
  box.innerHTML = `
          <h1 class="text-2xl font-bold">
             ${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${
    word.pronunciation
  })
            </h1>
            <div>
              <h2 class="text-xl font-semibold">Meaning</h2>
              <p class="bn-font mt-2">${
                word.meaning
                  ? word.meaning
                  : `<p class="flex items-center gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-red-500 "></i>Meaning not found
                  </p>`
              }</p>
            </div>
            <div>
              <h2 class="text-xl font-semibold">Example</h2>
              <p class="mt-2">${
                word.sentence
                  ? word.sentence
                  : `<p class="flex items-center gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-red-500 "></i>Sentence not found
                  </p>`
              }</p>
            </div>
            <div>
              <h3 class="bn-font text-xl font-semibold">সমার্থক শব্দ</h3>
              <div class="flex flex-wrap gap-5 mt-2">
              ${
                synonymSpan(word.synonyms)
                  ? synonymSpan(word.synonyms)
                  : `<p class="flex items-center gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-red-500 "></i>Synonyms not found
                  </p>`
              }
                
              </div>
            </div>
     `;

  document.getElementById("modal").showModal();
};

document.getElementById("searchBtn").addEventListener("click", () => {
  removeActive();
  const userInput = document.getElementById("userInput").value;
  const searchValue = userInput.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allData = data.data;
      const filterWords = allData.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      wordsDetailShow(filterWords)
    });
   document.getElementById("userInput").value ='';
});
lavelName();
