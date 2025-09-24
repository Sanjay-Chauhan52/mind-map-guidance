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
    question: "Which of these activities do you enjoy most?",
    options: [
      { value: "science", label: "Conducting experiments and solving problems", stream: "pcm" },
      { value: "biology", label: "Learning about living organisms and health", stream: "pcb" },
      { value: "business", label: "Understanding markets and business strategies", stream: "commerce" },
      { value: "creative", label: "Creative writing, art, and expression", stream: "arts" }
    ]
  },
  {
    id: 2,
    question: "What type of career appeals to you most?",
    options: [
      { value: "engineer", label: "Engineer or Technology Developer", stream: "pcm" },
      { value: "doctor", label: "Doctor or Healthcare Professional", stream: "pcb" },
      { value: "business", label: "Business Manager or Entrepreneur", stream: "commerce" },
      { value: "teacher", label: "Teacher or Social Worker", stream: "arts" }
    ]
  },
  {
    id: 3,
    question: "Which subject interests you the most?",
    options: [
      { value: "math", label: "Mathematics and Physics", stream: "pcm" },
      { value: "bio", label: "Biology and Chemistry", stream: "pcb" },
      { value: "accounts", label: "Accounts and Economics", stream: "commerce" },
      { value: "social", label: "History and Literature", stream: "arts" }
    ]
  },
  {
    id: 4,
    question: "How do you prefer to solve problems?",
    options: [
      { value: "logical", label: "Using logical reasoning and formulas", stream: "pcm" },
      { value: "research", label: "Through research and observation", stream: "pcb" },
      { value: "analysis", label: "By analyzing data and trends", stream: "commerce" },
      { value: "discussion", label: "Through discussion and critical thinking", stream: "arts" }
    ]
  },
  {
    id: 5,
    question: "What motivates you the most?",
    options: [
      { value: "innovation", label: "Creating innovative solutions", stream: "pcm" },
      { value: "helping", label: "Helping people and making a difference", stream: "pcb" },
      { value: "success", label: "Financial success and business growth", stream: "commerce" },
      { value: "expression", label: "Self-expression and creativity", stream: "arts" }
    ]
  }
];

const QuizClass10 = () => {
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
        const results = calculateResults();
        navigate('/results/class10', { state: { results, answers } });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[questions[currentQuestion - 1].id] || "");
    }
  };

  const calculateResults = () => {
    const streamScores = { pcm: 0, pcb: 0, commerce: 0, arts: 0 };
    
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      const option = question?.options.find(opt => opt.value === answer);
      if (option) {
        streamScores[option.stream as keyof typeof streamScores]++;
      }
    });

    return streamScores;
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
          <h1 className="text-2xl font-bold text-foreground">Class 10 Stream Assessment</h1>
          <p className="text-muted-foreground">Discover your ideal academic stream</p>
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
                Select the option that best describes you
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

export default QuizClass10;