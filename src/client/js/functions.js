$(document).ready ( function () {
	$(window).load ( function () {

		$.get ( "http://raffi.io/SWIPE/api/events/", function ( data, status ) {
    	    alert ( "Data: " + data + "\nStatus: " + status );
    	});

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
			}, 1000, function () {
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
			$("#message").animate ( { opacity: 0.0 }, 300, function () {
				$("#message").html ( data );
				$("#message").animate ( { opacity: 1.0 }, 300 ).delay ( 1100 ).animate ( { opacity: 0.0 }, 300, function () {
					$(".LogoColor").css ({ "fill": "#D90000", "transition": "1.0s" });
				});
			});
		}

		function submit ( data ) {
			showAndHide ( "Your UIN is " + data, "#008C9E" );
			animateCircle ();
		}

		function error ( message ) {
			showAndHide ( message, "#D90000" );
		}

		function validate ( data ) {
			data = String ( data );
			if ( data.startsWith ("%") ) {
				if ( data.search ( "CARDHOLDER/UNIVERSITY" ) === -1 ) {
					return "Error: Invalid UIN. Please try again!";
				}
				return Number ( data.substring ( 6, 15 ) );
			}
			else if ( data.startsWith ("+") ) {
				return Number ( data.substring ( 5, 14 ) );
			}
			else {
				return "Error: Card not valid.";
			}
		}

		$(document).keypress ( function ( event ) {
			var char = String.fromCharCode ( event.which );
			if ( event.which == 13 ) {
				$(".LogoColor").css ({ "fill": "#EBC354" });
				var uin = validate ( buffer );
				if ( Number.isInteger ( uin ) ) {
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

	});
});