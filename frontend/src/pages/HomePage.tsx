import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/components/FeatureCard";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  Shield,
  Clock,
  FileCheck,
  Link2,
  ArrowRight,
  Fingerprint,
  Database,
} from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: "Immutable Records",
      description:
        "All submissions are permanently stored on the Ethereum blockchain, ensuring complete transparency and data integrity.",
    },
    {
      icon: Clock,
      title: "Timestamped Submissions",
      description:
        "Every submission is automatically timestamped by the blockchain, proving exactly when work was submitted.",
    },
    {
      icon: Fingerprint,
      title: "File Integrity",
      description:
        "SHA-256 file hashing ensures submitted files cannot be tampered with after submission.",
    },
    {
      icon: Database,
      title: "Decentralized Storage",
      description:
        "No central authority controls the data. Records are distributed across the blockchain network.",
    },
  ];

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <StatusBadge variant="info" className="mb-6 mx-auto">
              <Link2 className="w-3 h-3" />
              University Blockchain Project
            </StatusBadge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Secure Assignment <span className="">Submissions</span> on
              Blockchain
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              A decentralized platform for submitting and verifying academic
              assignments using Ethereum smart contracts. Ensuring transparency,
              integrity, and immutability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="gradient-primary text-primary-foreground border-0 shadow-lg hover:shadow-xl transition-shadow px-8"
              >
                <Link to="/student">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Student Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="shadow-card hover:shadow-md transition-shadow px-8"
              >
                <Link to="/teacher">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Teacher Portal
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />
      </section>

      <section className="py-16 sm:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Blockchain for Assignments?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Traditional submission systems can be manipulated. Our
              blockchain-based solution provides cryptographic proof of
              submission authenticity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple three-step process to submit and verify assignments on the
              blockchain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: FileCheck,
                title: "Upload Assignment",
                description:
                  "Select your file and the system generates a unique SHA-256 hash fingerprint.",
              },
              {
                step: "02",
                icon: Link2,
                title: "Submit to Blockchain",
                description:
                  "Your submission hash is recorded on Ethereum with an immutable timestamp.",
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Verify Anytime",
                description:
                  "Anyone can verify the submission authenticity using the file hash.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="relative border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden group hover:shadow-card-hover transition-all"
              >
                <CardContent className="p-6 pt-8">
                  <span className="absolute top-4 right-4 text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5 shadow-md">
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/student" className="group">
              <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-card-hover transition-all">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <GraduationCap className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Student Portal
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Submit your assignments securely to the blockchain
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/teacher" className="group">
              <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-card-hover transition-all">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <BookOpen className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Teacher Portal
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Manage deadlines and view submission history
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/verify" className="group">
              <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-card-hover transition-all">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <CheckCircle className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Verification
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Verify submission integrity using file hash
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
