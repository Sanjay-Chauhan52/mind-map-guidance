import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download, BookOpen } from "lucide-react";

const streamInfo = {
  pcm: {
    name: "Science (PCM)",
    description: "Physics, Chemistry & Mathematics",
    careers: ["Engineering", "Architecture", "Computer Science", "Research Scientist"],
    color: "bg-blue-500"
  },
  pcb: {
    name: "Science (PCB)",
    description: "Physics, Chemistry & Biology",
    careers: ["Medicine", "Pharmacy", "Biotechnology", "Nursing", "Veterinary"],
    color: "bg-green-500"
  },
  commerce: {
    name: "Commerce",
    description: "Business & Economics",
    careers: ["CA/CS", "Banking", "Business Management", "Economics"],
    color: "bg-purple-500"
  },
  arts: {
    name: "Arts/Humanities",
    description: "Literature & Social Sciences",
    careers: ["Teaching", "Law", "Psychology", "Journalism", "Social Work"],
    color: "bg-orange-500"
  }
};

interface StreamResults {
  pcm: number;
  pcb: number;
  commerce: number;
  arts: number;
}

const ResultsClass10 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { results }: { results: StreamResults } = location.state || { 
    results: { pcm: 2, pcb: 1, commerce: 1, arts: 1 } 
  };

  // Calculate percentages
  const total = Object.values(results).reduce((sum, score) => sum + score, 0);
  const percentages = Object.entries(results).map(([stream, score]) => ({
    stream,
    score,
    percentage: total > 0 ? Math.round((score / total) * 100) : 0,
    ...streamInfo[stream as keyof typeof streamInfo]
  })).sort((a, b) => b.score - a.score);

  const topStream = percentages[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Your Stream Assessment Results</h1>
          <p className="text-muted-foreground">Based on your aptitude and interests</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Top Recommendation */}
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${topStream.color}`}></div>
                <div>
                  <CardTitle className="text-2xl text-primary">
                    Recommended Stream: {topStream.name}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {topStream.description} - {topStream.percentage}% match
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Based on your responses, you show strong aptitude for {topStream.name}. 
                This stream aligns well with your interests and career aspirations.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Potential Career Paths:</h4>
                <div className="flex flex-wrap gap-2">
                  {topStream.careers.map((career, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Results */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Assessment Breakdown</CardTitle>
              <CardDescription>
                Your compatibility with different academic streams
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {percentages.map((item, index) => (
                <div key={item.stream} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      {item.percentage}%
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-3" />
                  <div className="flex flex-wrap gap-1">
                    {item.careers.map((career, careerIndex) => (
                      <span key={careerIndex} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate('/colleges')} size="lg" className="flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              Explore Colleges & Courses
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/quiz/class10')} 
              size="lg"
            >
              Retake Assessment
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsClass10;