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










// console.log("Welcome to Saviru's portfolio !")

// title = "Hi there, I'm Saviru Kashmira Atapattu. Welcome to my portfolio !           ";
// position = 0;
// function scrolltitle() {
//     document.title = title.substring(position, title.length) + title.substring(0, position); 
//     position++;
//     if (position > title.length) position = 0;
//     titleScroll = window.setTimeout(scrolltitle,270);
// }
// scrolltitle();



let cursor = document.getElementById('cursor');
window.onmousemove = function(e) {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
}




//to top button
// const toTop = document.querySelector(".to-top");

// window.addEventListener("scroll", checkHeight);

// function checkHeight() {
//   if(window.scrollY > 200) {
//     toTop.style.display = "flex";
//   } else {
//     toTop.style.display = "none";
//     var currentnv = document.getElementsByClassName("active");
//     currentnv[0].className = currentnv[0].className.replace(" active", "");
//     var homenv = document.getElementById("hmnav");
//     homenv.className += " active";
//   }
// }

//word effect
// const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// let interval = null;

// document.querySelector(".ranlets").onmouseover = eventlet => {  
//   let iteration = 0;
  
//   clearInterval(interval);
  
//   interval = setInterval(() => {
//     eventlet.target.innerText = eventlet.target.innerText
//       .split("")
//       .map((letter, index) => {
//         if(index < iteration) {
//           return eventlet.target.dataset.value[index];
//         }
      
//         return letters[Math.floor(Math.random() * 26)]
//       })
//       .join("");
    
//     if(iteration >= eventlet.target.dataset.value.length){ 
//       clearInterval(interval);
//     }
    
//     iteration += 1 / 2;
//   }, 30);
// }

//Context menu

// const contextMenu = document.getElementById("context-menu");
// const scope = document.querySelector("body");

// const normalizePozition = (mouseX, mouseY) => {
//   let {
//     left: scopeOffsetX,
//     top: scopeOffsetY,
//   } = scope.getBoundingClientRect();
  
//   scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX;
//   scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY;
 
//   const scopeX = mouseX - scopeOffsetX;
//   const scopeY = mouseY - scopeOffsetY;

//   const outOfBoundsOnX =
//     scopeX + contextMenu.clientWidth > scope.clientWidth;

//   const outOfBoundsOnY =
//     scopeY + contextMenu.clientHeight > scope.clientHeight;

//   let normalizedX = mouseX;
//   let normalizedY = mouseY;

//   if (outOfBoundsOnX) {
//     normalizedX =
//       scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
//   }

//   if (outOfBoundsOnY) {
//     normalizedY =
//       scopeOffsetY + scope.clientHeight - contextMenu.clientHeight;
//   }

//   return { normalizedX, normalizedY };
// };

// const donemsg = document.querySelector(".donect")

// scope.addEventListener("contextmenu", (ctxm) => {
//   ctxm.preventDefault();
//   donemsg.style.display = "none";

//   const { clientX: mouseX, clientY: mouseY } = ctxm;

//   const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY);

//   contextMenu.classList.remove("visible");

//   contextMenu.style.top = `${normalizedY}px`;
//   contextMenu.style.left = `${normalizedX}px`;

//   setTimeout(() => {
//     contextMenu.classList.add("visible");
//   });
// });

// scope.addEventListener("click", (ct) => {
//   if (ct.target.offsetParent != contextMenu) {
//     contextMenu.classList.remove("visible");
//   }
// });

// window.addEventListener("scroll", (ct) => {
//   if (ct.target.offsetParent != contextMenu) {
//     contextMenu.classList.remove("visible");
//   }
// });

// const copylink = document.querySelector('#urlcopy')

// copylink.addEventListener("click", () => {
//   navigator.clipboard.writeText(window.location.href);
//   donemsg.style.display = "inline";

//   const copytime = setTimeout(displaycopy, 1500)

//   function displaycopy() {
//     donemsg.style.display = "none";
//   }
// });

// //contact me section

// function sendMessage() {
//   (function() {
//     emailjs.init("CFVlg1m3TvKf2PC9Q");
//   })();

//   var serviceID = "sv2006Saviru_PF.2024";
//   var templateID = "templ2006Saviru_PF.2024";

//   var params = {
//     sendername:document.querySelector("#name").value,
//     sendermail:document.querySelector("#email").value,
//     subject:document.querySelector("#subject").value,
//     message:document.querySelector("#message").value
//   };

//   emailjs.send(serviceID, templateID, params)
//   .then( res => {
//     toastNotify("Done !", "Your message has been sent.", "bx-message-square-check", "#0060af");
//   })
//   .catch( jserr => {
//     toastNotify("Error !", "An error occured. Please try again.", "bx-message-square-error", "#af0000")
//   });
// }

// //contact input animations
// let cmlabel = document.querySelectorAll('.contlabel');

// for(var ctmi=0; ctmi<cmlabel.length; ctmi++) {
//   cmlabel[ctmi].innerHTML = cmlabel[ctmi].innerText.split('').map((cmlet, cml)=>`<span class="inputword" style="transition-delay: ${cml*30}ms;filter: hue-rotate(${cml*25}deg)";>${cmlet}</span>`).join('');
// }

// //notification

// const toast = document.querySelector(".toastnt");
// const ntclose = document.querySelector(".ntclose");
// const ntprog = document.querySelector(".ntprog");
// var alttil = document.getElementById("alttil");
// var altmsg = document.getElementById("altmsg");
// var alticon = document.querySelector(".ntcheck");
// const ntindi = document.querySelector(".toastnt")

// function toastNotify(alt, alm, alttype, altclr) {
//   alttil.innerHTML = alt;
//   altmsg.innerHTML = alm;

//   ntindi.style.setProperty("--ntclrind", altclr)

//   alticon.classList.add(alttype);
//   alticon.style.color = altclr;

//   toast.classList.add("ntact");
//   ntprog.classList.add("ntact");

//   setTimeout(() => {
//     alticon.classList.remove(alttype)
//     toast.classList.remove("ntact");
//   }, 5000);

//   setTimeout(() => {
//     ntprog.classList.remove("ntact");
//   }, 5300)
// }

// ntclose.addEventListener("click", () => {
//   alticon.classList.remove(alttype)
//   toast.classList.remove("ntact");

//   setTimeout(() => {
//     ntprog.classList.remove("ntact");
//   }, 300)
// });
