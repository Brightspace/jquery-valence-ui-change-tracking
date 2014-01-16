/*jslint browser: true*/

( function( vui ) {

	'use strict';

	// Check if the provided vui global is defined, otherwise try to require it if
	// we're in a CommonJS environment; otherwise we'll just fail out
	if( vui === undefined ) {
		if( typeof require === 'function' ) {
			vui = require('../../core');
		} else {
			throw new Error('load vui first');
		}
	}

	// Export the vui object if we're in a CommonJS environment.
	// It will already be on the window otherwise
	if( typeof module === 'object' && typeof module.exports === 'object' ) {
		module.exports = vui;
	}

	var $ = vui.$;

	$.widget( 'vui.vui_changeTracker', {

		_changedItems: {},

		_create: function() {

			var me = this;
			
			var $node = $( this.element );

			$node.on( 'vui-change', function( e, args ) {

				me._changedItems[args.id] = true;

				if ( !e.isChangeHighlighted ) {
					$node.addClass( 'vui-changed' );
					e.isChangeHighlighted = true;
				}

			} ).on( 'vui-restore', function( e, args ) {

				if ( me._changedItems[args.id] !== undefined ) {
					delete me._changedItems[args.id];
				}

				if ( Object.keys( me._changedItems ).length === 0 ) {
					$node.removeClass( 'vui-changed' );
				} 

			} );

		},

		_destroy: function () {

			$( this.element )
				.removeClass( 'vui-changed' )
				.off( 'vui-change vui-restore' );

			this._changedItems = { };

		},

		containsChanges: function() {
			return ( Object.keys( this._changedItems ).length > 0 );
		},

		isHighlightingChanges: function () {
			return $( this.element ).hasClass( 'vui-changed' );
		}

	} );

	vui.addClassInitializer(
			'vui-change-tracker',
			function( node ) {
				$( node ).vui_changeTracker();
			}
		);

} )( window.vui );