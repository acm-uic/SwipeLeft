var DEBUG = 1;
var returnValue ;

function debug(string) {
	if (DEBUG) {
		put(string);
	}
}

function error  ( msg )  {console.log ( '%c ERROR: '  + String(msg),'color:red;'    );  };
function warning( msg )  {console.log ( '%c WARNING: '+ String(msg),'color:orange;' );  };
function passed ( msg )  {console.log ( '%c PASSED: ' + String(msg),'color:green;'  );  };
function put    ( msg )  {console.log ( '%c MSG: '    + String(msg),'color:black;'  );  };

$(document).ready ( function () {
	$(window).load ( function () {


		// Get the events
		$.ajax({
			url: "https://acm.cs.uic.edu/rest/api/events",
			type: "GET",
			dataType: "html",
			success: function ( data ) {
				var events = jQuery.parseJSON ( data ) ["events"];
				var html = "<select>";
				$.each ( events, function ( index, event ) {
					html += "<option value='" + event ["event"] + "' >" + event ["event"] + "</option>";
				});
				html += "</select>";
				$("#events").html ( html );
				$("#events").append ("<div id='eventSubmit' >Choose Event</div>");	
			}
		});

		// Initialize the event name
		var choosen = "";

		// Initialize buffer variable
		var buffer = "";

		// This function kicks off the circle animation
		function animateCircle () {
			// Get the screen dimensions
			var height = $(window).height ();
			var width = $(window).width ();
			var radius = Math.max ( height, width );
			// Animate the circle to speed out and dissipate
			$("#circle").animate ({
				"height": 				radius + "px",
				"width": 				radius + "px",
				"margin-top": 			"-" + ( radius / 2 ) + "px",
				"margin-left": 			"-" + ( radius / 2 ) + "px",
				"border-radius": 		radius + "px",
				"opacity": 				"0.0"
			}, 500, function () {
				// After the animation is complete, reset the attributes
				$("#circle").css ({
					"height": 				"0px",
					"width": 				"0px",
					"margin-top": 			"-0px",
					"margin-left": 			"-0px",
					"border-radius": 		"0px",
					"opacity": 				"1.0"
				});
			});
		}

		// This function shows the message box, and then hides it
		function showAndHide ( data, color ) {
			// Animate the logo color using CSS
			$(".LogoColor").css ({ "fill": color, "transition": "1.0s" });
			//
			$("#message").animate ( { opacity: 0.0 }, 150, function () {
				$("#message").html ( data );
				$("#message").animate ( { opacity: 1.0 }, 150 ).delay ( 500 ).animate ( { opacity: 0.0 }, 150, function () {
					$(".LogoColor").css ({ "fill": "#D90000", "transition": "1.0s" });
				});
			});
		}

		function submit ( data ) {
			$.ajax({
				url: "https://acm.cs.uic.edu/rest/api/events/signin",
				type: "POST",
				data: { "uin": data, "event": choosen },
				dataType: "html",
				success: function ( data ) {
					var result = jQuery.parseJSON ( data );
					showAndHide ( "Thank you <b>" + result ["firstName"] + " " + result ["lastName"] + "</b>. You now have <b>" + result ["points"] + "</b> points!", "#008C9E" );
					animateCircle ();
				},
				error: function ( data ){
					try{
						if ( String( jQuery.parseJSON ( data.responseText ).error ) === "user already signed into this event") {
							warning( "user already signed into this event" );
						}
						else if ( String( jQuery.parseJSON ( data.responseText ).error ) === "event is not ongoing") {
							warning( "event is not ongoing" );
						}
						else{
							error( "Unknown Error" );
							console.log( data );
						}
					}
					catch(event){
							error( "Unknown error raw returned object is below" );
							console.log( data );						
					}
				}
			});
		}

		function validate ( data ) {
			data = String ( data );
			debug ( data );
			if ( data.startsWith ("%") ) {
				if ( data.search ( "CARDHOLDER/UNIVERSITY" ) === -1 ) {
					return "Error: Invalid UIN. Please try again!";
				}
				return Number ( data.substring ( 6, 15 ) );
			}
			else if ( data.startsWith ("+") ) {
				return Number ( data.substring ( 5, 14 ) );
			}
			else if ( data.startsWith ("35") ) {
				return Number ( data.substring ( 8, 17 ) );
			}
			else if ( Number ( String (data).length ) === Number (31) ) {
				return Number ( data.substring ( 5, 14 ) );
			}
			else {
				error( "Error: Card not valid." + data );
				return "Error: Card not valid.";
			}
		}

		$(document).keypress ( function ( event ) {
			// Make sure an event is chosen
			if ( choosen == "" ) {
				// Return and don't do anything else
				return;
			}
			// Get the key that was pressed
			var char = String.fromCharCode ( event.which );
			// If it was the enter key (new line)
			if ( event.which == 13 ) {
				var uin = validate ( buffer );
				if ( Number.isInteger ( uin ) ) {
					// Change the color of the logo
					$(".LogoColor").css ({ "fill": "#EBC354" });
					submit ( uin );
				}
				else {
					error ( uin );
				}
				buffer = "";
			}
			else {
				buffer += char;
			}
		});

		$(document).on ( "click", "#eventSubmit", function () {
			// Save the chosen event
			choosen = $("#events select").find (":selected").attr ("value");
			// Animate the light box out
			$("body").animate ({ "background-color": "#FFFFFF" }, 600 );
			$("#events").animate ({ "opacity": "0.0" }, 600, function(){
				// Prevent further user interaction
				$(this).hide ();
			} );
			$("#Logo").animate ({ "opacity": "1.0" }, 600 );
		});

	});
});