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
                <button onclick="lessionDetails(${lessNo.level_no})" class="btn btn-outline btn-primary">
                  <i class="fa-solid fa-book-open"></i>Learn - ${lessNo.level_no}
                </button>
         `;
    levelContainer.append(div);
  }
};

const lessionDetails = (id)=>{
    fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then(res=>res.json())
    .then(data=> wordsDetailShow(data.data));
}

const wordsDetailShow=(data)=>{
    const wordContainer = document.getElementById("words-container");
    wordContainer.innerHTML="";

    if(data.length === 0){
        wordContainer.innerHTML=`
        <div class="text-center col-span-3 space-y-3 bn-font">
            <img class="mx-auto" src="./assets/alert-error.png"/>
          <p class="text-md font-"> এই Lession এ কোন Vocabulary যুক্ত করা হয়নি</p>
          <p class="text-3xl font-bold">Next Lession ভিজিট করুন</p>
          
        </div>
        `;
        return
    }
    data.forEach(word => {

       const wordDiv = document.createElement('div');
       wordDiv.innerHTML=`
       <div class="bg-white p-3 text-center rounded-lg bn-font">
            <div class="content text-center space-y-4">
              <h1 class="text-2xl font-bold">${word.word? word.word: "কোন শব্দ নাই"}</h1>
              <p class="text-xl font-md"> meaning/pronunciation</p>
              <h1 class="text-xl bn-font font-bold text-[#42424a]">${word.meaning? word.meaning:"অর্থ পাওয়া যায়নি"}/${word.pronunciation?word.pronunciation :"pronunciation পাওয়া যায়নি"}</h1>
            </div>
            <div class="flex justify-between items-center mx-5 mt-5 mb-2">
              <span class="bg-gray-100 p-3 rounded-md"><i class="fa-solid fa-circle-info"></i></span>
              <span class="bg-gray-100 p-3 rounded-md"><i class="fa-solid fa-volume-high"></i></span>
            </div>
        </div>
       `
    wordContainer.append(wordDiv);
    });
    
}

lavelName();
