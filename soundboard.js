/* soundboard.js v0.1 
 * 
 * Use one audio file with effects at different start/stop points
 * to limit http requests. Also, it's just kinda cool.
 *
 * (c) 2011 Dan Heberden
 *
 * config object:
 *    channels: how many channels to allocate (default 4)
 *    url: the url of the combined sound clip
 *    data: object with the playback data.
 *      every key is the sound name, which should contain 
 *      { start: theStartTimeInSeconds, end: theEndTimeInSeconds }
 *    extend: alternate extend function to use, e.g. dojo.mixin
 *       defaults to use jQuery or underscore
*/
(function( window ) {
    var defaults = {
            channels: 4
        },
        sb = function( config ) {
           return new sb.pt.init( config );
        };

    sb.pt = sb.prototype = {
        constructor: "SoundBoard",
        init: function( config ) {
            var extend = window.jQuery && window.jQuery.extend || 
                           window._ && window._.extend || config.extend,
                settings = this.settings = extend( {}, defaults, config ),
                channels = [],
                i = 0;
            // create the channels for this soundboard
            for( ; i < settings.channels; i++ ) {
                var chan = document.createElement( 'audio' );
                    chan.src = this.settings.url;
                channels[i] = {
                    element: chan,
                    playing: false
                }
            }  
            this.channels = channels;
            return this;
        },
        play: function( sound ) {
            var clip = this.settings.data[ sound ],
                i = 0;
            
            if ( !clip ) {
                return false;
            }

            // get an available channel
            while( i < this.channels.length ) {
                if ( !this.channels[i].playing ) {
                  var ch = this.channels[ i++ ];
                  ch.playing = true;
                  ch.element.currentTime = clip.start;
                  ch.element.play();
                  setTimeout( function() {
                    ch.element.pause();
                    ch.playing = false;
                  }, (clip.end - clip.start ) * 1000 );
                  break; // we played, dont try anymore
                }
            }
        },

    };

    // assign the prototype to to init's
    sb.pt.init.prototype = sb.pt;

    // assign SoundBoard to the global namespace
    window.SoundBoard = sb;
})( this );