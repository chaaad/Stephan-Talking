if (!window.$TT) $TextTranslator= {};
$TT= $TextTranslator;




//numbers start
$TextTranslator.numbers= {
	map: {
		0:"zerO",
		1:"wun",
		2:"tU",
		3:"thrE",
		4:"for",
		5:"fIv",
		6:"siks",
		7:"seven",
		8:"At",
		9:"nIn"
	},

	process: function(text) {
		var match_arr, number_words_str;
		if (match_arr= text.match(/\d+/g)) {
			for (var i=0, match_str; match_str= match_arr[i]; i++) {
				number_words_str= translate(match_str);
				text= text.replace(match_str, number_words_str);
			}
		}
		return text;



		var ltr;
		function translate(str) {
			var number_words_str= " ";

			for (var i=0, L= str.length; i<L; i++) {
				ltr= str.charAt(i);
				number_words_str+= $TT.numbers.map[ltr] +" ";
			}

			return number_words_str;
		}
	}


	//fancy would be saying long numbers like "one thousand two hundred fifteen"
	//doable - but often, long numbers are not wanted - no way to distinguish
	//so forget it altogether

};
//numbers end
