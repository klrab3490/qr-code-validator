"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const QrScanner = () => {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const qrCodeScannerRef = useRef<HTMLDivElement | null>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!qrCodeScannerRef.current) return;

    const html5QrCode = new Html5Qrcode("qr-scanner");
    setScanner(html5QrCode);

    return () => {
      // Cleanup the scanner on component unmount
      html5QrCode.stop().catch((err) => console.error("Error stopping QR code scanner.", err));
      html5QrCode.clear();
    };
  }, []);

  const startScanning = () => {
    if (!scanner) return;

    const config = {
      fps: 10, // Frames per second for scanning
      qrbox: { width: 250, height: 250 }, // Square scanning area
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], // Only QR Code
    };

    scanner
      .start(
        { facingMode: "environment" }, // Use rear camera
        config,
        (decodedText) => {
          console.log("QR Code detected:", decodedText);
          stopScanning(); // Optionally stop scanning after detection
          alert(`QR Code detected: ${decodedText}`);
          router.push(`/details/${decodedText}`); // Redirect to details page
        },
        (error) => {
          console.warn("QR Code scan error:", error);
        }
      )
      .then(() => setIsScanning(true))
      .catch((err) => {
        console.error("Unable to start scanning.", err);
      });
  };

  const stopScanning = () => {
    if (!scanner) return;

    scanner
      .stop()
      .then(() => setIsScanning(false))
      .catch((err) => console.error("Error stopping scanner:", err));
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] -mt-28">
      <h1 className="text-2xl font-semibold mb-6">QR Code Scanner</h1>
      <div id="qr-scanner" ref={qrCodeScannerRef} className="w-[250px] h-[250px] border-4 rounded-lg shadow-lg"></div>
      <div className="mt-6">
        {isScanning ? (
          <button onClick={stopScanning} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition">
            Stop Validation
          </button>
        ) : (
          <button onClick={startScanning} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition">
            Start Validation
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-4">
        {isScanning ? "Scanning in progress..." : "Click the button to start scanning."}
      </p>
    </div>
  );
};

export default QrScanner;
