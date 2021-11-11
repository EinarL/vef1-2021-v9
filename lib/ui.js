import { delay } from './news.js';

/**
 * Föll sem sjá um að kalla í `fetchNews` og birta viðmót:
 * - Loading state meðan gögn eru sótt
 * - Villu state ef villa kemur upp við að sækja gögn
 * - Birta gögnin ef allt OK
 * Fyrir gögnin eru líka búnir til takkar sem leyfa að fara milli forsíðu og
 * flokks *án þess* að nota sjálfgefna <a href> virkni—við tökum yfir og sjáum
 * um sjálf með History API.
 */

const DELAY_PROBABILITY = 0.5;
const ERROR_PROBABILITY = 0.1;

/**
 * Sækir gögn fyrir flokk og birtir í DOM.
 * @param {string} id ID á category sem við erum að sækja
 * @param {HTMLElement} parent Element sem setja á flokkinn í
 * @param {HTMLELement | null} [link=null] Linkur sem á að setja eftir fréttum
 * @param {number} [limit=Infinity] Hámarks fjöldi frétta til að sýna
 */
export async function fetchAndRenderCategory(id, parent, link = null) {
  // Búum til <section> sem heldur utan um flokkinn
  const section = document.createElement('section');
  section.classList.add('news');
  section.classList.add('newsList__item');
  parent.classList.add('newsList__list');
  parent.appendChild(section);

  if (window.location.search !== '') {
    // ef er ekki á forsíðu
    parent.classList.add('news__larger');
  }

  const fetchingText = document.createElement('p');
  fetchingText.innerText = 'Sæki gögn...';
  fetchingText.classList.add('margin-text');
  section.appendChild(fetchingText);

  // sækja flokka
  const res = await fetch(link);
  let json = await res.json();

  const isDelay = Math.random();
  if (isDelay <= DELAY_PROBABILITY) {
    await delay();
  }

  section.removeChild(fetchingText);
  const isError = Math.random(); // skilar random tölu frá 0 til 1
  if (isError <= ERROR_PROBABILITY) {
    json = null;
  }

  if (json === null) {
    // ef villa kemur upp
    const err = document.createElement('p');
    err.innerText = 'Villa kom upp';
    err.classList.add('margin-text');
    section.appendChild(err);
  } else {
    // búa til title
    const titlee = document.createElement('strong');
    titlee.innerText = json.title;
    titlee.classList.add('news__title');
    section.appendChild(titlee);

    // búa til div í kringum items
    const div = document.createElement('div');
    div.classList.add('news__list');
    section.appendChild(div);

    let p;
    let a;
    for (let i = 0; i < json.items.length; i++) {
      a = document.createElement('a');
      a.href = json.items[i].link;
      div.appendChild(a);

      p = document.createElement('p');
      p.innerText = json.items[i].title;
      p.classList.add('news__item');
      a.appendChild(p);
    }

    // búa til 'Allar fréttir' takka
    const btn = document.createElement('a');
    btn.innerText = 'Allar fréttir';
    btn.href = `/?category=${id}`;
    if (window.location.search !== '') {
      // ef er ekki á forsíðu
      btn.innerText = 'Til baka';
      btn.href = '/';
    }
    btn.classList.add('news__link');

    div.appendChild(btn);
  }
}

/**
 * Sækir grunnlista af fréttum, síðan hvern flokk fyrir sig og birtir nýjustu
 * N fréttir úr þeim flokk með `fetchAndRenderCategory()`
 * @param {HTMLElement} container Element sem mun innihalda allar fréttir
 * @param {number} newsItemLimit Hámark fjöldi frétta sem á að birta í yfirliti
 */
export async function fetchAndRenderLists(container) {
  let path;
  if (container === 'Allar fréttir') {
    path = 'allar';
  } else if (container === 'Erlendar fréttir') {
    path = 'erlent';
  } else if (container === 'Íþróttir') {
    path = 'ithrottir';
  } else {
    path = container.toLowerCase();
  }

  const fetchLink = `https://vef2-2021-ruv-rss-json-proxy.herokuapp.com/${path}`;
  const parent = document.querySelector('.layout__main');
  fetchAndRenderCategory(path, parent, fetchLink);
}
