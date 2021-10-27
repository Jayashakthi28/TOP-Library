/*****Add book card functionalities******/

document.querySelectorAll(".book-det-inp").forEach((d) => {
  const inp = d.querySelector("input");
  inp.addEventListener("input",()=>{
    d.querySelector(".placeholder-text").classList.add("placeholder-text-up");
    d.querySelector('.inp-error').textContent="";
  })
  d.addEventListener("click", () => {
    if (inp.value.length === 0) {
      d.querySelector(".placeholder-text").classList.toggle(
        "placeholder-text-up"
      );
    } else {
      d.querySelector(".placeholder-text").classList.add("placeholder-text-up");
    }
    document.querySelectorAll(".book-det-inp").forEach((t) => {
      if (t.querySelector("input").value.length === 0 && d !== t) {
        t.querySelector(".placeholder-text").classList.remove(
          "placeholder-text-up"
        );
      }
    });
  });
  document.querySelector('.add-book-cont').addEventListener("click",(e)=>{
      if(!e.target.classList.contains('add-book-cont')) return;
      if (inp.value.length === 0) {
        d.querySelector(".placeholder-text").classList.remove(
          "placeholder-text-up"
        );
      } else {
        d.querySelector(".placeholder-text").classList.add("placeholder-text-up");
      }
  });
});

function addBookToggler(){
    document.querySelector('.opacity-cont').classList.toggle("opacity-rem-bk-cont");
    document.querySelector('.add-book-cont').classList.toggle('none');
}

document.querySelector('#add-book-btn').addEventListener("click",addBookToggler);


document.querySelector('.add-book-cont .close-icon-cont img').addEventListener("click",addBookToggler);

document.querySelector('.opacity-cont').addEventListener("click",addBookToggler);

/******************************************* */
const pg_num_inp_cont=document.querySelectorAll('.pages-inp-cont .book-det-inp');
pg_num_inp_cont[0].querySelector('input').addEventListener("input",()=>{
    if(pg_num_inp_cont[1].querySelector('input').value.length===0){
        pg_num_inp_cont[0].querySelector('input').value="";
        pg_num_inp_cont[0].querySelector('.inp-error').textContent="Please Fill total Pages";
    }
})

/****************************************** */
document.querySelector('.add-book-cont button').addEventListener("click",()=>{
    document.querySelectorAll('.book-det-inp').forEach(d=>{
        if(d.querySelector('input').value.length===0){
            d.querySelector(".inp-error").textContent="Please Fill Out this field";
            return;
        }
    })
    if(+pg_num_inp_cont[0].querySelector('input').value > +pg_num_inp_cont[1].querySelector('input').value){
        pg_num_inp_cont[0].querySelector('input').value="";
        pg_num_inp_cont[0].querySelector(".inp-error").textContent="Value must be less than total Pages";
        return;
    }

    

    let bkName=document.querySelectorAll('.book-det-inp input')[0].value;
    let AuthName=document.querySelectorAll('.book-det-inp input')[1].value;
    let comPages=document.querySelectorAll('.book-det-inp input')[2].value;
    let totPages=document.querySelectorAll('.book-det-inp input')[3].value;
    let comFlag=document.querySelector('.book-com-status-inp input').checked;
    const newBook=new book(bkName,AuthName,comPages,totPages,comFlag);
    console.log(newBook);
    myLibrary.push(newBook);
    bookFiller(newBook);
    addBookToggler();
})



/******************************************* */
let myLibrary=[];

function book(){
    this.name=arguments[0];
    this.authour=arguments[1];
    this.comp_pages=arguments[2];
    this.tot_pages=arguments[3];
    this.comp_flag=arguments[4];
}

function bookFiller(book){
    const element=document.createElement("div");
    element.classList.add("book-card");
    element.innerHTML+=` <h1 class="book-name">${book['name']}</h1>
    <h2 class="authour-name">${book['authour']}</h2>
    <div class="page-cnt"><input type="number" value="${book['comp_pages']}">/&nbsp;<span class="tot-page">${book["tot_pages"]}</span></div>
    <button class="book-status-btn">${(book['comp_flag'])?"Completed":"Not Completed"}</button>
    <div class="book-icons-cnt">
        <img src="./assets/folder_plus.svg" alt="">
        <img src="./assets/edit.svg" alt="">
        <img src="./assets/trash_full.svg" alt="">
    </div>`;
    document.querySelector(".main-books-cont").appendChild(element);
}

