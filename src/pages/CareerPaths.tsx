import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, TrendingUp, MapPin } from "lucide-react";

interface CareerPath {
  title: string;
  description: string;
  streams: string[];
  education: string;
  averageSalary: string;
  growth: string;
  skills: string[];
}

const careerPathsData: Record<string, CareerPath[]> = {
  pcm: [
    {
      title: "Software Engineer",
      description: "Design and develop software applications and systems",
      streams: ["PCM"],
      education: "B.Tech/B.E in Computer Science, BCA, MCA",
      averageSalary: "₹4-15 LPA",
      growth: "Excellent",
      skills: ["Programming", "Problem Solving", "Logic", "Mathematics"]
    },
    {
      title: "Mechanical Engineer",
      description: "Design, build and maintain mechanical systems and machines",
      streams: ["PCM"],
      education: "B.Tech/B.E in Mechanical Engineering",
      averageSalary: "₹3-12 LPA",
      growth: "Good",
      skills: ["Design Thinking", "Problem Solving", "Physics", "Mathematics"]
    },
    {
      title: "Data Scientist",
      description: "Analyze complex data to help companies make better decisions",
      streams: ["PCM"],
      education: "B.Tech/B.Sc in Data Science, Statistics, Mathematics",
      averageSalary: "₹6-20 LPA",
      growth: "Excellent",
      skills: ["Statistics", "Programming", "Analytics", "Mathematics"]
    },
    {
      title: "Aerospace Engineer",
      description: "Design and develop aircraft, spacecraft, and missiles",
      streams: ["PCM"],
      education: "B.Tech/B.E in Aerospace Engineering",
      averageSalary: "₹5-18 LPA",
      growth: "Good",
      skills: ["Physics", "Mathematics", "Design", "Problem Solving"]
    },
    {
      title: "Civil Engineer",
      description: "Plan, design and oversee construction of buildings and infrastructure",
      streams: ["PCM"],
      education: "B.Tech/B.E in Civil Engineering",
      averageSalary: "₹3-10 LPA",
      growth: "Good",
      skills: ["Design", "Project Management", "Mathematics", "Physics"]
    },
    {
      title: "Electrical Engineer",
      description: "Design and develop electrical systems and equipment",
      streams: ["PCM"],
      education: "B.Tech/B.E in Electrical Engineering",
      averageSalary: "₹4-14 LPA",
      growth: "Good",
      skills: ["Physics", "Mathematics", "Problem Solving", "Design"]
    },
    {
      title: "Research Scientist",
      description: "Conduct scientific research to advance knowledge in various fields",
      streams: ["PCM"],
      education: "B.Sc, M.Sc, PhD in relevant field",
      averageSalary: "₹4-15 LPA",
      growth: "Good",
      skills: ["Research", "Analysis", "Critical Thinking", "Mathematics"]
    },
    {
      title: "Architect",
      description: "Design buildings and structures considering aesthetics and functionality",
      streams: ["PCM"],
      education: "B.Arch, M.Arch",
      averageSalary: "₹3-12 LPA",
      growth: "Good",
      skills: ["Design", "Creativity", "Mathematics", "Visualization"]
    }
  ],
  pcb: [
    {
      title: "Doctor (MBBS)",
      description: "Diagnose and treat illnesses and injuries",
      streams: ["PCB"],
      education: "MBBS, MD/MS specialization",
      averageSalary: "₹6-25 LPA",
      growth: "Excellent",
      skills: ["Biology", "Chemistry", "Problem Solving", "Empathy"]
    },
    {
      title: "Pharmacist",
      description: "Prepare and dispense medications, provide drug information",
      streams: ["PCB"],
      education: "B.Pharm, D.Pharm, PharmD",
      averageSalary: "₹3-8 LPA",
      growth: "Good",
      skills: ["Chemistry", "Biology", "Attention to Detail", "Communication"]
    },
    {
      title: "Biotechnologist",
      description: "Use biological processes to develop products and technologies",
      streams: ["PCB"],
      education: "B.Tech/B.Sc in Biotechnology",
      averageSalary: "₹4-12 LPA",
      growth: "Excellent",
      skills: ["Biology", "Chemistry", "Research", "Innovation"]
    },
    {
      title: "Veterinarian",
      description: "Diagnose and treat diseases and injuries in animals",
      streams: ["PCB"],
      education: "B.V.Sc & AH (Bachelor of Veterinary Science)",
      averageSalary: "₹3-10 LPA",
      growth: "Good",
      skills: ["Biology", "Animal Care", "Problem Solving", "Empathy"]
    },
    {
      title: "Nurse",
      description: "Provide healthcare services and patient care",
      streams: ["PCB"],
      education: "B.Sc Nursing, GNM",
      averageSalary: "₹2-8 LPA",
      growth: "Good",
      skills: ["Biology", "Care", "Communication", "Empathy"]
    },
    {
      title: "Medical Laboratory Technologist",
      description: "Perform diagnostic tests and analyze samples",
      streams: ["PCB"],
      education: "B.Sc in Medical Laboratory Technology",
      averageSalary: "₹2-6 LPA",
      growth: "Good",
      skills: ["Biology", "Chemistry", "Analysis", "Precision"]
    },
    {
      title: "Physiotherapist",
      description: "Help patients recover from injuries and improve mobility",
      streams: ["PCB"],
      education: "BPT (Bachelor of Physiotherapy)",
      averageSalary: "₹3-8 LPA",
      growth: "Good",
      skills: ["Biology", "Physics", "Patient Care", "Communication"]
    },
    {
      title: "Agricultural Scientist",
      description: "Research and develop farming techniques and crop management",
      streams: ["PCB"],
      education: "B.Sc Agriculture, M.Sc Agriculture",
      averageSalary: "₹3-10 LPA",
      growth: "Good",
      skills: ["Biology", "Chemistry", "Research", "Problem Solving"]
    }
  ],
  commerce: [
    {
      title: "Chartered Accountant (CA)",
      description: "Manage financial records, taxation, and business advisory",
      streams: ["Commerce"],
      education: "CA (Chartered Accountancy)",
      averageSalary: "₹6-25 LPA",
      growth: "Excellent",
      skills: ["Accounting", "Mathematics", "Analysis", "Business"]
    },
    {
      title: "Investment Banker",
      description: "Help companies and governments raise capital through securities",
      streams: ["Commerce"],
      education: "BBA, MBA in Finance",
      averageSalary: "₹8-30 LPA",
      growth: "Excellent",
      skills: ["Finance", "Mathematics", "Analysis", "Communication"]
    },
    {
      title: "Business Analyst",
      description: "Analyze business processes and recommend improvements",
      streams: ["Commerce"],
      education: "BBA, B.Com, MBA",
      averageSalary: "₹4-15 LPA",
      growth: "Excellent",
      skills: ["Analysis", "Business", "Problem Solving", "Communication"]
    },
    {
      title: "Marketing Manager",
      description: "Develop and implement marketing strategies for products/services",
      streams: ["Commerce"],
      education: "BBA, MBA in Marketing",
      averageSalary: "₹5-18 LPA",
      growth: "Good",
      skills: ["Marketing", "Creativity", "Communication", "Strategy"]
    },
    {
      title: "Company Secretary",
      description: "Ensure legal compliance and corporate governance",
      streams: ["Commerce"],
      education: "CS (Company Secretary)",
      averageSalary: "₹4-12 LPA",
      growth: "Good",
      skills: ["Law", "Business", "Communication", "Organization"]
    },
    {
      title: "Financial Advisor",
      description: "Provide financial planning and investment advice",
      streams: ["Commerce"],
      education: "B.Com, BBA, CFP certification",
      averageSalary: "₹3-12 LPA",
      growth: "Good",
      skills: ["Finance", "Analysis", "Communication", "Planning"]
    },
    {
      title: "Human Resources Manager",
      description: "Manage employee relations, recruitment, and organizational development",
      streams: ["Commerce"],
      education: "BBA, MBA in HR",
      averageSalary: "₹4-15 LPA",
      growth: "Good",
      skills: ["Communication", "Psychology", "Organization", "Leadership"]
    },
    {
      title: "Entrepreneur",
      description: "Start and manage your own business ventures",
      streams: ["Commerce"],
      education: "BBA, MBA (optional)",
      averageSalary: "Variable",
      growth: "Variable",
      skills: ["Business", "Leadership", "Innovation", "Risk Management"]
    }
  ],
  arts: [
    {
      title: "Lawyer",
      description: "Represent clients in legal matters and court proceedings",
      streams: ["Arts"],
      education: "LLB, LLM",
      averageSalary: "₹3-20 LPA",
      growth: "Good",
      skills: ["Communication", "Critical Thinking", "Research", "Argumentation"]
    },
    {
      title: "Journalist",
      description: "Research, write and report news and current events",
      streams: ["Arts"],
      education: "BA in Journalism, Mass Communication",
      averageSalary: "₹3-12 LPA",
      growth: "Good",
      skills: ["Writing", "Communication", "Research", "Critical Thinking"]
    },
    {
      title: "Psychologist",
      description: "Study human behavior and provide mental health services",
      streams: ["Arts"],
      education: "BA, MA in Psychology",
      averageSalary: "₹4-15 LPA",
      growth: "Excellent",
      skills: ["Psychology", "Empathy", "Communication", "Analysis"]
    },
    {
      title: "Social Worker",
      description: "Help individuals and communities address social problems",
      streams: ["Arts"],
      education: "BSW, MSW (Bachelor/Master of Social Work)",
      averageSalary: "₹2-8 LPA",
      growth: "Good",
      skills: ["Communication", "Empathy", "Problem Solving", "Organization"]
    },
    {
      title: "Teacher/Professor",
      description: "Educate and mentor students in academic subjects",
      streams: ["Arts"],
      education: "BA, MA, B.Ed, PhD",
      averageSalary: "₹3-12 LPA",
      growth: "Good",
      skills: ["Communication", "Subject Knowledge", "Patience", "Leadership"]
    },
    {
      title: "Content Writer",
      description: "Create written content for websites, blogs, and marketing materials",
      streams: ["Arts"],
      education: "BA in English/Literature, Mass Communication",
      averageSalary: "₹2-8 LPA",
      growth: "Good",
      skills: ["Writing", "Creativity", "Research", "Communication"]
    },
    {
      title: "Graphic Designer",
      description: "Create visual concepts for print and digital media",
      streams: ["Arts"],
      education: "BFA, BA in Design",
      averageSalary: "₹3-10 LPA",
      growth: "Good",
      skills: ["Creativity", "Design", "Visual Arts", "Technology"]
    },
    {
      title: "Civil Services Officer",
      description: "Work in government administration and public service",
      streams: ["Arts"],
      education: "Any Bachelor's degree + UPSC/State PSC",
      averageSalary: "₹7-20 LPA",
      growth: "Good",
      skills: ["Leadership", "Communication", "Problem Solving", "Public Service"]
    }
  ]
};

