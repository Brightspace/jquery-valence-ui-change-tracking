( function() {
	'use strict';

	describe( 'vui.changeTracker', function() {

		var node;

		beforeEach( function () {
			jasmine.addMatchers( vui.jasmine.dom.matchers );

			node = document.body.appendChild( document.createElement( 'div' ) );
			node.setAttribute( 'data-track-changes', 'true' );

		} );

		afterEach( function() {
			document.body.removeChild( node );
		} );

		describe( 'create', function() {

			var $tracker;

			beforeEach( function () {
				$tracker = $( "<div class='vui-change-tracker'></div>" ).appendTo( node );
			} );

			it( 'binds the input elements using widget method', function() {
				$tracker.vui_changeTracker();
				expect( $tracker.data( 'vui-vui_changeTracker' ) ).toBeDefined();
			} );

		} );

		describe( 'destroy', function() {

			var $tracker, $input1;

			beforeEach( function () {

				$tracker = $( "<div class='vui-change-tracker'></div>" )
					.appendTo( node )
					.vui_changeTracker();

				$input1 = $( "<input class='vui-input' type='checkbox' />" )
					.appendTo( $tracker )
					.vui_changeTracking();

			} );

			it( 'unbinds input from widget when destroy is called', function() {
				$tracker.vui_changeTracker( 'destroy' );
				expect( $tracker.data( 'vui-vui_changeTracker' ) ).not.toBeDefined();
			} );

			it( 'removes the vui-changed class name from tracker element', function() {
				$input1.click();
				expect( $tracker.get( 0 ) ).toHaveClassName( 'vui-changed' );
				$tracker.vui_changeTracker( 'destroy' );
				expect( $tracker.get( 0 ) ).not.toHaveClassName( 'vui-changed' );
			} );

		} );

		describe( 'containsChanges', function() {

			var $tracker, $input1, $input2;

			beforeEach( function () {

				$tracker = $( "<div class='vui-change-tracker'></div>" )
					.appendTo( node )
					.vui_changeTracker();

				$input1 = $( "<input class='vui-input' type='checkbox' />" )
					.appendTo( $tracker )
					.vui_changeTracking();

				$input2 = $( "<input class='vui-input' type='text' />" )
					.appendTo( $tracker )
					.vui_changeTracking();

			} );

			it( 'returns false when there are no changes', function() {
				expect( $tracker.vui_changeTracker( 'containsChanges' ) ).toBeFalsy();
			} );

			it( 'returns true when there are changes', function() {
				$input1.click();
				expect( $tracker.vui_changeTracker( 'containsChanges' ) ).toBeTruthy();
			} );

			it( 'returns false after changed item is removed', function() {
				$input1.click();
				$input1.vui_changeTracking( 'destroy' );
				expect( $tracker.vui_changeTracker( 'containsChanges' ) ).toBeFalsy();
			} );

		} );

		describe( 'hasElementChanged', function() {

			var $tracker, $input1, $input2;

			beforeEach( function () {

				$tracker = $( "<div class='vui-change-tracker'></div>" )
					.appendTo( node )
					.vui_changeTracker();

				$input1 = $( "<input class='vui-input' type='checkbox' />" )
					.appendTo( $tracker )
					.vui_changeTracking();

				$input2 = $( "<input class='vui-input' type='checkbox' />" )
					.appendTo( $tracker );

			} );

			it( 'returns false when there are no changes', function() {
				expect( $tracker.vui_changeTracker( 'hasElementChanged', $input1.get( 0 ) ) ).toBeFalsy();
			} );

			it( 'returns true when there are changes', function() {
				$input1.click();
				expect( $tracker.vui_changeTracker( 'hasElementChanged', $input1.get( 0 ) ) ).toBeTruthy();
			} );

			it( 'returns false when with changes does not have an id', function() {
				$input2.click();
				expect( $tracker.vui_changeTracker( 'hasElementChanged', $input2.get( 0 ) ) ).toBeFalsy();
			} );

		} );

		describe( 'isChangesShown', function() {

			describe( 'not nested', function() {

				var cases = [
					{ trackChanges: true, showChanges: true, expected: true },
					{ trackChanges: false, showChanges: true, expected: false },
					{ trackChanges: true, showChanges: false, expected: false },
					{ trackChanges: false, showChanges: false, expected: false }
				];

				var runSpecs = function( specCase ) {
					describe( 'trackChanges ' + specCase.trackChanges + ' and showChanges ' + specCase.showChanges, function() {

						var $tracker, $input;

						beforeEach( function () {

							if ( !specCase.trackChanges ) {
								node.setAttribute( 'data-track-changes', 'false' );
							}

							$tracker = $( "<div class='vui-change-tracker'></div>" )
								.attr( 'data-show-changes', specCase.showChanges )
								.appendTo( node )
								.vui_changeTracker();

							$input = $( "<input class='vui-input' type='checkbox' />" )
								.appendTo( $tracker )
								.vui_changeTracking();

						} );

						it( 'returns false when there are no changes', function() {
							expect( $tracker.vui_changeTracker( 'isChangeShown' ) ).toBeFalsy();
						} );

						it( 'returns ' + specCase.expected + ' when there are changes', function() {
							$input.click();
							expect( $tracker.vui_changeTracker( 'isChangeShown' ) ).toBe( specCase.expected );
						} );

					} );
				};

				for( var i=0; i<cases.length; i++ ) {
					runSpecs( cases[i] );
				}

			} );

			describe( 'nested', function() {

				var cases = [
					{ trackChangesOuter: true, trackChangesInner: true, expected: true },
					{ trackChangesOuter: true, trackChangesInner: false, expected: false },
					{ trackChangesOuter: false, trackChangesInner: true, expected: true },
					{ trackChangesOuter: false, trackChangesInner: false, expected: false }
				];

				var runSpecs = function( specCase ) {
					describe( 'outer trackChanges ' + specCase.trackChangesOuter + ' and inner trackChanges ' + specCase.trackChangesInner, function() {

						var $tracker, $input, $innerContainer;

						beforeEach( function () {

							node.setAttribute( 'data-track-changes', specCase.trackChangesOuter );

							$innerContainer = $( "<div></div>" )
								.attr( 'data-track-changes', specCase.trackChangesInner )
								.appendTo( node )
								.vui_changeTracker();

							$tracker = $( "<div class='vui-change-tracker'></div>" )
								.attr( 'data-show-changes', specCase.showChanges )
								.appendTo( $innerContainer )
								.vui_changeTracker();

							$input = $( "<input class='vui-input' type='checkbox' />" )
								.appendTo( $tracker )
								.vui_changeTracking();

						} );

						it( 'returns false when there are no changes', function() {
							expect( $tracker.vui_changeTracker( 'isChangeShown' ) ).toBeFalsy();
						} );

						it( 'returns ' + specCase.expected + ' when there are changes', function() {
							$input.click();
							expect( $tracker.vui_changeTracker( 'isChangeShown' ) ).toBe( specCase.expected );
						} );

					} );
				};

				for( var i=0; i<cases.length; i++ ) {
					runSpecs( cases[i] );
				}

			} );

		} );

	} );

} )();
