/*jslint browser: true*/

( function() {

	'use strict';

	$.widget( 'vui.vui_changeTracking', {

		_create: function() {

			var nodeName = this.element.prop( 'nodeName' );
			var me = this;

			if( nodeName === 'INPUT' && this.element.attr( 'type' ) === 'radio' ) {
				var groupName = this.element.prop( 'name' );
				if( groupName ) {
					var selected = $( 'input[name="' + groupName + '"]:checked' );
					selected.uniqueId();
					this.element.data( 'selectedId', selected.attr('id') );
				}
			}

			var evtData = { me: me };

			$( document ).on( 'vui-reset', evtData, this._handleReset );

			this.element
				.uniqueId()
				.data( 'originalValue', me._getValue( me.element ) )
				.data( 'hasChanged', false )
				.on( 'change.vui', evtData, this._handleChange );

		},

		_destroy: function () {

			if( this.hasChanged() ) {
				this.element.trigger( 'vui-restore' );
			}

			$( document ).off( 'vui-reset', this._handleReset );

			this.element
				.off( 'change.vui' )
				.removeUniqueId();

		},

		_getValue: function( $node ) {

			var node = $node.get(0);
			var nodeName = $node.prop( 'nodeName' );

			if( nodeName === 'SELECT' ) {
				return $node.val();
			}

			if( nodeName === 'INPUT' ) {

				var inputType = $node.attr( 'type' );

				if( inputType === 'checkbox' || inputType === 'radio' ) {
					return node.checked;
				}

			}

			return node.value;

		},

		_handleChange: function( evt ) {

			var me = evt.data.me;

			var $node = me.element;
			var node = $node.get(0);
			var nodeName = $node.prop( 'nodeName' );
			var selectedId = $node.data( 'selectedId' );
			var id = $node.attr('id');

			if( nodeName === 'INPUT' && $node.attr( 'type' ) === 'radio' ) {

				var groupName = $node.prop( 'name' );
				if( groupName ) {

					$( 'input[name="' + groupName + '"]' ).each( function( i ) {

						var $this = $( this );

						if( this !== node && $this.attr('id') === selectedId ) {
							me._triggerEvent( $this );
						}

						$this.data( 'selectedId', id );

					} );

				}
			}

			me._triggerEvent( $node );

		},

		_handleReset: function( evt ) {

			var me = evt.data.me;

			var isParentTracker = ( me.element.closest( evt.target ).length > 0 );
			if( !isParentTracker || !me.hasChanged() ) {
				return;
			}

			me.element
				.data( 'originalValue', me._getValue( me.element ) )
				.data( 'hasChanged', false )
				.trigger( 'vui-restore' );

		},

		_triggerEvent: function( $target ) {

			var hasChanged = this._getValue( $target ) !==
				$target.data( 'originalValue' );

			$target
				.data( 'hasChanged', hasChanged )
				.trigger( hasChanged ? 'vui-change' : 'vui-restore' );

		},

		hasChanged: function() {
			return $( this.element ).data( 'hasChanged' );
		}

	} );

} )();
