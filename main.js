// TODO importa því sem nota þarf

import { fetchNews } from "./lib/news.js";
import { fetchAndRenderLists } from "./lib/ui.js";

/** Fjöldi frétta til að birta á forsíðu */
const CATEGORY_ITEMS_ON_FRONTPAGE = 5;

/** Vísun í <main> sem geymir allt efnið og við búum til element inn í */
const main = document.querySelector('main');

/**
 * Athugar útfrá url (`window.location`) hvað skal birta:
 * - `/` birtir yfirlit
 * - `/?category=X` birtir yfirlit fyrir flokk `X`
 */
async function route() {
  // Athugum hvort það sé verið að biðja um category í URL, t.d.
  // /?category=menning

  // Ef svo er, birtum fréttir fyrir þann flokk
  console.log("location:: " + window.location.search);
  let fetched;
  // Annars birtum við „forsíðu“
  if(window.location.search === ""){ // ef á forsíðu
    console.log("location === /");
    fetched = await fetchNews("");

    console.log("er með: " + fetched[0].id);
    let len;
    if(fetched.length > 5){
      len = 5;
    }else{
      len = fetched.length;
    }

    for(let i = 0; i < len; i++){
      fetchAndRenderLists(fetched[i].id,fetched.length);
    }
  }else{
    let location = window.location.search.substr(10,window.location.search.length)
    console.log(location);
    fetched = await fetchNews(location);

    fetchAndRenderLists(fetched.title,1);
/*
    if(window.location.search === "?category=menning"){
      console.log("location menning");
      fetched = await fetchNews("menning");

      console.log("menning fetched er: " + fetched.title);

      fetchAndRenderLists(fetched.title,1);

    }
    else{
      console.log("þú ert einhverstaðar þar sem þú átt ekki að vera!!!!");
    }
    */
  }



}

/**
 * Sér um að taka við `popstate` atburð sem gerist þegar ýtt er á back takka í
 * vafra. Sjáum þá um að birta réttan skjá.
 */
window.onpopstate = () => {
  // TODO útfæra
};

// Í fyrsta skipti sem vefur er opnaður birtum við það sem beðið er um út frá URL
route();
