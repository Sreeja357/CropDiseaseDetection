import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Camera, Upload, X, Scan, ImageIcon, RotateCcw } from "lucide-react";

const CameraUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setSelectedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };



  const handleDetect = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image",
        description: "Please capture or upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Convert base64 image to file
      const res = await fetch(selectedImage);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");
      const response = await fetch("https://cropdiseasedetection-wumd.onrender.com/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Store both image + result
      sessionStorage.setItem("detectionImage", selectedImage);
      sessionStorage.setItem("prediction", data.prediction);
      sessionStorage.setItem("confidence", String(data.confidence));
      sessionStorage.setItem("severity", data.severity);
      sessionStorage.setItem("description", data.description);
      sessionStorage.setItem("symptoms", JSON.stringify(data.symptoms));
      sessionStorage.setItem("pesticides", JSON.stringify(data.pesticides));
      setIsAnalyzing(false);
      navigate("/results");
    } catch (error) {
      console.error("Error:", error);
      setIsAnalyzing(false);
      toast({
        title: "Detection Failed",
        description: "Could not connect to the detection server. Please make sure the backend is running.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">
              Capture or Upload Image
            </h1>
            <p className="text-muted-foreground">
              Take a photo of the affected leaf or upload an existing image for analysis
            </p>
          </div>

          <Card className="shadow-card overflow-hidden">
            <CardContent className="p-6">
              {/* Image Preview Area */}
              <div className="relative aspect-[4/3] bg-secondary/50 rounded-xl overflow-hidden mb-6 border-2 border-dashed border-border">
                {isCapturing ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : selectedImage ? (
                  <>
                    <img
                      src={selectedImage}
                      alt="Selected leaf"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-3 right-3 w-10 h-10 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No image selected</p>
                    <p className="text-sm">Capture or upload a leaf image</p>
                  </div>
                )}

                {/* Scanning overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-foreground/80 flex flex-col items-center justify-center">
                    <div className="relative">
                      <Scan className="w-20 h-20 text-primary animate-pulse" />
                      <div className="absolute inset-0 border-2 border-primary rounded-lg animate-ping opacity-50" />
                    </div>
                    <p className="text-primary-foreground mt-4 font-medium">
                      Analyzing image...
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {isCapturing ? (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={stopCamera}
                      className="w-full"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="lg"
                      onClick={captureImage}
                      className="w-full"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capture
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={startCamera}
                      className="w-full"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Open Camera
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Image
                    </Button>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Detect Button */}
              <Button
                size="xl"
                onClick={handleDetect}
                disabled={!selectedImage || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5 mr-2" />
                    Detect Disease
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <div className="mt-8 p-6 bg-secondary/30 rounded-xl">
            <h3 className="font-display font-semibold text-foreground mb-3">
              Tips for Best Results
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Ensure good lighting when capturing the image
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Focus on the affected area of the leaf
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Keep the camera steady to avoid blurry images
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Include both healthy and affected parts if possible
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CameraUpload;
