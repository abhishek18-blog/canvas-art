
        const UPI_CONFIG = { name: 'Artisans Canvas' };

        document.addEventListener('DOMContentLoaded', () => {
            const nameDisplay = document.getElementById('payee-name-display');
            const safeName = UPI_CONFIG.name.trim();
            if (nameDisplay) nameDisplay.textContent = safeName;

            const modal = document.getElementById('payment-modal');
            const closeBtn = document.getElementById('close-payment-modal');
            const staticView = document.getElementById('static-qr-view');
            const cameraView = document.getElementById('camera-scanner-view');

            const activateScanBtn = document.getElementById('btn-activate-scanner');
            const cancelScanBtn = document.getElementById('btn-cancel-scan');
            const retryBtn = document.getElementById('btn-retry-permission');

            const downloadBtn = document.getElementById('btn-download-qr');
            const qrImage = document.getElementById('display-qr-code');

            const errorOverlay = document.getElementById('camera-error-overlay');
            const statusTextContainer = document.getElementById('scanner-status');
            const scanLine = document.getElementById('scan-line');

            let html5QrcodeScanner = null;
            let isScanning = false;

            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                stopScanner();
            });

            downloadBtn.addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = qrImage.src;
                link.download = 'payment-qr-code.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });

            activateScanBtn.addEventListener('click', () => {
                staticView.classList.add('hidden');
                cameraView.classList.remove('hidden');
                cameraView.classList.add('flex');

                if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
                    showError("Camera requires a Secure Connection (HTTPS).");
                    return;
                }
                startScanner();
            });

            cancelScanBtn.addEventListener('click', () => {
                stopScanner();
                resetView();
            });

            retryBtn.addEventListener('click', () => {
                errorOverlay.classList.add('hidden');
                updateStatus("Retrying... Please allow access.", "text-amber-400", true);
                startScanner();
            });

            function resetView() {
                cameraView.classList.add('hidden');
                cameraView.classList.remove('flex');
                staticView.classList.remove('hidden');
                errorOverlay.classList.add('hidden');
                updateStatus("Initializing camera...", "text-amber-400", true);
            }

            function updateStatus(text, colorClass, pulse = false) {
                statusTextContainer.innerHTML = `<p class="${colorClass} text-xs ${pulse ? 'animate-pulse' : ''}">${text}</p>`;
            }

            function showError(msg) {
                errorOverlay.classList.remove('hidden');
                if (msg) console.log(msg);
                updateStatus("Permission Error", "text-red-500");
            }

            function startScanner() {
                if (typeof Html5Qrcode === 'undefined') {
                    updateStatus("Error: Scanner library not loaded.", "text-red-500");
                    return;
                }

                html5QrcodeScanner = new Html5Qrcode("reader");

                const config = {
                    fps: 10,
                    qrbox: (w, h) => ({ width: Math.floor(Math.min(w, h) * 0.7), height: Math.floor(Math.min(w, h) * 0.7) }),
                    aspectRatio: 1.0
                };

                const constraints = { facingMode: "environment" };

                updateStatus("Please tap 'Allow' in the camera popup...", "text-amber-400", true);

                html5QrcodeScanner.start(constraints, config, onScanSuccess, onScanFailure)
                    .then(() => {
                        isScanning = true;
                        scanLine.classList.remove('hidden');
                        errorOverlay.classList.add('hidden');
                        updateStatus("Point camera at QR Code", "text-white");
                    }).catch(err => {
                        console.error("Camera start error:", err);
                        isScanning = false;
                        showError();
                    });
            }

            function stopScanner() {
                if (html5QrcodeScanner && isScanning) {
                    html5QrcodeScanner.stop().then(() => {
                        html5QrcodeScanner.clear();
                        isScanning = false;
                        scanLine.classList.add('hidden');
                    }).catch(console.error);
                }
            }

            function onScanSuccess(decodedText) {
                let safeLink = decodedText;
                try {
                    if (decodedText.toLowerCase().startsWith('upi://')) {
                        const urlObj = new URL(decodedText);
                        const params = new URLSearchParams(urlObj.search);
                        const cleanParams = new URLSearchParams();
                        if (params.has('pa')) cleanParams.append('pa', params.get('pa'));
                        if (params.has('pn')) cleanParams.append('pn', params.get('pn'));
                        if (params.has('am')) cleanParams.append('am', params.get('am'));
                        cleanParams.append('cu', 'INR');
                        cleanParams.append('mode', '00');
                        safeLink = `upi://pay?${cleanParams.toString()}`;
                    }
                } catch (e) {
                    console.log("Link parsing failed, using original.");
                }

                if (isScanning) {
                    updateStatus("✅ Scanned! Opening...", "text-green-400 font-bold");
                    stopScanner();
                }

                setTimeout(() => {
                    window.location.href = safeLink;
                }, 500);

                const btnHtml = `
                    <div class="mt-4 animate-bounce text-center w-full flex justify-center">
                        <a href="${safeLink}" class="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-6 rounded-full shadow-lg text-sm flex items-center gap-2">
                            <span>Tap to Open Link</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                    </div>
                `;

                if (isScanning) {
                    statusTextContainer.insertAdjacentHTML('beforeend', btnHtml);
                } else {
                    const staticContainer = document.getElementById('static-qr-view');
                    const existingBtn = staticContainer.querySelector('.animate-bounce');
                    if (existingBtn) existingBtn.remove();
                    staticContainer.insertAdjacentHTML('beforeend', btnHtml);
                }
            }

            function onScanFailure(error) {
                // Do nothing
            }
        });
    