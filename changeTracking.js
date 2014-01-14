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

	$.widget( 'vui.vui_changeTracking', {

		_create: function() {

			var $node = $( this.element );

			$node.uniqueId();

			var getValue = function( $tempNode ) {

				var node = $tempNode.get(0);
				var nodeName = node.nodeName;

				if ( nodeName === 'SELECT' ) {
					return $tempNode.val();
				}

				if ( nodeName === 'INPUT' ) {

					var inputType = $tempNode.attr( 'type' );

					if ( inputType === 'checkbox' || inputType === 'radio' ) {
						return node.checked;
					}

				}

				return node.value;

			};

			var originalValue = getValue( $node );

			$node.on( 'change.vui', function( e ) {

				var $target = $( e.target );
				var args = { 'id': $target.attr( 'id' ) };

				if ( getValue( $target ) === originalValue ) {

					$target
						.removeClass( 'vui-changed' )
						.trigger( 'vui-restore', args );

				} else {

					$target
						.addClass( 'vui-changed' )
						.trigger( 'vui-change', args );

				}

			} );

		},

		_destroy: function () {

			var $node = $( this.element );

			$node
				.removeClass( 'vui-changed' )
				.trigger( 'vui-restore', $node.attr( 'id' ) )
				.off( 'change.vui' )
				.removeUniqueId();

		},

		hasChanged: function() {
			return $( this.element ).hasClass( 'vui-changed' );
		}

	} );

	vui.addClassInitializer(
			'vui-input',
			function( node ) {
				$( node ).vui_changeTracking();
			}
		);

} )( window.vui );