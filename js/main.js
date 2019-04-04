window.onload = () => {
    
    let effectStack = {
        distortion: true
    };
    
    const easeInQuad = ( t ) => { return t*t };
    
    const getFilterVal = ( range ) => {
        let maxValMultiple = 22050;
        let easedRange = easeInQuad( range );
        return maxValMultiple * easedRange;
    };
    
    const enableStream = () => {
    
        const distortionPedal = ( src ) => {
            
            let gain = 0.95,
                dist = 0,
                tone = 1,
                gainRange = document.querySelector( '#gainRange' ),
                distRange = document.querySelector( '#distRange' ),
                toneRange = document.querySelector( '#toneRange' );
            
            gainRange.addEventListener('input', () => {
                gain = easeInQuad(parseInt(gainRange.value, 10) / 100 );
                gainNode.gain.value = gain;
                console.log( gain );
            });
            
            distRange.addEventListener('input', () => {
                dist = parseInt(distRange.value, 10) * 5;
                distNode.curve = makeDistortionCurve(dist);
            });
            
            toneRange.addEventListener('input', () => {
                tone = parseInt(toneRange.value, 10) / 100;
                biquadFilter.frequency.value = getFilterVal(tone);
            });
        
            const makeDistortionCurve = ( amount ) => {
                let k = typeof amount === 'number' ? amount : 50,
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
        
            let gainNode = ctx.createGain();
            gainNode.gain.value = gain;
        
            let distNode = ctx.createWaveShaper();
            distNode.curve = makeDistortionCurve(dist);
            
            let biquadFilter = ctx.createBiquadFilter('lowpass');
            biquadFilter.frequency.value = getFilterVal(tone);
            
        
            return src.connect(gainNode).connect(distNode).connect(biquadFilter);
        
        };
        
        const addEffectStack = ( src ) => {
            let srcWithEffects = src;
        
            if ( effectStack.distortion ) {
                srcWithEffects = distortionPedal( srcWithEffects );
            }
        
            return srcWithEffects;
        };
    
        const success = ( stream ) => {
            let src = ctx.createMediaStreamSource(stream),
                effectStack = addEffectStack( src );
            
            effectStack.connect(ctx.destination);
        };
    
        const err = ( e ) => {
            console.log(e);
        };
    
        let ctx = new AudioContext() || new webkitAudioContext();
    
        navigator.webkitGetUserMedia({audio: true}, success, err);
        
    };
    
    document.querySelector( '#enableBtn' ).addEventListener( 'click', enableStream );
};

