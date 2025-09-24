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
  },
  {
    id: 6,
    question: "Which work environment appeals to you?",
    options: [
      { value: "lab", label: "Laboratory or tech workspace", stream: "pcm" },
      { value: "hospital", label: "Hospital or research facility", stream: "pcb" },
      { value: "office", label: "Corporate office or business setting", stream: "commerce" },
      { value: "studio", label: "Creative studio or community center", stream: "arts" }
    ]
  },
  {
    id: 7,
    question: "What kind of thinking do you excel at?",
    options: [
      { value: "analytical", label: "Analytical and mathematical thinking", stream: "pcm" },
      { value: "scientific", label: "Scientific reasoning and research", stream: "pcb" },
      { value: "strategic", label: "Strategic planning and decision making", stream: "commerce" },
      { value: "creative", label: "Creative and abstract thinking", stream: "arts" }
    ]
  },
  {
    id: 8,
    question: "Which activity would you choose for a school project?",
    options: [
      { value: "robot", label: "Building a robot or coding an app", stream: "pcm" },
      { value: "research", label: "Researching environmental issues", stream: "pcb" },
      { value: "business_plan", label: "Creating a business plan", stream: "commerce" },
      { value: "documentary", label: "Making a documentary or art piece", stream: "arts" }
    ]
  },
  {
    id: 9,
    question: "What type of books do you prefer reading?",
    options: [
      { value: "science_books", label: "Science and technology books", stream: "pcm" },
      { value: "biology_books", label: "Biology and medical journals", stream: "pcb" },
      { value: "business_books", label: "Business and economics books", stream: "commerce" },
      { value: "literature", label: "Literature and philosophy", stream: "arts" }
    ]
  },
  {
    id: 10,
    question: "How do you prefer to learn new concepts?",
    options: [
      { value: "formulas", label: "Through formulas and calculations", stream: "pcm" },
      { value: "experiments", label: "Through experiments and observation", stream: "pcb" },
      { value: "case_studies", label: "Through case studies and examples", stream: "commerce" },
      { value: "discussions", label: "Through discussions and storytelling", stream: "arts" }
    ]
  },
  {
    id: 11,
    question: "Which skill would you like to develop further?",
    options: [
      { value: "programming", label: "Programming and technical skills", stream: "pcm" },
      { value: "research_skills", label: "Research and analytical skills", stream: "pcb" },
      { value: "leadership", label: "Leadership and management skills", stream: "commerce" },
      { value: "communication", label: "Communication and creative skills", stream: "arts" }
    ]
  },
  {
    id: 12,
    question: "What type of challenges excite you?",
    options: [
      { value: "technical", label: "Technical problems and puzzles", stream: "pcm" },
      { value: "medical", label: "Understanding complex biological systems", stream: "pcb" },
      { value: "business_challenges", label: "Market analysis and business strategies", stream: "commerce" },
      { value: "social", label: "Social issues and human behavior", stream: "arts" }
    ]
  },
  {
    id: 13,
    question: "Which extracurricular activity interests you most?",
    options: [
      { value: "robotics", label: "Robotics club or coding competitions", stream: "pcm" },
      { value: "science_club", label: "Science club or biology olympiad", stream: "pcb" },
      { value: "business_club", label: "Business club or entrepreneurship programs", stream: "commerce" },
      { value: "debate", label: "Debate club or cultural activities", stream: "arts" }
    ]
  },
  {
    id: 14,
    question: "What drives your curiosity the most?",
    options: [
      { value: "how_things_work", label: "How machines and technology work", stream: "pcm" },
      { value: "living_systems", label: "How living systems function", stream: "pcb" },
      { value: "market_trends", label: "Market trends and economic patterns", stream: "commerce" },
      { value: "human_behavior", label: "Human behavior and social dynamics", stream: "arts" }
    ]
  },
  {
    id: 15,
    question: "Which future vision excites you most?",
    options: [
      { value: "tech_innovator", label: "Being a tech innovator or engineer", stream: "pcm" },
      { value: "healthcare", label: "Contributing to healthcare and medicine", stream: "pcb" },
      { value: "business_leader", label: "Leading a business or startup", stream: "commerce" },
      { value: "social_impact", label: "Making social impact through arts/education", stream: "arts" }
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
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Class 10 Stream Assessment</h1>
          <p className="text-muted-foreground text-lg">Discover your ideal academic stream</p>
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
            <Progress value={progress} className="w-full h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8 shadow-elegant border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{question.question}</CardTitle>
              <CardDescription className="text-center text-base">
                Select the option that best describes you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswer}>
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label 
                      htmlFor={option.value} 
                      className="flex-1 cursor-pointer text-base leading-relaxed"
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
              className="border-primary/20 hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
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