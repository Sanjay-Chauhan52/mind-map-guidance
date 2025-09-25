import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, TrendingUp, Briefcase, Newspaper, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, hasProfile, isAuthenticated } = useProfile();

  const handleQuizClick = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (!hasProfile) {
      navigate('/profile');
      return;
    }
    
    // If user has profile, redirect based on their class
    if (profile?.current_class === "10th") {
      navigate('/quiz/class10');
    } else {
      navigate('/colleges');
    }
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">EduGuide</h1>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated && profile && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>Welcome, {profile.name}</span>
                </div>
              )}
              <Button 
                variant="outline" 
                onClick={handleAuthAction}
                className="border-primary/20 hover:bg-primary/10"
              >
                {isAuthenticated ? 'Sign Out' : 'Login / Sign Up'}
              </Button>
            </div>
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
        
        {/* Main Action Card - Smaller Size */}
        <div className="max-w-xl mx-auto mb-12">
          <Card className="shadow-elegant hover:shadow-xl transition-all duration-300 border-primary/20 cursor-pointer" 
                onClick={handleQuizClick}>
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-2">
                {isAuthenticated && profile ? 
                  (profile.current_class === "10th" ? "Class 10 Student" : "Class 12 Student") :
                  "Class 10 Students"
                }
              </CardTitle>
              <CardDescription className="text-base">
                {isAuthenticated && profile ?
                  (profile.current_class === "10th" ? 
                    "Discover your ideal stream for 11th & 12th grade" :
                    "Find the perfect college for your career path"
                  ) :
                  "Discover your ideal stream for 11th & 12th grade"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-6">
                {isAuthenticated && profile ?
                  (profile.current_class === "10th" ? 
                    "Take our comprehensive aptitude test to find the perfect stream: Science (PCM/PCB), Commerce, or Arts." :
                    "Explore college recommendations based on your stream, location, and career interests."
                  ) :
                  "Take our comprehensive 15-question aptitude test to find the perfect stream: Science (PCM/PCB), Commerce, or Arts."
                }
              </p>
              <Button size="lg" className="w-full h-12 text-lg bg-gradient-primary hover:opacity-90 transition-opacity">
                {!isAuthenticated ? "Sign In to Start" :
                  !hasProfile ? "Create Profile" :
                  profile?.current_class === "10th" ? "Start Stream Assessment" : "Explore Colleges"
                }
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Colleges & Courses Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-8 text-foreground">
            Explore Education Options
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Colleges Card */}
            <Card className="shadow-soft hover:shadow-elegant transition-all duration-300 cursor-pointer" onClick={() => navigate('/colleges')}>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Browse Colleges</h4>
                  <p className="text-muted-foreground mb-4">
                    Discover top government and private colleges with detailed information
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Government Colleges:</span>
                      <span className="font-medium">200+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Private Colleges:</span>
                      <span className="font-medium">300+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cities Covered:</span>
                      <span className="font-medium">Chennai</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90">
                    View All Colleges
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Courses Card */}
            <Card className="shadow-soft hover:shadow-elegant transition-all duration-300 cursor-pointer" onClick={() => navigate('/courses')}>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Explore Courses</h4>
                  <p className="text-muted-foreground mb-4">
                    Find the perfect course across different streams and specializations
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Engineering Courses:</span>
                      <span className="font-medium">50+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical Courses:</span>
                      <span className="font-medium">30+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Streams:</span>
                      <span className="font-medium">100+</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-accent hover:opacity-90">
                    Browse Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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