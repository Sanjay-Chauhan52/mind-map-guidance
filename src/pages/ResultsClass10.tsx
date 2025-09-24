import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ResultsClass10 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, answers } = location.state || {};
  const [colleges, setColleges] = useState<any[]>([]);

  useEffect(() => {
    // Load college data
    fetch('/data/colleges.csv')
      .then(response => response.text())
      .then(csvText => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj: any, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        }).filter(row => row.College);
        setColleges(data);
      })
      .catch(console.error);
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Results Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We couldn't find your quiz results. Please take the quiz again.
            </p>
            <Button onClick={() => navigate('/quiz/class10')} className="w-full bg-gradient-primary">
              Take Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate percentages and recommendations
  const totalAnswers = Object.keys(results).reduce((sum, key) => sum + results[key], 0);
  const streamData = [
    { 
      name: 'Science (PCM)', 
      value: results.pcm, 
      percentage: Math.round((results.pcm / totalAnswers) * 100),
      color: '#3B82F6'
    },
    { 
      name: 'Science (PCB)', 
      value: results.pcb, 
      percentage: Math.round((results.pcb / totalAnswers) * 100),
      color: '#10B981'
    },
    { 
      name: 'Commerce', 
      value: results.commerce, 
      percentage: Math.round((results.commerce / totalAnswers) * 100),
      color: '#F59E0B'
    },
    { 
      name: 'Arts', 
      value: results.arts, 
      percentage: Math.round((results.arts / totalAnswers) * 100),
      color: '#EF4444'
    }
  ].sort((a, b) => b.value - a.value);

  const recommendedStream = streamData[0];
  const filteredColleges = colleges.filter(college => {
    const course = college.Course?.toLowerCase() || '';
    if (recommendedStream.name === 'Science (PCM)') {
      return course.includes('b.tech') || course.includes('engineering') || course.includes('b.e');
    }
    if (recommendedStream.name === 'Science (PCB)') {
      return course.includes('mbbs') || course.includes('bds') || course.includes('nursing') || course.includes('b.pharm');
    }
    if (recommendedStream.name === 'Commerce') {
      return course.includes('bcom') || course.includes('bba') || course.includes('bca');
    }
    if (recommendedStream.name === 'Arts') {
      return course.includes('ba') || course.includes('bsc') && !course.includes('nursing');
    }
    return false;
  }).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-2 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Your Results</h1>
          <p className="text-muted-foreground text-lg">Stream recommendation based on your preferences</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Recommended Stream Card */}
          <Card className="shadow-elegant border-primary/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-2">Recommended Stream</CardTitle>
              <CardDescription className="text-lg">
                Based on your responses, here's your ideal academic path
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold mb-2 text-primary">{recommendedStream.name}</div>
              <div className="text-2xl text-muted-foreground mb-4">{recommendedStream.percentage}% Match</div>
              <Progress value={recommendedStream.percentage} className="w-full max-w-md mx-auto h-3" />
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Detailed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={streamData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Stream Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={streamData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="percentage"
                    >
                      {streamData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {streamData.map((stream) => (
                    <div key={stream.name} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: stream.color }}
                      />
                      <span className="text-sm">{stream.name}: {stream.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Colleges */}
          {filteredColleges.length > 0 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Recommended Colleges for {recommendedStream.name}</CardTitle>
                <CardDescription>
                  Top colleges offering courses aligned with your recommended stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {filteredColleges.map((college, index) => (
                    <div key={index} className="border border-border/50 rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{college.College}</h4>
                        <span className="text-primary font-medium">₹{college.Avg_Fee_per_year_INR}/year</span>
                      </div>
                      <p className="text-muted-foreground mb-2">{college.Course}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="bg-muted px-2 py-1 rounded">{college.Type}</span>
                        <span className="text-muted-foreground">Eligibility: {college.Eligibility_Criteria}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/quiz/class10')} variant="outline" className="border-primary/20">
              Retake Quiz
            </Button>
            <Button onClick={() => navigate('/jobs')} className="bg-gradient-primary hover:opacity-90">
              Explore Job Opportunities
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsClass10;