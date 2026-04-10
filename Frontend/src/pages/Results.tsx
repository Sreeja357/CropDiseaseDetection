import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  AlertTriangle,
  Bug,
  Camera,
  CheckCircle2,
  Download,
  Leaf,
  FlaskConical,
  Info,
  ArrowLeft,
} from "lucide-react";

// Prevention tips based on crop type
const preventionTips: Record<string, string[]> = {
  Maize: [
    "Use certified disease-free seeds",
    "Practice crop rotation with non-cereal crops",
    "Remove and destroy infected plant debris",
    "Maintain proper plant spacing for air circulation",
    "Apply preventive treatments during early growth stages",
  ],
  Cassava: [
    "Use healthy, disease-free planting material",
    "Remove and burn infected plant parts",
    "Practice crop rotation",
    "Control insect vectors like whiteflies",
    "Use resistant cassava varieties when available",
  ],
  Tomato: [
    "Remove and destroy infected plant parts",
    "Improve air circulation between plants",
    "Avoid overhead irrigation",
    "Use disease-resistant varieties",
    "Apply preventive fungicides before disease appears",
  ],
  Cashew: [
    "Prune and destroy infected branches",
    "Maintain proper orchard hygiene",
    "Apply wound dressing after pruning",
    "Ensure good drainage around trees",
    "Use preventive sprays before monsoon season",
  ],
  default: [
    "Remove and destroy infected plant parts",
    "Improve air circulation between plants",
    "Avoid overhead irrigation",
    "Use disease-resistant varieties",
    "Apply preventive treatments before disease appears",
  ],
};

const getPreventionTips = (prediction: string | null): string[] => {
  if (!prediction) return preventionTips.default;
  if (prediction.toLowerCase().includes("healthy")) {
    return [
      "Continue regular monitoring of your crops",
      "Maintain balanced fertilization",
      "Ensure proper irrigation practices",
      "Keep the field free of weeds",
      "Practice crop rotation for soil health",
    ];
  }
  for (const crop of ["Maize", "Cassava", "Tomato", "Cashew"]) {
    if (prediction.toLowerCase().startsWith(crop.toLowerCase())) {
      return preventionTips[crop];
    }
  }
  return preventionTips.default;
};

