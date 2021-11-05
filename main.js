let upBk_Flag=true;
let oldBook=null;
let oldBookCard=null;
const pg_num_inp_cont=document.querySelectorAll('.pages-inp-cont .book-det-inp');
let library=null;
let localBookArr=JSON.parse(localStorage.getItem("book"));
let localGroup=JSON.parse(localStorage.getItem("group")) || [];
let currBook=null;
(localBookArr!==null)?library=new libraryCls(localBookArr,localGroup):library=new libraryCls();

/***************************Classes And Prototypes*************************/
function bookCreator(){
    this.name=arguments[0];
    this.authour=arguments[1];
    this.comp_pages=arguments[2];
    this.tot_pages=arguments[3];
    this.comp_flag=arguments[4];
    this.group=arguments[5];
}

function libraryCls(book=[],group=[]){
    this.book=book;
    this.group=group;
}

libraryCls.prototype.addBook=function(book){
    this.book.push(book);
    let temp=JSON.stringify(this.book);
    localStorage.setItem("book",temp);
}

libraryCls.prototype.remBook=function(book){
    this.book=this.book.filter((bk)=>{
        return(bk!==book);
    });
    console.log(this.book);
    let temp=JSON.stringify(this.book);
    localStorage.setItem("book",temp);
}

libraryCls.prototype.updateBook=function(newBook,oldBook){
    let i=this.book.findIndex((b)=>{
        return b===oldBook;
    });
    this.book[i]=newBook;
    this.book[i]['group']=oldBook['group']
    let temp=JSON.stringify(this.book);
    localStorage.setItem("book",temp);
    bookReplacer(newBook);
}

libraryCls.prototype.bookCardUpdater=function(book,status,flag){
    let i=this.book.findIndex((b)=>{
        return b===book;
    });
    this.book[i][flag]=status;
    let temp=JSON.stringify(this.book);
    localStorage.setItem("book",temp);
}

libraryCls.prototype.delGroup=function(group){
    this.book.forEach(d=>{
        d['group']=d['group'].filter((t)=>{
            return t!==group;
        });
    })
    this.group=this.group.filter((t)=>{
        return t!==group;
    });
    let temp=JSON.stringify(this.book);
    localStorage.setItem("book",temp);
    temp=JSON.stringify(this.group);
    localStorage.setItem('group',temp);
}

mainBookFiller();

/***************************************************************************/


/**************************************DOM*****************************************/

