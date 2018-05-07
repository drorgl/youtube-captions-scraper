# Youtube Captions scraper

> Fetch youtube user submitted or fallback to auto-generated captions
(Just a Fix to [youtube-captions-scraper](https://github.com/algolia/youtube-captions-scraper.git))

## Installation

* `> npm install -S youtube-captions-scraper-fix` OR
* `> yarn add youtube-captions-scraper-fix`

## Usage

```js
// ES6 / TypeScript
import { getSubtitles } from 'youtube-captions-scraper-fix';

getSubtitles({
  videoID: 'XXXXX', // youtube video id
  lang: 'fr' // default: `en`
}).then(captions => {
  console.log(captions);
});

// ES5
var getSubtitles = require('youtube-captions-scraper-fix').getSubtitles;

getSubtitles({
  videoID: 'XXXXX', // youtube video id
  lang: 'fr' // default: `en`
}).then(function(captions) {
  console.log(captions);
});
```

Captions will be an array of object of this format:

```flow js
{
  "start": Number,
  "dur": Number,
  "text": String
}
```
