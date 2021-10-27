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
    addBookToggler();
})
