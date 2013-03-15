###Stephen Talking

is a lightweight (5kb) javascript speech generator - there also is a [jQuery version](https://github.com/chaaad/Stephan-Talking-JQuery-Plugin)

- this is based on [Tiny Speech Synth in JavaScript](http://heckmeck.de/demoscene/tiny-speech-synth-js/)

- that was based on [Tiny Speech Synth (C++)](http://www.pouet.net/prod.php?which=50530/)

there is no attempt to apply any complex text-to-speech rules, just see the letters, say the letters

in fact, only phonemes are stored and they are very basic, great simple design using formants by 'stan 1901'

this code is free to use for whatever - tested and works on web FF, Webkit - wont work on IE 9, maybe IE 10 will


see [demo](http://alkemis.com/st/)

HTML:

include this...

`<script src="st.min.js"></script>`

JS:

`$ST.speak("wats up dok");`




more info in the file:
/txt/st_readme.txt