const CareerPaths = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [recommendedStream, setRecommendedStream] = useState<string>("");

  useEffect(() => {
    const results = location.state?.results;
    const recommended = location.state?.recommendedStream;
    
    if (!results || !recommended) {
      navigate("/quiz/class10");
      return;
    }

    setRecommendedStream(recommended);
    setCareers(careerPathsData[recommended.toLowerCase()] || []);
  }, [location.state, navigate]);

  const getGrowthBadgeColor = (growth: string) => {
    switch (growth) {
      case "Excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "Good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-primary">EduGuide</h1>
            <p className="text-sm text-muted-foreground">Career Recommendations</p>
          </div>
          <div className="w-28" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Recommended Stream */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Recommended Stream</h2>
          <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
            {recommendedStream.toUpperCase()}
          </Badge>
          <p className="text-muted-foreground mb-6">
            Based on your quiz responses, here are the top career paths in your recommended stream
          </p>
        </div>

        {/* Career Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {careers.map((career, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {career.title}
                </CardTitle>
                <CardDescription>{career.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Education Required</h4>
                  <p className="text-sm text-muted-foreground">{career.education}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">Salary:</span>
                  <span className="text-sm">{career.averageSalary}</span>
                </div>

                <div>
                  <Badge className={getGrowthBadgeColor(career.growth)}>
                    {career.growth} Growth
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {career.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate("/quiz/class10")}
            variant="outline"
          >
            Retake Quiz
          </Button>
          <Button 
            onClick={() => navigate("/colleges")}
            className="bg-primary hover:bg-primary/90"
          >
            Explore Colleges
          </Button>
          <Button 
            onClick={() => navigate("/jobs")}
            variant="outline"
          >
            Find Job Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CareerPaths;