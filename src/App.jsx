import React, { useEffect, useRef, useState } from "react";
import Garuda from "./assets/garuda-pancasila.svg";

const TVCanvas = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null); // Ref to store the image
  const [imageLoaded, setImageLoaded] = useState(false);

  const scaleFactor = 10; // Noise size
  const sampleCount = 10;
  const FPS = 50;
  const scanSpeed = FPS * 15; // 15 seconds from top to bottom
  let samples = [];
  let sampleIndex = 0;
  let scanOffsetY = 0;
  let scanSize = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Create and load the image
    const img = new Image();
    img.src = Garuda;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };

    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      canvas.width = innerWidth;
      canvas.height = innerHeight;

      scanOffsetY = 0;

      samples = [];
      for (let i = 0; i < sampleCount; i++) {
        samples.push(generateRandomSample(context, canvas.width, canvas.height));
      }
    };

    const generateRandomSample = (context, w, h) => {
      const imageData = context.createImageData(w, h);
      const numStars = Math.floor((w * h) / 60); // Number of noise points (stars)
      
      // Initialize the image data to blue #04047b
      const backgroundColor = { r: 4, g: 4, b: 123 };
      for (let i = 0; i < w * h; i++) {
        const k = i * 4;
        imageData.data[k] = backgroundColor.r; // Red channel
        imageData.data[k + 1] = backgroundColor.g; // Green channel
        imageData.data[k + 2] = backgroundColor.b; // Blue channel
        imageData.data[k + 3] = 255; // Full opacity
      }
    
      // Add sparse noise points (stars) with white color
      for (let i = 0; i < numStars; i++) {
        const x = Math.floor(Math.random() * w);
        const y = Math.floor(Math.random() * h);
        const k = (y * w + x) * 4;
        const intensity = Math.floor(255 * Math.random()); // Light intensity
        imageData.data[k] = intensity; // Red channel with random intensity
        imageData.data[k + 1] = intensity; // Green channel with random intensity
        imageData.data[k + 2] = intensity; // Blue channel with random intensity
        imageData.data[k + 3] = 255; // Full opacity
      }
    
      return imageData;
    };
    
    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before each render
    
      // Draw the background color
      context.fillStyle = "#150DF7"; // Blue color
      context.fillRect(0, 0, canvas.width, canvas.height);
    
      // Draw the noise
      context.putImageData(samples[Math.floor(sampleIndex)], 0, 0);
      sampleIndex += 20 / FPS;
      if (sampleIndex >= samples.length) sampleIndex = 0;
    
      // Draw the image if it is loaded
      if (imageLoaded && imageRef.current) {
        const img = imageRef.current;
        const imgWidth = img.width - (1080 * 2);
        const imgHeight = img.height - (1080 * 2);
        const x = (canvas.width - imgWidth) / 2;
        const y = (canvas.height - imgHeight) / 2;
        context.drawImage(img, x, y, imgWidth, imgHeight);


      // Add text on Top Image
      context.font = "bold 30px Arial";
      context.fillStyle = "#ffffff";
      context.textAlign = "center";
      context.fillText("Peringatan Darurat", canvas.width / 2,  ((canvas.height - imgHeight) / 2) - 40) ;
    
        // Add text in bottom center
        context.font = "bold 30px Arial";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.fillText("Untuk Seluruh", canvas.width / 2, ((canvas.height + imgHeight) / 2) + 80);
        context.fillText("Masyarakat Indonesia", canvas.width / 2, ((canvas.height + imgHeight) / 2) + 120);

      }
    
      requestAnimationFrame(render);
    };    

    window.addEventListener("resize", handleResize);
    handleResize();
    requestAnimationFrame(render);

    // Disable scrolling
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto"; // Re-enable scrolling on cleanup
    };
  }, [imageLoaded]); // Dependency array ensures image load state is considered

  return <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh", display: "block" }} />;
};

export default TVCanvas;
