import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Camera, Leaf, Shield, Zap, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "../assets/hero-farm.jpg";
import leafImage from "../assets/leaf-closeup.jpg";

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: "Capture or Upload",
      description: "Simply take a photo of the affected leaf or upload an existing image.",
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      description: "Our advanced AI instantly analyzes the image for pests and diseases.",
    },
    {
      icon: Shield,
      title: "Get Solutions",
      description: "Receive detailed diagnosis and recommended pesticides for treatment.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Lush green farmland at sunrise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6 animate-slide-up">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary-foreground">AI-Powered Detection</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up-delay-1">
              Smart Crop Detector
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 font-light animate-slide-up-delay-2">
              Smart farming through smart detection
            </p>

            <p className="text-lg text-primary-foreground/70 mb-10 max-w-2xl mx-auto animate-slide-up-delay-2">
              Upload a photo of your crop leaves and let our AI instantly identify pests, 
              diseases, and provide treatment recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-3">
              <Link to="/camera-upload">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Camera className="w-5 h-5" />
                  Start Detection
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Detect crop diseases in three simple steps using our AI-powered technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative bg-card rounded-2xl p-8 shadow-card border border-border hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-display font-bold text-lg shadow-glow">
                  {index + 1}
                </div>
                <div className="pt-4">
                  <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-card">
                <img
                  src={leafImage}
                  alt="Healthy crop leaf close-up"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -z-10 top-4 left-4 right-4 bottom-4 bg-primary/20 rounded-2xl" />
            </div>

            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Protect Your Crops with AI
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Smart Crop Detector uses advanced machine learning algorithms trained on 
                thousands of crop images to accurately identify pests and diseases affecting 
                your plants.
              </p>
              <ul className="space-y-4">
                {[
                  "Instant disease identification from leaf images",
                  "Detailed treatment and pesticide recommendations",
                  "Works with multiple crop varieties",
                  "Available for farmers, researchers, and students",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="inline-block mt-8">
                <Button size="lg">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Protect Your Crops?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers using Smart Crop Detector to identify and treat 
            crop diseases before they spread.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/camera-upload">
              <Button variant="hero-outline" size="xl">
                <Camera className="w-5 h-5" />
                Start Detection Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
// export default function Index() {
//   return <h1>Home Page Working 🚀</h1>;
// }