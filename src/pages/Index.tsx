import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">EduGuide</h1>
          </div>
          <p className="text-muted-foreground mt-2">Your Digital Academic & Career Guidance Platform</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4 text-foreground">
          Make Informed Academic Decisions
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover your ideal academic path with our AI-powered aptitude assessments 
          and personalized career guidance for Class 10 & 12 students.
        </p>
        
        {/* Student Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => navigate('/quiz/class10')}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Class 10 Students</CardTitle>
              <CardDescription className="text-base">
                Discover your ideal stream for 11th & 12th grade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Take our comprehensive aptitude test to find the perfect stream: 
                Science (PCM/PCB), Commerce, or Arts based on your interests and abilities.
              </p>
              <Button size="lg" className="w-full">
                Start Stream Assessment
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/quiz/class12')}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Class 12 Students</CardTitle>
              <CardDescription className="text-base">
                Plan your college & career journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Explore degree programs in government colleges and get personalized 
                career recommendations based on your academic background.
              </p>
              <Button size="lg" className="w-full">
                Explore Career Paths
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Platform Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced aptitude and interest analysis using AI to provide 
                  accurate stream and career recommendations.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Visual Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interactive charts and graphs showing your suitability across 
                  different streams and career paths.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>College Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive information about government colleges, courses, 
                  and admission requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;