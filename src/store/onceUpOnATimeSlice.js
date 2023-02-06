import { createSlice } from '@reduxjs/toolkit';
import { html } from 'd3';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

const { readDoc, its } = winkNLP(model);

const fairytaleDOM = await html('./data/onceUpOnATime/englishFairytales.html');
const elements = [...fairytaleDOM.body.children];

const fairytaleTitles = Array.prototype.slice.call(fairytaleDOM.querySelectorAll('.toc > a'), 2, -2)
  .map(a => ({
    name: a.textContent.trim(),
    href: a.getAttribute('href').substring(1, Infinity),
  }));

const invalid = {
  '\'s': true,
  o: true,
  'mr.': true,
};

function Node(name, children = []) {
  this.name = name;
  this.children = children;
}

const clusterRoot = new Node('Fairy Tales');
const frequencyAll = {};
const posAll = {};
const wordsAll = { punctuation: 0, stopWord: 0, word: 0 };

const fairytales = { ALL: {} };

const toNodes = (frequency, size) => Object.entries(frequency)
  .sort((a, b) => b[1] - a[1])
  .map(x => ({ name: x[0], value: x[1] }))
  .slice(0, size);

const getStatistic = (pos, words, frequency) => {
  words.word = words.word - words.punctuation - words.stopWord;
  const root = new Node('POS');

  Object.entries(pos).forEach(([key, items]) => {
    const map = {};
    items.forEach(item => {
      map[item] = (map[item] || 0) + 1;
    });
    root.children.push(new Node(key, toNodes(map, 3)));
  });
  const token = Object.entries(words);
  token.sum = token[0][1] + token[1][1] + token[2][1];
  return {
    posRoot: root,
    token,
    frequency: toNodes(frequency, 31),
  };
};

fairytaleTitles.forEach(({ name, href }) => {
  let i = 3 + elements.findIndex(el => el.firstElementChild && el.firstElementChild.id === href);
  const words = { punctuation: 0, stopWord: 0, word: 0 };
  const pos = {};
  const frequency = {};

  while (!elements[i].firstElementChild || elements[i].firstElementChild.tagName !== 'BR') {
    const { textContent } = elements[i++];
    const doc = readDoc(textContent.trim().replace(/\s+/g, ' ').toLowerCase());

    doc.tokens().each(token => {
      const word = token.out(its.value);
      const p = token.out(its.pos);

      pos[p] = pos[p] || [];
      pos[p].push(word);

      words.word++;
      wordsAll.word++;

      const type = token.out(its.type);
      if (type === 'punctuation') {
        words.punctuation++;
        wordsAll.punctuation++;
      }
      if (token.out(its.stopWordFlag)) {
        words.stopWord++;
        wordsAll.stopWord++;
        return;
      }
      if (type === 'punctuation' || invalid[word]) {
        return;
      }
      frequency[word] = (frequency[word] || 0) + 1;
      frequencyAll[word] = (frequencyAll[word] || 0) + 1;
    });
  }
  fairytales[name] = getStatistic(pos, words, frequency);

  fairytales[name].posRoot.children.forEach(node => {
    posAll[node.name] = posAll[node.name] || [];
    posAll[node.name].push(...node.children.map(x => x.name));
  });

  const node = new Node(name, fairytales[name].frequency.slice(0, 5));
  clusterRoot.children.push(node);
});

fairytales.ALL = getStatistic(posAll, wordsAll, frequencyAll);

const onceUpOnATimeSlice = createSlice({
  name: 'onceUpOnATime',
  initialState: {
    fairytales,
    clusterRoot,
    selected: 'ALL',
  },
  reducers: {
    setSelectedFairytales: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setSelectedFairytales } = onceUpOnATimeSlice.actions;

export default onceUpOnATimeSlice.reducer;
