function getBrowserInfo() {
    const ua = navigator.userAgent;
    const browserData = {
        name: '',
        version: '',
        engine: '',
        os: ''
    };

    if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) {
        browserData.name = 'Google Chrome';
        browserData.version = ua.match(/Chrome\/(\d+\.\d+)/)[1];
    } else if(ua.indexOf("Firefox") > -1) {
        browserData.name = 'Mozilla Firefox';
        browserData.version = ua.match(/Firefox\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
        browserData.name = 'Safari';
        browserData.version = ua.match(/Version\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("Edg") > -1) {
        browserData.name = 'Microsoft Edge';
        browserData.version = ua.match(/Edg\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) {
        browserData.name = 'Internet Explorer';
        browserData.version = ua.match(/OPR\/(\d+\.\d+)/)[1];
    }

    if (ua.includes('Gecko')) browserData.engine = 'Gecko';
    else if (ua.includes('WebKit')) browserData.engine = 'WebKit';
    else if (ua.includes('Trident')) browserData.engine = 'Trident';

    if (ua.includes('Windows')) browserData.os = 'Windows';
    else if (ua.includes('Mac')) browserData.os = 'macOS';
    else if (ua.includes('Linux')) browserData.os = 'Linux';
    else if (ua.includes('Android')) browserData.os = 'Android';
    else if (ua.includes('iOS')) browserData.os = 'iOS';

    return browserData;
}

function displayMainInfo() {
    const info = getBrowserInfo();
    const features = detectFeatures();
    const mainInfo = document.getElementById('mainInfo');
    
    mainInfo.innerHTML = `
        <div class="info-item">
            <h3>Böngésző</h3>
            <p>${info.name} ${info.version}</p>
        </div>
        <div class="info-item">
            <h3>Motor</h3>
            <p>${info.engine}</p>
        </div>
        <div class="info-item">
            <h3>Operációs Rendszer</h3>
            <p>${info.os}</p>
        </div>
        <div class="info-item">
            <h3>Képernyő Felbontás</h3>
            <p>${window.screen.width}x${window.screen.height}</p>
        </div>
    `;
}

function detectFeatures() {
    const features = {
        webgl: !!window.WebGLRenderingContext,
        canvas: !!window.CanvasRenderingContext2D,
        webrtc: !!window.RTCPeerConnection,
        websocket: !!window.WebSocket,
        webworker: !!window.Worker,
        geolocation: !!navigator.geolocation,
        touch: !!('ontouchstart' in window),
        css3: checkCSS3Support()
    };

    displayFeatures(features);
    return features;
}

function checkCSS3Support() {
    const el = document.createElement('div');
    const transforms = {
        'transform': 'transform',
        'WebkitTransform': '-webkit-transform',
        'MozTransform': '-moz-transform',
        'OTransform': '-o-transform',
        'msTransform': '-ms-transform'
    };

    for (let t in transforms) {
        if (el.style[t] !== undefined) {
            return true;
        }
    }
    return false;
}

function displayFeatures(features) {
    const compatibility = document.getElementById('compatibility');
    let html = '';

    for (let feature in features) {
        const support = features[feature];
        html += `
            <div>
                <h3>${formatFeatureName(feature)}</h3>
                <div class="progress-bar">
                    <div class="progress" style="width: ${support ? '100%' : '0%'}"></div>
                </div>
            </div>
        `;
    }

    compatibility.innerHTML = html;
}

function formatFeatureName(name) {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace('3', ' 3')
        .replace('gl', 'GL')
        .replace('rtc', 'RTC');
}

function runPerformanceTest() {
    const perfDiv = document.getElementById('performance');
    perfDiv.innerHTML = '<div class="loading"></div>';

    setTimeout(() => {
        const start = performance.now();
        let result = 0;
        
        for(let i = 0; i < 1000000; i++) {
            result += Math.sqrt(i);
        }

        const end = performance.now();
        const duration = (end - start).toFixed(2);

        perfDiv.innerHTML = `
            <div class="info-item">
                <h3>Teszt Eredmény</h3>
                <p>Művelet időtartama: ${duration}ms</p>
                <p>Teljesítmény értékelés: ${evaluatePerformance(duration)}</p>
            </div>
        `;
    }, 100);
}

function evaluatePerformance(duration) {
    if (duration < 50) return 'Kiváló';
    if (duration < 100) return 'Nagyon jó';
    if (duration < 200) return 'Jó';
    if (duration < 500) return 'Átlagos';
    return 'Fejlesztésre szorul';
}

function createStatsChart() {
    const ctx = document.getElementById('statsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Chrome', 'Safari', 'Edge', 'Firefox', 'Opera'],
            datasets: [{
                label: 'Globális Böngészőhasználat (%)',
                data: [65, 18, 5, 2, 2],
                backgroundColor: [
                    'rgba(255, 235, 167, 0.8)',
                    'rgba(255, 235, 167, 0.6)',
                    'rgba(255, 235, 167, 0.4)',
                    'rgba(255, 235, 167, 0.3)',
                    'rgba(255, 235, 167, 0.2)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#c4c3ca'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#c4c3ca'
                    }
                },
                x: {
                    ticks: {
                        color: '#c4c3ca'
                    }
                }
            }
        }
    });
}

window.onload = () => {
    displayMainInfo();
    detectFeatures();
    createStatsChart();
};