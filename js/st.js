// ---------------------------------------------------------------------------
//
//    st.js -- Stephan Talking
//
//    Original code: stan_1901 (Andrey Stephanov)
//    http://pouet.net/prod.php?which=50530
//
//    JavaScript port: losso/code red (Alexander Grupe)
//    http://heckmeck.de/demoscene/tiny-speech-synth-js/
//
//    edit: C. Kwok 12/12
//    http://alkemis.com
//
// ---------------------------------------------------------------------------


$StepanTalking= {

	sample_resolution: 12000, //was 44100
	//trial and error tests concluded that 12000 was as low as it should go

	phonemes: {
		//orig caps: (removed) E - S - T - Z
		A: { f:[10,  55,  0], w:[ 10,  10,  0], dur:3, vol: 6, osc:0, plo:0 }, //NEW
		a: { f:[20,  35,  0], w:[ 10,  10,  0], dur:4, vol:12, osc:0, plo:0 }, //was f:[18, 30, 02] //dur 3->4 vol15->10
		b: { f:[ 4,   0,  0], w:[ 10,   0,  0], dur:1, vol: 1, osc:0, plo:0 }, //vol2->1
		c: { f:[ 35,  0,  0], w:[ 15,   0,  0], dur:4, vol: 2, osc:1, plo:0 }, //NEW //ch, eg rich chap
		d: { f:[ 4,  40, 80], w:[ 10,  10, 10], dur:1, vol: 2, osc:0, plo:0 },
		E: { f:[ 5,  56,  0], w:[ 10,  10,  0], dur:3, vol: 3, osc:0, plo:0 }, //copy of orig i
		e: { f:[14,  50,  0], w:[ 10,  10,  0], dur:3, vol:10, osc:0, plo:0 }, //vol 15->10
		f: { f:[ 8,  20, 34], w:[ 10,  10, 10], dur:3, vol: 3, osc:1, plo:0 }, //vol 4->3
		g: { f:[ 2,  10, 26], w:[ 15,   5,  2], dur:2, vol: 1, osc:0, plo:0 },
		h: { f:[22,  26, 32], w:[ 30,  10, 30], dur:1, vol:5, osc:1, plo:0 },
		//I cant be done as 1 sound - its somewhat like "a_E"
		I: {dur:3.5, arr:[
			{k:"a", dur:2}, //can overridde dur and vol
			{}, //pause (half space)1
			{k:"E", dur:1}
		]},
		i: { f:[ 5,  56,  0], w:[ 10,  10,  0], dur:2, vol: 2, osc:0, plo:0 }, //dur 3->2 vol3->2
		j: { f:[ 5,  56,  0], w:[ 10,  10,  0], dur:1, vol: 5, osc:0, plo:0 }, //vol3->5
		k: { f:[20,  80,  0], w:[ 10,  10,  0], dur:1, vol: 2, osc:1, plo:1 }, //vol3->2
		l: { f:[ 8,  20,  0], w:[ 10,  10,  0], dur:3, vol: 5, osc:0, plo:0 },
		m: { f:[ 4,  20,  0], w:[ 10,  10,  0], dur:3, vol: 2, osc:0, plo:0 }, 
		n: { f:[ 4,  40,  0], w:[ 10,  10,  0], dur:3, vol: 2, osc:0, plo:0 },
		O: { f:[12,  15,  0], w:[ 10,  10,  0], dur:3, vol: 6, osc:0, plo:0 }, //copy of orig o
		o: { f:[19,  33,  0], w:[ 10,  10,  0], dur:3, vol:12, osc:0, plo:0 }, //copy of a - combo with u vol15->12
		p: { f:[ 4,  10, 20], w:[  5,  10, 10], dur:1, vol: 2, osc:1, plo:1 },
		r: { f:[ 3,  10, 20], w:[ 30,   8,  1], dur:4, vol: 5, osc:0, plo:0 }, //vol3->5 //dur 3->4
		s: { f:[80, 110,  0], w:[ 80,  40,  0], dur:3, vol: 5, osc:1, plo:0 },
		t: { f:[ 4,  20, 40], w:[ 10,  20,  5], dur:1, vol: 3, osc:1, plo:1 },
		U: { f:[ 5,  14,  0], w:[ 10,  10,  0], dur:3, vol: 2, osc:0, plo:0 }, //copy of orig u vol3->2
		u: { f:[18,  30,  0], w:[ 10,  10,  0], dur:3, vol:12, osc:0, plo:0 }, //copy of orig a vol15->12
		v: { f:[ 2,  20,  0], w:[ 20,  10,  0], dur:3, vol: 3, osc:0, plo:0 },
		w: { f:[ 3,  14,  0], w:[ 10,  10,  0], dur:3, vol: 2, osc:0, plo:0 }, //vol 1->2
		y: { f:[ 5,  56,  0], w:[ 10,  10,  0], dur:3, vol: 4, osc:0, plo:0 }, //copy of j //dur 1->3 vol3->4
		z: { f:[ 5,  28, 80], w:[ 10,   5, 10], dur:4, vol: 5, osc:0, plo:0 }  //dur 3->4 //vol 3->5
	},


	//constants
	PI_2: 2 *Math.PI,
	space_ltrs: " ..\n",
	quarter_spc_ltr: "_",
	eighth_spc_ltr: "-",


	audio_el: new Audio(),

	speaking_flag:false,




	speak: function(param_obj) { //{input, pitch_all_num, cadence_num, vol_all_num} or just a stephantalk string
		if (!param_obj || $ST.speaking_flag) return;

		if (typeof(param_obj)=="string") param_obj= {i:param_obj};

		if (!param_obj.i) return;

		$ST.speaking_flag= true;

		var 
			input= param_obj.i,

			//constrain
			pitch_all_num= range_default(95, param_obj.p, 50, 450),
			cadence_num= range_default(.685, param_obj.c, .3, 1),
			vol_all_num= range_default(.720, param_obj.v, .3, 1),

			text_flag= typeof(input)=="string",
			//otherwise a array of objs, obj is  {k:"x", p:+-#, v:#, d:#)
			//  key, pitch, volume, duration 
			//    volume: empty, do nothing - otherewise 1 is baseline - fraction<1 is quieter - number >1 is louder
			//    duration: empty, do nothing - otherewise any positive number (normally is 1 to 3)

			pause_num= parseInt(Math.floor(this.sample_resolution *cadence_num *.33)),

			buffer_size,
			samples_pos= 0,

			ltr, pho,

			//pho constants (most could be global, eh, keep here)
			fF= 50 /$ST.sample_resolution,
			qF= Math.PI *10 /$ST.sample_resolution,
			aF= parseInt(44100 /$ST.sample_resolution) *parseInt(44100 /$ST.sample_resolution), //instead of rewrite - hack for change in sample_resolution //1 --> 9 //raise vol
			dF= parseInt($ST.sample_resolution /17 *cadence_num),

			samp_pos, samp_1_res, samp_2_res,
			i, x, xL, y, yp, freq, pitch_num, q, 
			mpa, dur, vol,

			word_start_flag
		;


		if (text_flag) input+= " ";
		else input.push({k:" "});

		var L= input.length;

		if (text_flag) {
			buffer_size= Math.ceil($ST.sample_resolution /2 *cadence_num) *L; //there are some dur 4 - this might need extra

		} else {
			buffer_size= 0;
			for (var c=0; c<L; c++) {
				ltr= input[c].k;

				if (pho= $ST.phonemes[ltr]) {
					if (dur= input[c].d) buffer_size+= range(pho.dur +dur, 1, 100);
					else buffer_size+= pho.dur;
				} else if ($ST.space_ltrs.indexOf(ltr)>=0) {
					buffer_size+= input[c].d || 1;
				} else if (ltr==$ST.quarter_spc_ltr) {
					buffer_size+= .25;
				} else if (ltr==$ST.eighth_spc_ltr) {
					buffer_size+= .125;
				}
			}
			buffer_size= Math.ceil($ST.sample_resolution *cadence_num *buffer_size /4); // /4 trial+error
		}
		
		buffer_size+= buffer_size%2; //must be even for Int16Array
		var samples_arr= window.ArrayBuffer ? new Int16Array(new ArrayBuffer(buffer_size)) : new Array(buffer_size);

		word_start_flag= true;

		//iterate ltr's
		for (var c=0; c<L; c++) {
			ltr= text_flag ? input[c] : input[c].k;

			if (pho= $ST.phonemes[ltr]) {
				append_pho(input[c]);

			} else if ($ST.space_ltrs.indexOf(ltr)>=0) { //space
				samples_pos+= pause_num *(input[c].d || 1);
				word_start_flag= true;

			} else if (ltr==$ST.quarter_spc_ltr) {
				samples_pos+= parseInt(pause_num /4);

			} else if (ltr==$ST.eighth_spc_ltr) {
				samples_pos+= parseInt(pause_num /8);
			}
		}

/* FF
//https://wiki.mozilla.org/Audio_Data_API#Writing_Audio

// Create a new audio element
var audioOutput = new Audio();
// Set up audio element with 2 channel, 44.1KHz audio stream.
audioOutput.mozSetup(2, 44100);

// Write samples using a JS Array
var samples = [0.242, 0.127, 0.0, -0.058, -0.242, ...];
var numberSamplesWritten = audioOutput.mozWriteAudio(samples);

// Write samples using a Typed Array
////var samples = new Float32Array([0.242, 0.127, 0.0, -0.058, -0.242, ...]);
////var numberSamplesWritten = audioOutput.mozWriteAudio(samples);



or use
XAudioServer.js
that does FF and Chrome - but its 19k - might be better to write it - might be just few lines of code



never mind
https://wiki.mozilla.org/Web_Audio_API
FF will be using Web Audio API too



see this... 
Web_Audio_API example
http://www.softsynth.com/webaudio/tone.php
or
http://0xfe.blogspot.com/2011/08/generating-tones-with-web-audio-api.html


meanwhile - orig method (by losso/code red) of creating a 'wav' doesnt seem so bad - speed ok - and best thing is it works universally (webkit and mozilla anyway) and the spec is rock stable
*/
		var 
//			max_amp= 22000;
			header_str= generate_wav_header(16, $ST.sample_resolution, samples_pos *2 +2),
			data_str= "",
			y
		;

		for (c=0; c<samples_pos; c++) { //bare bones wav generator
			y= samples_arr[c];
			//y= parseInt(samples_arr[c] /max_amp *0x7800);
			data_str+= String.fromCharCode(y & 255, (y >> 8) & 255); //2 bytes!
		}

		$ST.audio_el.src= "data:audio/wav;base64," +btoa(header_str +data_str);

		$ST.audio_el.volume= vol_all_num;

		$ST.audio_el.play();

		$ST.speaking_flag= false;




		function append_pho(p_o) {
			if (mpa= pho.arr) { //Multi Pho Aarray
				for (var mp_o, mp=0; mp_o= mpa[mp]; mp++) {
					if (pho= $ST.phonemes[mp_o.k]) { //mp_o can only override dur and vol
						vol= mp_o.vol || pho.vol;
						dur= mp_o.dur || pho.dur;
						generate();

					} else { //pause
						samples_pos+= parseInt(pause_num /2);
					}
				}

			} else {
				vol= pho.vol;
				dur= pho.dur;
				generate();
			}

			function generate() {
				if (word_start_flag) {
					dur*= 1.5;
					word_start_flag= false;
				}

				if (p_o.d) dur= range(dur +p_o.d, 1, 100);
				xL= parseInt(dur *dF); //ltr duration

				pitch_num= pitch_all_num;
				if (p_o.p) pitch_num+= p_o.p; //ltr pitch

				for (i=0; i<3; i++) { //theres either 1, 2 or 3 of these in a pho - they 'overlay' each other
					if (!pho.f[i]) continue;

					freq= pho.f[i] *fF;

					samp_1_res= 0;
					samp_2_res= 0;
					q= 1.0 -pho.w[i] *qF;
					samp_pos= samples_pos;
					yp= 0;

					for (x=0; x<xL; x++) { //make waveforms
						if (!pho.osc) {
							y= sawtooth( x *(pitch_num *$ST.PI_2 /$ST.sample_resolution) );
							yp= 0;

						} else {
							y= Math.random() -0.5;
						}

						if (p_o.v) y*= p_o.v; //ltr v (emphasis)

						//apply formant filter
						y= y +2 *Math.cos ($ST.PI_2 *freq) *samp_1_res *q -samp_2_res *q *q;

						samp_2_res= samp_1_res;
						samp_1_res= y;
						y= 0.75 *yp +y *vol *aF;
						yp= y;

						y*= cut_level(Math.sin (Math.PI *x /xL ) *5, 1) *10; //anticlick function

						samples_arr[samp_pos++]= samples_arr[samp_pos] /2 +y;
					}
				}



				//overlap neighbor phonemes //this is the magic of this code - pho`s overlap, so no allophonemes

				//samples_pos+= ((3 *xL /4) << 1); //2856, 952
				//if (pho.plo) samples_pos+= (xL & 0xfffffe); //634
				samples_pos+= xL -parseInt(dur/3 *dF); //overlap 1/3
				if (pho.plo) samples_pos+= parseInt(dF *2); //plo was plosive //reduces overlap




				function cut_level(x, m) {
					return range(x, m, -m);
				}

				function sawtooth(x) {
					return (0.5 -(x -Math.floor (x /$ST.PI_2) *$ST.PI_2 ) /$ST.PI_2 );
				}
			}
		}

		function generate_wav_header(byte_size, samples_per_sec, sample_count) {
			var h_obj= {
				RIFF: {
					chunk_id: [4, "RIFF"],
					chunk_size: [4, 36 +sample_count],
					type: [4, "WAVE"]
				},
				fmt: {
					chunk_id: [4, "fmt "],
					chunk_size: [4, 0x10],
					compression: [2, 1],
					channels: [2, 1],
					sample_rate: [4, samples_per_sec],
					bytes_per_sec: [4, samples_per_sec *2],
					block_align: [2, 2],
					bits_per_sample: [2, byte_size] //16 bit
				},
				data: {
					chunk_id: [4, "data"],
					chunk_size: [4, sample_count],
					dummy_sample: [4, 0]
				}
			};

			var 
				header_str= "", 
				j,
				y
			;

			for (var i in h_obj) {
				for (j in h_obj[i]) {
					y= h_obj[i][j][1];
					if (typeof(y)=="string") {
						header_str+= h_obj[i][j][1];

					} else {
						header_str+= String.fromCharCode(y & 255, (y >> 8) & 255);
						if (h_obj[i][j][0]==4) header_str+= String.fromCharCode((y >> 16) & 255, (y >> 24) & 255);
					}
				}
			}

			return header_str;
		}

		function range_default(default_num, x, min, max) {
			if (x) return range(x, min, max);
			else return default_num;
		}

		function range(x, min, max) {
			x= x *1;
			if (isNaN(x) || x>max) x= max;
			else if (x<min) x= min;
			return x;
		}
	}




};

$ST= $StepanTalking;
