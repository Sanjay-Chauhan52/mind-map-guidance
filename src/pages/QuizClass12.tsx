import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "What is your current stream?",
    options: [
      { value: "pcm", label: "Science (PCM - Physics, Chemistry, Math)" },
      { value: "pcb", label: "Science (PCB - Physics, Chemistry, Biology)" },
      { value: "commerce", label: "Commerce" },
      { value: "arts", label: "Arts/Humanities" }
    ]
  },
  {
    id: 2,
    question: "Which career field interests you most?",
    options: [
      { value: "technology", label: "Technology and Engineering" },
      { value: "healthcare", label: "Healthcare and Medical Sciences" },
      { value: "business", label: "Business and Management" },
      { value: "research", label: "Research and Academia" }
    ]
  },
  {
    id: 3,
    question: "What type of work environment do you prefer?",
    options: [
      { value: "lab", label: "Laboratory or Technical Environment" },
      { value: "hospital", label: "Healthcare or Clinical Setting" },
      { value: "office", label: "Corporate or Office Environment" },
      { value: "field", label: "Field Work or Community Interaction" }
    ]
  },
  {
    id: 4,
    question: "How important is job security vs. entrepreneurship?",
    options: [
      { value: "security", label: "Prefer stable, secure employment" },
      { value: "mixed", label: "Balance of security and growth opportunities" },
      { value: "growth", label: "Focus on growth and advancement" },
      { value: "entrepreneur", label: "Interested in entrepreneurship" }
    ]
  },
  {
    id: 5,
    question: "What motivates you in your career choice?",
    options: [
      { value: "innovation", label: "Creating innovative solutions" },
      { value: "service", label: "Serving society and helping others" },
      { value: "leadership", label: "Leadership and management roles" },
      { value: "knowledge", label: "Continuous learning and knowledge" }
    ]
  }
];

const QuizClass12 = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const handleAnswer = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentQuestion].id]: selectedAnswer
      }));
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer("");
      } else {
        // Quiz completed, navigate to results
        navigate('/results/class12', { state: { answers } });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[questions[currentQuestion - 1].id] || "");
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

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
          <h1 className="text-2xl font-bold text-foreground">Class 12 Career Assessment</h1>
          <p className="text-muted-foreground">Plan your college and career journey</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
              <CardDescription>
                Select the option that best describes your preference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswer}>
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label 
                      htmlFor={option.value} 
                      className="flex-1 cursor-pointer text-sm leading-relaxed"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer}
            >
              {currentQuestion === questions.length - 1 ? 'View Results' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizClass12;