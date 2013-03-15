Stephan Talking API:

when using this as a lib, $StepanTalking is an object in the global namespace, aka $ST


1 function: $ST.speak()


simplest usage, parameter as a stephantalk string:
$ST.speak("wats up dok");


more versatile usage, parameter as a data object:
$ST.speak({
  p:pitch,   //optional, 50 to 450
  c:cadence, //optional, 1.0 to 0.3
  v:vol,     //optional, 0.3 to 1.0
  i:input    //required, more details on 'input' below
});


'input' can be either::
- stephantalk string
  eg.
  "wats up dok"

or
- stephantalk obj
  eg.
  [
    {k:"w"},
    {k:"a", p:100, v:.9, d:1}, //required: k(ey) | these 3 are optional: p(itch) -50 to 50 | v(ol) 0.1 to 2.0 | d(ur) -5 to 100
    {k:"t"},
    {k:"s"},
    {k:" "},
    {k:"u"},
    {k:"p"},
    {k:" "},
    {k:"d"},
    {k:"o"},
    {k:"k"}
  ]




actual examples:

	$ST.speak("hellO");

	//modifying overall pitch
	$ST.speak({
	  p:75,
	  i:"hellO"
	});

	//modifying overall pitch, cadence and volume
	$ST.speak({
	  p:50,
	  c:.9,
	  v:.6,
	  i:"hellO"
	});

	//modifying overall cadence
	//and pitch for letter "e"
	//and volume and duration for letter "O"
	$ST.speak({
	  c:.4,
	  i: [
	    {k:"h"},
	    {k:"e", p:-10},
	    {k:"l"},
	    {k:"l"},
	    {k:"O", v:1.5, d:20}
	  ]
	});


	//modifying overall pitch and cadence
	$ST.speak({
	  p:60,
	  c:.33,
	  i:"yO  yO   chek it out"
	});