document.querySelectorAll(".book-det-inp").forEach((d) => {
  const inp = d.querySelector("input");
  inp.addEventListener("input",()=>{
    d.querySelector(".placeholder-text").classList.add("placeholder-text-up");
    d.querySelector('.inp-error').textContent="";
  })

  if (inp.value.length === 0) {
    d.querySelector(".placeholder-text").classList.toggle(
      "placeholder-text-up"
    );
  } else {
    d.querySelector(".placeholder-text").classList.add("placeholder-text-up");
  }

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

document.querySelector('#add-book-btn').addEventListener("click",()=>{
    upBk_Flag=false;
    document.querySelector('.add-book-cont button').textContent="Add Book";
    addBookToggler();
});

document.querySelector('.add-book-cont .close-icon-cont img').addEventListener("click",addBookToggler);

document.querySelector('.opacity-cont').addEventListener("click",()=>{
    document.querySelector(".opacity-cont").classList.remove('opacity-rem-bk-cont');
    document.querySelector('.add-book-cont').classList.add('none');
    document.querySelector('.add-collection-cont').classList.add('none');
    document.querySelector('header').style.pointerEvents='unset';
});

document.querySelector('.add-collection-cont .close-icon-cont img').addEventListener("click",()=>{
    document.querySelector(".opacity-cont").classList.remove('opacity-rem-bk-cont');
    document.querySelector('.add-book-cont').classList.add('none');
    document.querySelector('.add-collection-cont').classList.add('none');
    document.querySelector('header').style.pointerEvents='unset';
});

pg_num_inp_cont[0].querySelector('input').addEventListener("input",()=>{
    if(pg_num_inp_cont[1].querySelector('input').value.length===0){
        pg_num_inp_cont[0].querySelector('input').value="";
        pg_num_inp_cont[0].querySelector('.inp-error').textContent="Please Fill total Pages";
    }
})



document.querySelector('.add-book-cont button').addEventListener("click",submitTrigger);

document.querySelector('.new-collection-create img').addEventListener("click",()=>{
    if(document.querySelector(".new-collection-create input").value.trim().length===0) return;
    addNewCollection();
})

function bookCardEventListener(card,book){
    const mainCont=document.querySelector(".main-books-cont");
    card.querySelector("#book-del-btn").addEventListener("click",()=>{
        mainCont.removeChild(card);
        library.remBook(book);
    });

    card.querySelector("#book-edit").addEventListener("click",()=>{
        upBk_Flag=true;
        oldBookCard=card;
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
    });

    card.querySelector('button').addEventListener("click",()=>{
        if(card.querySelector('button').textContent==='Completed'){
            card.querySelector('button').textContent='Not Completed';
            library.bookCardUpdater(book,false,'comp_flag');
        }
        else{
            card.querySelector('button').textContent='Completed';
            library.bookCardUpdater(book,true,'comp_flag');
        }
    });

    card.querySelector('input').addEventListener("input",()=>{
        let tot_page=card.querySelector('.tot-page').textContent;
        let val=card.querySelector("input").value;
        if(+val<0){
            card.querySelector("input").value=0;
            val=card.querySelector("input").value;
        }
        if(+val>=+tot_page){
            card.querySelector("input").value=+tot_page;
            val=card.querySelector("input").value;
            card.querySelector("button").textContent="Completed";
            library.bookCardUpdater(book,true,'comp_flag');
        }
        else{
            card.querySelector("button").textContent="Not Completed";
            library.bookCardUpdater(book,false,'comp_flag');
        }
        library.bookCardUpdater(book,val,'comp_pages');
    })

    card.querySelector('#add-collection').addEventListener('click',()=>{
        currBook=book;
        document.querySelector('.opacity-cont').classList.toggle("opacity-rem-bk-cont");
        document.querySelector("header").style.pointerEvents="none";
        collectionCardFiller(book);
        document.querySelector(".add-collection-cont").classList.toggle("none");
        document.querySelectorAll(".available-collections-cont .collections-cont").forEach(d=>{
            collectionCheckboxListener(d,book);
        });
    })
}


document.querySelector('#collections-btn').addEventListener('click',()=>{
    document.querySelector('.main-books-cont').classList.add('none');
    document.querySelector('.collection-cont').classList.remove('none');
    collectionContainerFiller();
});

document.querySelector("#home-btn").addEventListener("click",()=>{
    document.querySelector('.main-books-cont').classList.remove('none');
    document.querySelector('.collection-cont').classList.add('none');
    mainBookFiller();
})

/*********************************************************************************/

/******************************************FUNCTIONS AND CALLBACKS************************************ */
function collectionContainerFiller(){
    document.querySelector('.collection-cont').innerHTML='';
    library['group'].forEach(d=>{
        let cnt=0;
        library['book'].forEach(t=>{
            if(t['group'].filter((temp)=>{
                if(temp===d) return true;
            }).length!==0) cnt++;
        });
        let element=document.createElement('div');
        element.innerHTML=`<h1 class="collection-name">${d}</h1>
        <div class="books-cnt"><span>${cnt}</span>&nbsp;<span>books</span></div>
        <div class="collection-icons-cnt">
            <img src="./assets/trash_full.svg" alt="">
        </div>`;
        element.classList.add('collection-card');
        document.querySelector('.collection-cont').appendChild(element);
        console.log(element);
        collectionCardEventListener(element,d);
    });
}

function collectionCardEventListener(element,group){
    let toggler=0;
    element.querySelector('img').addEventListener("click",()=>{
        library.delGroup(group);
        toggler=1;
        document.querySelector('.collection-cont').removeChild(element);
    });

    element.addEventListener("click",()=>{
        if(toggler===1) return;
        console.log("Emtering hereee");
        let arr=[];
        library['book'].forEach(d=>{
            d['group'].forEach(t=>{
                if(t===group){
                    arr.push(d);
                    return;
                }
            });
        });
        document.querySelector('.main-books-cont').innerHTML=` <div class="close-icon-cont">
        <img src="./assets/close_big.svg" class="add-book-close-icon" alt="">
        </div>`;
        document.querySelector('.main-books-cont .close-icon-cont img').addEventListener("click",()=>{
            document.querySelector('.main-books-cont').classList.add('none');
            document.querySelector('.collection-cont').classList.remove('none');
        });
        arr.forEach(d=>{
            bookFiller(d);
        });
        document.querySelector('.main-books-cont').classList.remove('none');
        document.querySelector('.collection-cont').classList.add('none');
    })
}

function addBookToggler(){
    document.querySelector('.opacity-cont').classList.toggle("opacity-rem-bk-cont");
    document.querySelector('.add-book-cont').classList.toggle('none');
}

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
    const newBook=new bookCreator(bkName,AuthName,comPages,totPages,comFlag,[]);
    
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

function bookReplacer(book){
    const element=document.createElement("div");
    element.classList.add("book-card");
    element.innerHTML+=` <h1 class="book-name">${book['name']}</h1>
    <h2 class="authour-name">${book['authour']}</h2>
    <div class="page-cnt"><input type="number" value="${book['comp_pages']}">/&nbsp;<span class="tot-page">${book["tot_pages"]}</span></div>
    <button class="book-status-btn">${(book['comp_flag'])?"Completed":"Not Completed"}</button>
    <div class="book-icons-cnt">
        <img src="./assets/folder_plus.svg" id="add-collection" alt="">
        <img src="./assets/edit.svg" id="book-edit" alt="">
        <img src="./assets/trash_full.svg" id="book-del-btn" alt="">
    </div>`;
    console.log(oldBookCard);
    document.querySelector(".main-books-cont").replaceChild(element,oldBookCard);
    bookCardEventListener(element,book);
}

function bookFiller(book){
    const element=document.createElement("div");
    element.classList.add("book-card");
    element.innerHTML+=` <h1 class="book-name">${book['name']}</h1>
    <h2 class="authour-name">${book['authour']}</h2>
    <div class="page-cnt"><input type="number" value="${book['comp_pages']}">/&nbsp;<span class="tot-page">${book["tot_pages"]}</span></div>
    <button class="book-status-btn">${(book['comp_flag'])?"Completed":"Not Completed"}</button>
    <div class="book-icons-cnt">
        <img src="./assets/folder_plus.svg" id="add-collection" alt="">
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

function addNewCollection(){
    let val=document.querySelector('.new-collection-create input').value.trim();
    console.log(library);
    if(library['group'].filter((temp)=>{
        if(temp===val) return true;
    }).length!==0) return;
    library['group'].push(val);
    let element=document.createElement('div');
    element.classList.add('collections-cont');
    element.innerHTML=`
    <input type="checkbox" name="test" id="" value="${val}">
    <span>${val}</span>`;
    document.querySelector('.available-collections-cont').appendChild(element);
    collectionCheckboxListener(element);
    let temp=JSON.stringify(library['group']);
    localStorage.setItem("group",temp);
}

function collectionCardFiller(book){
    let temp="";
    library['group'].forEach(d=>{
        let arr=book['group'].filter((temp)=>{
             if(temp===d){
                 return true;
             }
        });
       if(arr.length!==0){
            temp+=`<div class="collections-cont">
            <input type="checkbox" value="${d}" checked>
            <span>${d}</span>
        </div>`
        }
        else{
            temp+=`<div class="collections-cont">
            <input type="checkbox" value="${d}">
            <span>${d}</span>
        </div>`;
        }
    });
    document.querySelector(".available-collections-cont").innerHTML=temp;
}

function collectionCheckboxListener(tag){
    let i=library['book'].findIndex((t)=>{
        return currBook=== t;
    });
    let book=library['book'][i];
    tag.querySelector("input").addEventListener("click",()=>{
        console.log("EnteringHere");
        if(tag.querySelector("input").checked===true){
            book['group'].push(tag.querySelector("input").value);
        }
        else{
            book['group']=book['group'].filter(d=>{
                if(d!==tag.querySelector('input').value) return true;
            });
        }
        let temp=JSON.stringify(library['book']);
        localStorage.setItem('book',temp);
    })
}
/******************************************* */







