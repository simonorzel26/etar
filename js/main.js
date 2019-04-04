window.onload = () => {
    document.querySelector( 'button' ).addEventListener( 'click', () => {
        
        function makeDistortionCurve(amount) {
            var k = typeof amount === 'number' ? amount : 50,
                n_samples = 44100,
                curve = new Float32Array(n_samples),
                deg = Math.PI / 180,
                i = 0,
                x;
            for ( ; i < n_samples; ++i ) {
                x = i * 2 / n_samples - 1;
                curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
            }
            return curve;
        };
    
        let ctx = new AudioContext() || new webkitAudioContext();
        
        let distortion = ctx.createWaveShaper();
        distortion.curve = makeDistortionCurve(400);
        
        
        navigator.webkitGetUserMedia({audio: true}, success, err);
        
        function success( stream ) {
        let src = ctx.createMediaStreamSource(stream);
    
        src.connect(distortion);
        src.connect(ctx.destination);
        }
        
        function err( e ) {
        console.log(e);
        }
    } );
};

