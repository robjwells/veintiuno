var BJ=(function(){var y,v,E=0,m=0,f,s,D,z,e,x,A,h,o=function(H,F){var G=H.getAttribute("class");if(G!==null){H.setAttribute("class",(G+" "+F))}else{H.setAttribute("class",F)}},t=function(J,H){var M="",G=J.getAttribute("class"),F=G.split(" "),L=F.length,K=F.indexOf(H),I;F.splice(K,1);if(L===0){J.removeAttribute("class")}else{for(I=0;I<F.length;I+=1){M+=F[I];if(I!==F.length-1){M+=" "}}J.setAttribute("class",M)}},p=function(F){return document.getElementById(F)},u=function(){return[["Ace",2,3,4,5,6,7,8,9,10,"Jack","Queen","King"],["Ace",2,3,4,5,6,7,8,9,10,"Jack","Queen","King"],["Ace",2,3,4,5,6,7,8,9,10,"Jack","Queen","King"],["Ace",2,3,4,5,6,7,8,9,10,"Jack","Queen","King"]]},k=function(){return["Clubs","Diamonds","Hearts","Spades"]},r=k(),c=u(),a=0,g=function(){var F=Array.prototype.concat(c[0],c[1],c[2],c[3]);if(a===6||F.length<20){c=u();r=k();a=0}else{a+=1}},C=function(H){var G=H.getAttribute("class").split(" "),I="bounceInDown",F="bounceOutUp";if(G.indexOf(I)!==-1){t(H,I)}if(G.indexOf(F)!==-1){t(H,F)}if(G.indexOf("hide")!==-1){o(H,I);t(H,"hide")}else{o(H,F);setTimeout(o,500,H,"hide")}},l=function(G){var H=p("status"),F=p("status-text");F.innerHTML=G;t(H,"hide");setTimeout(o,1250,H,"hide")},b=function(Q,J,N){var O=function(S){return document.createElement(S)},F=p(Q),G=F.getElementsByClassName("card"),P=O("div"),R=O("div"),M=O("div"),I=O("div"),H=O("div"),K=J.getNumber(),L="wayoff card "+J.getSuit().toLowerCase();o(R,"front");o(M,"back");o(I,"num tl");o(H,"num br");if(N!=="hidden"){if(typeof K!=="string"){I.innerHTML=H.innerHTML=K}else{I.innerHTML=H.innerHTML=K[0]}}else{I.innerHTML=H.innerHTML="X"}if(G.length%2===0){L+=" tilt-left"}else{L+=" tilt-right"}if(N==="hidden"){P.setAttribute("id","hole");L+=" flipped"}o(P,L);R.appendChild(I);R.appendChild(H);P.appendChild(R);P.appendChild(M);F.appendChild(P);setTimeout(t,20,P,"wayoff")},q=function(){b("player",y.getCards()[0],"visible");b("player",y.getCards()[1],"visible");b("dealer",v.getCards()[0],"visible");b("dealer",v.getCards()[1],"hidden")},i=function(){var I=v.getCards()[1],H=I.getNumber(),F=p("hole"),G=F.getElementsByClassName("num");if(typeof H!=="string"){G[0].innerHTML=G[1].innerHTML=H}else{G[0].innerHTML=G[1].innerHTML=H[0]}t(F,"flipped")},d=function(){var G=p("about"),F=p("about-dismiss"),I=p("about-button"),H=function(){C(G);F.removeEventListener("click",H,false);I.removeEventListener("click",H,false);I.addEventListener("click",d,false)};C(G);I.removeEventListener("click",d,false);I.addEventListener("click",H,false);F.addEventListener("click",H,false)},j=function(F,I){var H=F,G=I;this.getSuit=function(){return H};this.getNumber=function(){return G};this.getValue=function(){if(typeof G==="string"){if(G==="Ace"){return 11}return 10}return G}},B=function(G,H){var F=c[G][H];c[G].splice(H,1);return F},n=function(){var G,J,I,H,F;for(F=0;F<r.length;F+=1){if(c[F].length===0){r.splice(F,1);c.splice(F,1)}}G=Math.floor(Math.random()*r.length);J=Math.floor(Math.random()*c[G].length);I=r[G];H=B(G,J);return(new j(I,H))},w=function(){var F=[];F.push(n());F.push(n());this.getCards=function(){return F};this.hit=function(H){var G;F.push(n());G=F[(F.length-1)];if(H.type==="click"){H="player"}b(H,G,"visible");if(H==="player"&&y.getScore()>21){setTimeout(l,1250,'You<span class="apost">\u2019</span>re bust');return setTimeout(e,2500)}};this.printCards=function(){var I=F[0].getNumber(),H="",G;if(I===8||I==="Ace"){H+="an "}else{H+="a "}for(G=0;G<F.length;G+=1){H+=(F[G].getNumber()+" of "+F[G].getSuit());if(G!==F.length-1){if(G===F.length-2){if(F[G+1].getNumber()===8||F[G+1].getNumber()==="Ace"){H+=" and an "}else{H+=" and a "}}else{H+=", "}}else{H+="."}}return H};this.getScore=function(){var H,L=F.length,J=0,K=0,G=function I(){if(K<=21||J<=0){return}K-=10;J-=1;I()};for(H=0;H<L;H+=1){if(F[H].getNumber()==="Ace"){J+=1}K+=F[H].getValue()}G();return K}};f=function(){var F=p("start");F.removeEventListener("click",f,false);C(F);setTimeout(s,250)};s=function(){var K=p("dealer"),I=p("player"),H=Array.prototype.slice.call(K.getElementsByClassName("card")),F=Array.prototype.slice.call(I.getElementsByClassName("card")),J=H.concat(F),G;for(G=0;G<J.length;G+=1){o(J[G],"wayoff")}setTimeout(function(){K.innerHTML="";I.innerHTML="";D()},1000)};D=function(){y=null;v=null;g();y=new w();v=new w();q();p("hit").addEventListener("click",y.hit,false);p("stand").addEventListener("click",e,false);z()};z=function(){var G=p("hit"),F=p("stand");if(y.getScore()===21||v.getScore()===21){if(v.getScore()===21){setTimeout(i,1000)}G.removeEventListener("click",y.hit,false);F.removeEventListener("click",e,false);l("Blackjack!");setTimeout(A,2000,"blackjack")}};e=function(){var G=p("hit"),F=p("stand");G.removeEventListener("click",y.hit,false);F.removeEventListener("click",e,false);setTimeout(l,1000,'Dealer<span class="apost">\u2019</span>s turn');i();return setTimeout(x,3500)};x=function(){var K=v.getScore(),J=v.getCards(),I,H,G=0;I=function(L){if(L.getNumber()==="Ace"){G+=1}};H=function F(){var L;if(K<17||(K===17&&G>0)){v.hit("dealer");L=J[(J.length-1)];I(L);K+=L.getValue();return setTimeout(F,1500)}if(K>21&&G>=1){K-=10;G-=1;return setTimeout(F,1500)}if((K===17&&G<1)||(K>17&&K<=21)||(K>21&&G<1)){l("Dealer is done");setTimeout(A,1500)}};I(J[0]);I(J[1]);H()};A=function(P){var H=y.getScore(),N=v.getScore(),G="You have "+H+" with "+y.printCards(),I="The dealer has "+N+" with "+v.printCards(),Q=p("playercards"),L=p("dealercards"),J=p("results"),M=p("winner"),K=p("again"),O=p("p-count"),F=p("d-count");K.addEventListener("click",h,false);if(P){if(H===21&&N===21){M.innerHTML="You both have blackjack!";G="What are the chances!? Well, about one in 565.";I="If my maths is off, let me know @robjwells."}else{if(H===21){G="You have blackjack with "+y.printCards();M.innerHTML="You win!";E+=1;O.innerHTML="Player: "+E}else{if(N===21){I="The dealer has blackjack with "+v.printCards();M.innerHTML="The dealer won";m+=1;F.innerHTML="Dealer: "+m}}}Q.innerHTML=G;L.innerHTML=I;return C(J)}if(H<=21){if(N<=21){if(H>N){M.innerHTML="You win!";E+=1;O.innerHTML="Player: "+E}else{if(N>H){M.innerHTML="The dealer won";m+=1;F.innerHTML="Dealer: "+m}else{M.innerHTML="You tied"}}}else{M.innerHTML="You win!";I+=" The dealer is bust.";E+=1;O.innerHTML="Player: "+E}}else{if(N>21){M.innerHTML='You<span class="apost">\u2019re</span> both bust'}else{G+=' You<span class="apost">\u2019re</span> bust.';M.innerHTML="The dealer won";m+=1;F.innerHTML="Dealer: "+m}}Q.innerHTML=G;L.innerHTML=I;C(J)};h=function(){var F=p("results"),G=p("again");G.removeEventListener("click",h,false);C(F);s()};window.addEventListener("load",function(){var F=p("play"),G=p("about-button");F.addEventListener("click",f,false);G.addEventListener("click",d,false);document.addEventListener("touchstart",function(){},false)});window.addEventListener("resize",function(){var F,J,I,G=["h1","h2"],H=["btn","num","o-text"];for(F=0;F<G.length;F+=1){I=document.getElementsByTagName(G[F]);for(J=0;J<I.length;J+=1){I[J].style.zIndex=I[J].style.zIndex}}for(F=0;F<H.length;F+=1){I=document.getElementsByClassName(H[F]);for(J=0;J<I.length;J+=1){I[J].style.zIndex=I[J].style.zIndex}}});return(function(){var G=Object.create(null),F="A little blackjack game made from HTML, CSS, SVG and JavaScript by\n@robjwells. Thanks go to the lovely people at www.codecademy.com,\nwho got me started. You should check them out!\n\nI've written a bit about it on my blog, if you're interested:\nhttp://robjwells.com/post/43984440715/blackjack";G.by="@robjwells";G.invokeMe=function(){return F};Object.freeze(G);return G}())}());