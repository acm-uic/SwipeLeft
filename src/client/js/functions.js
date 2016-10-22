var value = "";

$(document).ready ( function () {
	$(window).load ( function () {

		function animateCircle () {
			var height = $(window).height ();
			var width = $(window).width ();
			var radius = Math.max ( height, width );
			$("#circle").animate ({
				"height": 			radius + "px",
				"width": 			radius + "px",
				"margin-top": 		"-" + ( radius / 2 ) + "px",
				"margin-left": 		"-" + ( radius / 2 ) + "px",
				"border-radius": 	radius + "px",
				"opacity": 			"0.0"
			}, 1000, function () {
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

		function showAndHide ( data, color ) {
			$(".LogoColor").css ({ "fill": color, "transition": "1.0s" });
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
				var uin = validate ( value );
				if ( Number.isInteger ( uin ) ) {
					submit ( uin );
				}
				else {
					error ( uin );
				}
				value = "";
			}
			else {
				value += char;
			}
		});

	});
});