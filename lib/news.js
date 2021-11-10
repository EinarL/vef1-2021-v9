/** Slóð á frétta vefþjónustu */
const NEWS_API = 'https://vef2-2021-ruv-rss-json-proxy.herokuapp.com/';

/**
 * Hlutur sem heldur utan um in-memory „cache“ af gögnum í minni á client (í vafra).
 * Nýtir það að þegar forrit er keyrt mun `fetchNews` fallið *alltaf* keyra þar sem `cache` er í
 * scope, og það verður alltaf sami hluturinn. Við getum því bætt við niðurstöðum í hlutinn með
 * vel þekktum „lykli“ (cache key), við næstu köll getum við athugað hvort hlutur innihaldi þennan
 * lykil og skilað þá þeirri niðurstöðu í stað þess að gera sama kall aftur.
 */
const cache = {};

const indexFetch = [];

const DELAY_PROBABILITY = 0.5;
const ERROR_PROBABILITY = 0.1;

/**
 * Sækir fréttir frá vefþjónustu. Geymir í in-memory cache gögn eftir `id`.
 * @param {string} [id=''] ID á fréttaflokk til að sækja, sjálgefið tómi (grunn) flokkurinn
 * @returns {Promise<Array<object> | null>} Promise sem verður uppfyllt með fylki af fréttum.
 *           Skilar `null` ef villa kom upp við að sækja gögn.
 */
export async function fetchNews(id = '') {
  // TODO útfæra
  console.log("fetching news from: " + id);

  let newsLink = NEWS_API + id;
  console.log(newsLink);
  if(id === ""){ // vill sækja gögn sem þarf fyrir forsíðu
    console.log("indexFench length: " + indexFetch.length);
    if(indexFetch.length !== 0){ // ef það eru gögn til að sækja
      console.log(cache[indexFetch[0]])

    }
    try {
      let res = await fetch(newsLink);
      let resjson = await res.json();
      console.log("resjson: " + resjson);
      let key;
      for(let i = 0; i < resjson.length; i++){
        key = resjson[i].id;
        if(!(key in cache)){ // ef key er ekki í cache
          cache[key] = resjson[i];
          indexFetch.push(key);
          console.log("ADDING");
        }
      }
      console.log("allar is in cache: " + ("allar" in cache));
      let isError = Math.random(); // skilar random tölu frá 0 til 1
      console.log("isError: " + isError);
      if(isError > ERROR_PROBABILITY){
        return resjson;
      }else{
        return null;
      }
    } catch (error) {
        console.log(error);
        return null;
    }
  }else{
    try {
      let res = await fetch(newsLink);
      let resjson = await res.json();
      console.log("resjson length: " + resjson.length);
      let key;
      for(let i = 0; i < resjson.length; i++){
        key = resjson[i].id;
        if(!(key in cache)){ // ef key er ekki í cache
          cache[key] = resjson[i];
          indexFetch[i] = key;
        }
      }
      console.log("allar is in cache: " + ("allar" in cache));
      return resjson;
    } catch (error) {
        console.log(error);
        return null;
    }
  }


    /*
    let key;
    for(let i = 0; i < out.length; i++){
      key = out[i].id;
      if(!(key in cache)){ // ef key er ekki í cache
        //Object.assign(cache, {key: })
      }
    }
    */
}