const Results = () => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [detectionImage, setDetectionImage] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [pesticides, setPesticides] = useState<any[]>([]);

  useEffect(() => {
    const storedImage = sessionStorage.getItem("detectionImage");
    const storedPrediction = sessionStorage.getItem("prediction");
    const storedConfidence = sessionStorage.getItem("confidence");
    const storedSeverity = sessionStorage.getItem("severity");
    const storedDescription = sessionStorage.getItem("description");
    const storedSymptoms = sessionStorage.getItem("symptoms");
    const storedPesticides = sessionStorage.getItem("pesticides");

    if (storedImage) setDetectionImage(storedImage);
    if (storedPrediction) setPrediction(storedPrediction);
    if (storedConfidence) setConfidence(parseFloat(storedConfidence));
    if (storedSeverity) setSeverity(storedSeverity);
    if (storedDescription) setDescription(storedDescription);
    if (storedSymptoms) setSymptoms(JSON.parse(storedSymptoms));
    if (storedPesticides) setPesticides(JSON.parse(storedPesticides));
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "none":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "low":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "moderate":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "severe":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "";
    }
  };

  const isHealthy = prediction?.toLowerCase().includes("healthy");

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 16;
    const contentW = pageW - margin * 2;
    let y = 20;

    const checkNewPage = (neededHeight: number) => {
      if (y + neededHeight > 275) {
        doc.addPage();
        y = 20;
      }
    };

    // ── Header banner ──
    doc.setFillColor(34, 139, 34);
    doc.rect(0, 0, pageW, 40, "F");
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Smart Crop Detector", margin, 18);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("AI-Powered Crop Disease Detection Report", margin, 30);
    y = 52;

    // ── Date ──
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 10;

    // ── Section: Detection Result ──
    doc.setFillColor(240, 248, 240);
    doc.roundedRect(margin, y, contentW, 38, 3, 3, "F");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 90, 30);
    doc.text(prediction || "Unknown", margin + 4, y + 10);

    // Severity badge
    const sevColor: Record<string, [number, number, number]> = {
      none:     [34, 139, 34],
      low:      [34, 139, 34],
      moderate: [200, 150, 0],
      high:     [200, 80, 0],
      severe:   [180, 0, 0],
    };
    const [sr, sg, sb] = sevColor[severity.toLowerCase()] ?? [100, 100, 100];
    doc.setFillColor(sr, sg, sb);
    const sevLabel = severity === "None" ? "Healthy" : `${severity} Severity`;
    const sevW = doc.getTextWidth(sevLabel) + 8;
    doc.roundedRect(margin + 4, y + 15, sevW, 8, 2, 2, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(sevLabel, margin + 8, y + 21);

    // Confidence
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`Confidence: ${confidence}%`, margin + 4, y + 33);
    y += 46;

    // ── Section: Description ──
    if (description) {
      checkNewPage(30);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 100, 34);
      doc.text(isHealthy ? "Plant Status" : "About This Disease", margin, y);
      y += 6;
      doc.setDrawColor(34, 139, 34);
      doc.setLineWidth(0.4);
      doc.line(margin, y, margin + contentW, y);
      y += 5;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(description, contentW);
      checkNewPage(descLines.length * 5 + 4);
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 8;
    }

    // ── Section: Symptoms ──
    if (symptoms.length > 0) {
      checkNewPage(20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 100, 34);
      doc.text(isHealthy ? "Observations" : "Symptoms", margin, y);
      y += 6;
      doc.setDrawColor(34, 139, 34);
      doc.line(margin, y, margin + contentW, y);
      y += 5;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      symptoms.forEach((s) => {
        checkNewPage(7);
        doc.text(`•  ${s}`, margin + 3, y);
        y += 6;
      });
      y += 4;
    }

    // ── Section: Pesticides Table ──
    if (pesticides.length > 0) {
      checkNewPage(20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 100, 34);
      doc.text("Suggested Pesticides", margin, y);
      y += 6;
      doc.setDrawColor(34, 139, 34);
      doc.line(margin, y, margin + contentW, y);
      y += 5;

      pesticides.forEach((p, i) => {
        checkNewPage(28);
        // Row background
        doc.setFillColor(i % 2 === 0 ? 245 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 245 : 255);
        doc.rect(margin, y - 3, contentW, 24, "F");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 70, 30);
        doc.text(p.name, margin + 3, y + 4);
        // Type badge
        doc.setFillColor(220, 240, 220);
        const typeW = doc.getTextWidth(p.type) + 6;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(34, 100, 34);
        doc.text(p.type, pageW - margin - typeW + 1, y + 4);
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(`Dosage: ${p.dosage}`, margin + 3, y + 11);
        const appLines = doc.splitTextToSize(`Application: ${p.application}`, contentW - 6);
        doc.text(appLines, margin + 3, y + 17);
        y += 26;
      });
      y += 4;
    }

    // ── Section: Prevention Tips ──
    const tips = getPreventionTips(prediction);
    if (tips.length > 0) {
      checkNewPage(20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 100, 34);
      doc.text(isHealthy ? "Maintenance Tips" : "Prevention Tips", margin, y);
      y += 6;
      doc.setDrawColor(34, 139, 34);
      doc.line(margin, y, margin + contentW, y);
      y += 5;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      tips.forEach((t) => {
        checkNewPage(7);
        doc.text(`✓  ${t}`, margin + 3, y);
        y += 6;
      });
    }

    // ── Footer ──
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Smart Crop Detector  |  Page ${i} of ${pageCount}`,
        pageW / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: "center" }
      );
    }

    doc.save("crop_disease_report.pdf");
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Detection Results
              </h1>
              <p className="text-muted-foreground">
                AI analysis of your crop image
              </p>
            </div>
            <Link to="/camera-upload">
              <Button variant="outline">
                <Camera className="w-4 h-4 mr-2" />
                New Scan
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Image Preview */}
            <div className="lg:col-span-1">
              <Card className="shadow-card overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-lg">Analyzed Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square rounded-lg overflow-hidden bg-secondary/50">
                    {detectionImage ? (
                      <img
                        src={detectionImage}
                        alt="Analyzed leaf"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Leaf className="w-12 h-12 opacity-50" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Detection Status */}
              <Card className={`shadow-card border-l-4 ${isHealthy ? "border-l-green-500" : "border-l-primary"}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isHealthy ? "bg-green-500/10" : "bg-primary/10"}`}>
                      {isHealthy ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Bug className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h2 className="font-display text-2xl font-bold text-foreground">
                          {prediction || "No prediction available"}
                        </h2>
                        {severity && (
                          <Badge
                            className={getSeverityColor(severity)}
                            variant="outline"
                          >
                            {severity === "None" ? "Healthy" : `${severity} Severity`}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          {confidence}% Confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              {description && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-display text-lg flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      {isHealthy ? "Plant Status" : "About This Disease"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {description}
                    </p>

                    {symptoms.length > 0 && (
                      <>
                        <Separator className="my-4" />

                        <h4 className="font-display font-semibold text-foreground mb-3">
                          {isHealthy ? "Observations" : "Common Symptoms"}
                        </h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {symptoms.map((symptom, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              {isHealthy ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              )}
                              <span className="text-muted-foreground">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Suggested Pesticides */}
              {pesticides.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="font-display text-lg flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-primary" />
                      Suggested Pesticides
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pesticides.map((pesticide, index) => (
                        <div
                          key={index}
                          className="p-4 bg-secondary/30 rounded-lg border border-border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">
                              {pesticide.name}
                            </h4>
                            <Badge variant="secondary">{pesticide.type}</Badge>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Dosage: </span>
                              <span className="text-foreground">{pesticide.dosage}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Application: </span>
                              <span className="text-foreground">{pesticide.application}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Prevention Tips */}
              <Card className="shadow-card bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-primary" />
                    {isHealthy ? "Maintenance Tips" : "Prevention Tips"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {getPreventionTips(prediction).map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/camera-upload" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Scan Another
                  </Button>
                </Link>
                <Button size="lg" className="flex-1" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Results;