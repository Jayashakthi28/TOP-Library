/*****Add book card functionalities******/

let upBk_Flag=true;
let oldBook=null;


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

document.querySelector('#add-book-btn').addEventListener("click",()=>{
    upBk_Flag=false;
    document.querySelector('.add-book-cont button').textContent="Add Book";
    addBookToggler();
});


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
function submitTrigger(){
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
    const newBook=new bookCreator(bkName,AuthName,comPages,totPages,comFlag);
    
    document.querySelectorAll('.book-det-inp').forEach(d=>{
        d.querySelector('input').value="";
    })
    document.querySelector('.book-com-status-inp input').checked=false;
    
    if(upBk_Flag){
        library.updateBook(newBook,oldBook);
        addBookToggler();
        return;
    }
    library.addBook(newBook);
    bookFiller(newBook);
    addBookToggler();
}


document.querySelector('.add-book-cont button').addEventListener("click",submitTrigger);



/******************************************* */

function bookCreator(){
    this.name=arguments[0];
    this.authour=arguments[1];
    this.comp_pages=arguments[2];
    this.tot_pages=arguments[3];
    this.comp_flag=arguments[4];
}




function libraryCls(book=[],group=[]){
    this.book=book;
    this.group=group
}


function bookCardEventListener(card,book){
    const mainCont=document.querySelector(".main-books-cont");
    card.querySelector("#book-del-btn").addEventListener("click",()=>{
        mainCont.removeChild(card);
        library.remBook(book);
    });

    card.querySelector("#book-edit").addEventListener("click",()=>{
        upBk_Flag=true;
        document.querySelectorAll(".book-det-inp").forEach((d,i) => {
            let inp=d.querySelector("input");
            if(i===0) inp.value=book['name'];
            if(i===1) inp.value=book['authour'];
            if(i===2) inp.value=book['comp_pages'];
            if(i===3) inp.value=book['tot_pages'];
        });
        document.querySelector('.book-com-status-inp input').checked=book['comp_flag'];
        oldBook=book;
        document.querySelector('.add-book-cont button').textContent="Update Book";
        addBookToggler();
    })
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
        <img src="./assets/edit.svg" id="book-edit" alt="">
        <img src="./assets/trash_full.svg" id="book-del-btn" alt="">
    </div>`;
    document.querySelector(".main-books-cont").appendChild(element);
    bookCardEventListener(element,book);
}


function mainBookFiller(){
    document.querySelector('.main-books-cont').innerHTML="";
    library.book.forEach(book=>{
        bookFiller(book);
    })
}

libraryCls.prototype.addBook=function(book){
    this.book.push(book);
    let temp=JSON.stringify(this.book);
    localStorage.setItem("library",temp);
}

libraryCls.prototype.remBook=function(book){
    this.book=this.book.filter((bk)=>{
        return(bk!==book);
    });
    console.log(this.book);
    let temp=JSON.stringify(this.book);
    localStorage.setItem("library",temp);
}

libraryCls.prototype.updateBook=function(newBook,oldBook){
    let i=this.book.findIndex((b)=>{
        return b===oldBook;
    });
    this.book[i]=newBook;
    let temp=JSON.stringify(this.book);
    localStorage.setItem("library",temp);
    mainBookFiller();
}

let library;
let localBookArr=JSON.parse(localStorage.getItem("library"));
(localBookArr!==null)?library=new libraryCls(localBookArr):library=new libraryCls();
mainBookFiller();