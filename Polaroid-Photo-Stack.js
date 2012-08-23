/**
  * The MIT License (MIT)
  * Copyright (C) 2012 CNGR GROUP, LLC
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  **/


(function( $ ) {

	$.PolaroidPhotoStack = {
		isUnLocked : function () {
			var lock = $.data( document.body, 'PPS-lock' );
			return ( lock === false || lock === undefined || lock === null );
		},
		lock : function( ) {
			$.data( document.body, 'PPS-lock', true );
		},
		unLock : function( ) {
			$.data( document.body, 'PPS-lock', false );
		},
		addControls : function( cssPrefix ) {
			var $photoStackContainer = $('<div />', { id : cssPrefix + '-Container' } ).appendTo(document.body);
			// todo @PAS August 21 2012 : Hard coding the height will eventually fail.
			$photoStackContainer.css({
				'width'		: 500 + 'px',
				'height'	: 500 + 'px'
			});
			$photoStackContainer.center(false);
			var $buttonNext = $( '<div />' , { id : cssPrefix + '-Next' } );
			var $buttonPrev = $( '<div />' , { id : cssPrefix + '-Prev' } );
			var $buttonClose = $( '<div />' ,{ id : cssPrefix + '-Close' } );
			$buttonNext.bind ( 'click' , function () {
				$photoStackContainer.children('div:nth-child(4)')
									.animate(
										{
											'top' : '0%',
											'left' : '0%'
										},
										{
											duration : 'slow',
											complete : function() {
												$(this).remove();
												$photoStackContainer.append( $(this) );
												$(this).animate(
													{
														'top' : '50%',
														'left': '50%'
													},
													'slow'
												);
											}
										}
									);
			});
			$buttonPrev.bind('click', function( ) {
				$photoStackContainer.children('div:last-child')
									.animate(
										{
											'top' : '0%',
											'left' : '0%'
										},
										{
											duration: 'slow',
											complete: function() {
												$(this).remove();
												$photoStackContainer.children('div:nth-child(3)').after( $(this) );
												$(this).animate(
													{
														'top' : '50%',
														'left' : '50%'
													},
													'slow'
												);
											}
										}
									);
			});
			$buttonClose.bind('click', function( ) {
				$photoStackContainer.fadeOut(
												'slow',
												function() {
													$('.' + cssPrefix + '-Photo-Wrapper').remove();
													$('#' + cssPrefix + '-Next').remove();
													$('#' + cssPrefix + '-Prev').remove();
													$('#' + cssPrefix + '-Close').remove();
													$('#' + cssPrefix + '-Container').remove();
												}
											);
				$.PolaroidPhotoStack.unLock();
			});
			$photoStackContainer.append( $buttonNext );
			$photoStackContainer.append( $buttonPrev );
			$photoStackContainer.append( $buttonClose );
		},
		showControls: function( cssPrefix ) {
			$('#' + cssPrefix + '-Next').fadeIn('slow');
			$('#' + cssPrefix + '-Prev').fadeIn('slow');
			$('#' + cssPrefix + '-Close').fadeIn('slow');
			$('#' + cssPrefix + '-Container').fadeIn('slow');
		},
		loadData : function( data, textStatus, jqXHR, cssPrefix ) {
			// Count Down Latch is designed to fire off a function after it fires n number of times.
			var CountDownLatch = function( count ) {
				this.count = count;
			};
			CountDownLatch.prototype.fire = function() {
				this.count--;
				if ( this.count <= 0 )
				{
					$.PolaroidPhotoStack.showControls( cssPrefix );
				}
			};
			var countDownLatch = new CountDownLatch( data.length );
			var xtndFn = function( indexInArray, valueOfElement, countDownLatch ) {
				var $image = $('<img class="' + cssPrefix + '-Photo"/>')
									.attr('src', "/" + valueOfElement )
									.load( function() {
														var from = -3;
														var to = 3;
														var r = Math.floor(Math.random() * (to - from + 1) + from);
														var imgwidth = $(this).width();
														var imgheight = $(this).height();
														var rotate = {
																'-moz-transform'	:'rotate(' + r + 'deg)',
																'-webkit-transform'	:'rotate(' + r + 'deg)',
																'transform'			:'rotate(' + r + 'deg)',
																'width'             : imgwidth + 'px',
																'height'            : imgheight + 'px',
																'margin-top'        :'-' + (imgheight/2) + 'px',
																'margin-left'       :'-' + (imgwidth/2) + 'px'
														};
														$(this).wrap( $('<div class="' + cssPrefix + '-Photo-Wrapper"/>' ).css(rotate) );
														countDownLatch.fire();
													} );
				$('#' + cssPrefix + '-Container').append( $image );
			};
			jQuery.each( data, function( indexInArray, valueOfElement ) { xtndFn( indexInArray, valueOfElement, countDownLatch ); } );
		},
		dynamicLoad : function( dataUrl, albumName, cssPrefix ) {
			$.getJSON( dataUrl, { albumName: albumName }, function( data, textStatus, jqXHR ) {
				$.PolaroidPhotoStack.loadData( data, textStatus, jqXHR, cssPrefix );
			} );
		}
	};
	$.fn.center = function(parent) {
		if (parent) {
			parent = this.parent();
		} else {
			parent = window;
		}
		this.css({
			"position": "absolute",
			"top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
			"left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
		});
		return this;
	};
	$.fn.PolaroidPhotoStack = function( options ) {
		var params = $.extend( {
			'data'      : null,
			'dataUrl'   : '/Polaroid-Photo-Stack.php',
			'albumName' : 'album',
			'cssPrefix' : 'PPS'
		}, options );
		this.bind('click', function( eventObj ) {
					if ( $.PolaroidPhotoStack.isUnLocked() ) {
						$.PolaroidPhotoStack.lock();
						$.PolaroidPhotoStack.addControls( params.cssPrefix );
						if ( params.data === null ) {
							$.PolaroidPhotoStack.dynamicLoad( params.dataUrl , $(this).attr( params.albumName ), params.cssPrefix );
						} else {
							$.PolaroidPhotoStack.loadData( params.data, null, null, params.cssPrefix );
						}
					}
				}, false );
	};
})( jQuery );