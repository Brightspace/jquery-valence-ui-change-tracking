( function() {
	'use strict';

	describe( 'vui.changeTracking', function() {

		var node;

		beforeEach( function () {
			jasmine.addMatchers( d2l.jasmine.matchers );
			node = document.body.appendChild( document.createElement( 'div' ) );
		} );

		afterEach( function() {
			document.body.removeChild( node );
		} );

		describe( 'style', function() {

			it( 'defines a "vui-changed" selector', function() {
				expect( document ).toHaveCssSelector( '.vui-changed' );
			} );

		} );

		describe( 'create', function() {

			var $input;

			beforeEach( function () {
				$input = $( "<input class='vui-input' type='checkbox'>" ).appendTo( node );
			} );

			it( 'binds the input elements using widget method', function() {
				$input.vui_changeTracking();
				expect( $input.data( 'vui-vui_changeTracking' ) ).toBeDefined();
			} );

		} );

		describe( 'destroy', function() {

			var $input;

			beforeEach( function () {
				$input = $( "<input class='vui-input' type='checkbox'>" )
					.appendTo( node )
					.vui_changeTracking();
			} );

			it( 'unbinds input from widget when destroy is called', function() {
				$input.vui_changeTracking( 'destroy' );
				expect( $input.data( 'vui-vui_changeTracking' ) ).not.toBeDefined();
			} );

			it( 'triggers vui-restore if has changed', function( done ) {
				$input.click();
				$input.on( 'vui-restore', function( sender ) {
					done();
				} );
				$input.vui_changeTracking( 'destroy' );
			} );

			it( 'does not trigger vui-restore if value has not changed', function( done ) {
				var hasTriggered = false;
				$input.on( 'vui-restore', function( sender ) {
					hasTriggered = true;
				} );
				setTimeout( function() {
					expect( hasTriggered ).toBeFalsy();
					done();
				}, 0 );
				$input.vui_changeTracking( 'destroy' );
			} );

		} );

		describe( 'checkbox', function() {

			var $input;

			beforeEach( function () {
				$input = $( "<input class='vui-input' type='checkbox'>" )
					.appendTo( node )
					.vui_changeTracking();
			} );

			it( 'hasChanged returns false when value has not changed', function() {
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

			it( 'hasChanged returns true when value has changed', function() {
				$input.click();
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
			} );

			it( 'hasChanged returns false when value has changed and then changed back', function() {
				$input.click();
				$input.click();
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

		} );

		describe( 'radio button', function() {

			var $input1, $input2, $input3;

			beforeEach( function () {
				$input1 = $( "<input class='vui-input' type='radio' name='test_radio' value='apples' checked='checked'>" ).appendTo( node )
					.vui_changeTracking();
				$input2 = $( "<input class='vui-input' type='radio' name='test_radio' value='bananas'>" ).appendTo( node )
					.vui_changeTracking();
				$input3 = $( "<input class='vui-input' type='radio' name='test_radio' value='coconuts'>" ).appendTo( node )
					.vui_changeTracking();
			} );

			it( 'hasChanged returns false when value has not changed', function() {
				expect( $input1.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
				expect( $input2.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
				expect( $input3.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

			it( 'hasChanged returns false when value has changed and then changed back', function() {
				$input2.click();
				$input1.click();
				expect( $input1.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
				expect( $input2.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

			it( 'hasChanged returns true when value has changed', function() {
				$input2.click();
				expect( $input1.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
				expect( $input2.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
			} );

		} );

		describe( 'text', function() {

			var $input;

			beforeEach( function () {
				$input = $( "<input class='vui-input' type='text'>" )
					.appendTo( node )
					.vui_changeTracking();
			} );

			it( 'hasChanged returns false when value has not changed', function() {
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

			it( 'hasChanged returns true when value has changed', function() {
				$input.attr( 'value', 'abc' )
					.trigger( 'change' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
			} );

			it( 'hasChanged returns false when value has changed and then changed back', function() {
				$input.attr( 'value', 'abc' )
					.trigger( 'change' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
				$input.attr( 'value', '' )
					.trigger( 'change' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

		} );

		describe( 'textarea', function() {

			var $input;

			beforeEach( function () {
				$input = $( "<textarea class='vui-input'></textarea>" )
					.appendTo( node )
					.vui_changeTracking();
			} );

			it( 'hasChanged returns false when value has not changed', function() {
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

			it( 'hasChanged returns true when value has changed', function() {
				$input.val( 'abc' )
					.trigger( 'change' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
			} );

			it( 'hasChanged returns false when value has changed and then changed back', function() {
				$input.val( 'abc' )
					.trigger( 'change' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
				$input.val( '' )
					.trigger( 'change' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

		} );

		describe( 'select', function() {

			var $input;

			beforeEach( function () {
				$input = $( "<select class='vui-input'><option>option 1</option><option>option 2</option><option>option 3</option></select>" )
					.appendTo( node )
					.vui_changeTracking();
			} );

			it( 'hasChanged returns false when value has not changed', function() {
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

			it( 'hasChanged returns true when value has changed', function() {
				$input.val( 'option 2' )
					.trigger( 'change' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
			} );

			it( 'hasChanged returns false when value has changed and then changed back', function() {
				$input.val( 'option 2' )
					.trigger( 'change' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
				$input.val( 'option 1' )
					.trigger( 'change' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

		} );

		describe( 'reset', function() {

			var $input, node2;

			beforeEach( function () {
				node2 = document.body.appendChild( document.createElement( 'div' ) );
				$input = $( "<input class='vui-input' type='checkbox'>" )
					.appendTo( node )
					.vui_changeTracking();
			} );

			afterEach( function() {
				document.body.removeChild( node2 );
			} );

			it( 'hasChanged returns false after reset event is triggered', function() {
				$input.click();
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
				$( document ).trigger( 'vui-reset' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

			it( 'hasChanged returns false after reset event is triggered on input element', function() {
				$input.click();
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
				$input.trigger( 'vui-reset' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

			it( 'hasChanged returns true after reset event is triggered on a non-ancestor', function() {
				$input.click();
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
				$( node2 ).trigger( 'vui-reset' );
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeTruthy();
			} );

		} );

		describe( 'change/restore event', function() {

			var $input;

			beforeEach( function () {
				$input = $( "<input class='vui-input' type='checkbox'>" )
					.appendTo( node )
					.vui_changeTracking();
			} );

			it( 'hasChanged returns false when value has not changed', function() {
				expect( $input.vui_changeTracking( 'hasChanged' ) ).toBeFalsy();
			} );

			it( 'triggers vui-change when value is changed', function( done ) {
				$input.on( 'vui-change', function( sender ) {
					done();
				} );
				$input.click();
			} );

			it( 'triggers vui-restore when value is changed back to original value', function( done ) {
				$input.on( 'vui-restore', function( sender ) {
					done();
				} );
				$input.click();
				$input.click();
			} );

		} );

	} );

} )();
