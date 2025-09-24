import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, TrendingUp, Briefcase, Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">EduGuide</h1>
          </div>
          <p className="text-muted-foreground mt-2 text-lg">Your Digital Academic & Career Guidance Platform</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Make Informed Academic Decisions
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Discover your ideal academic path with our AI-powered aptitude assessments, 
          personalized career guidance, job opportunities, and latest education news.
        </p>
        
        {/* Main Action Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="shadow-elegant hover:shadow-xl transition-all duration-300 border-primary/20" 
                onClick={() => navigate('/quiz/class10')}>
            <CardHeader>
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-2">Class 10 Students</CardTitle>
              <CardDescription className="text-lg">
                Discover your ideal stream for 11th & 12th grade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-8 text-lg">
                Take our comprehensive 15-question aptitude test to find the perfect stream: 
                Science (PCM/PCB), Commerce, or Arts based on your interests and abilities.
              </p>
              <Button size="lg" className="w-full h-12 text-lg bg-gradient-primary hover:opacity-90 transition-opacity">
                Start Stream Assessment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/jobs')}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
              <CardTitle className="text-xl">Job Opportunities</CardTitle>
              <CardDescription>
                Explore internships and entry-level positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find relevant job opportunities and internships based on your stream and interests.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/news')}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-accent flex items-center justify-center">
                  <Newspaper className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
              <CardTitle className="text-xl">Education News</CardTitle>
              <CardDescription>
                Stay updated with latest education trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get the latest news on education policies, career opportunities, and academic trends.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card/50 py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-16 text-foreground">
            Platform Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">AI-Powered Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced 15-question aptitude and interest analysis using AI to provide 
                  accurate stream recommendations with detailed visualization.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">Visual Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interactive pie charts and graphs showing your suitability across 
                  different streams with personalized recommendations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl">College Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive information about government and private colleges, courses, 
                  fees, and admission requirements.
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