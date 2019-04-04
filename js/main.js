window.onload = () => {
    document.querySelector( 'button' ).addEventListener( 'click', () => {
        
        let ctx = new AudioContext() || new webkitAudioContext();
        
        navigator.webkitGetUserMedia({audio: true}, success, err);
        
        function success( stream ) {
        let src = ctx.createMediaStreamSource(stream);
        src.connect(ctx.destination);
        }
        
        function err( e ) {
        console.log(e);
        }
    } );
};

