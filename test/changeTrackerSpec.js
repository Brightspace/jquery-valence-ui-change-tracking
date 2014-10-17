( function() {
	'use strict';

	describe( 'vui', function() {

		var node;

		beforeEach( function () {
			jasmine.addMatchers( d2l.jasmine.matchers );
			node = document.body.appendChild( document.createElement( 'div' ) );
		} );

		afterEach( function() {
			document.body.removeChild( node );
		} );

		describe( 'change tracker', function() {

			beforeEach( function () {
			} );

			it( 'todo', function() {
				expect( true ).toBe( true );
			} );

		} );

	} );

} )();
