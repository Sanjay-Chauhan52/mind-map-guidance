import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, GraduationCap, MapPin, DollarSign, BookOpen } from "lucide-react";

interface College {
  College: string;
  Course: string;
  Avg_Fee_per_year_INR: string;
  Eligibility_Criteria: string;
  Type: string;
  City?: string;
}

// Career interests by stream
const careerInterestsByStream = {
  pcb: ["Doctor", "Nurse", "Scientist/Researcher", "Pharmacist", "Veterinarian", "Biotechnologist", "Agriculture Specialist"],
  pcm: ["Engineer", "Pilot", "Architect", "Scientist/Researcher", "Entrepreneur", "Defense Services", "Computer Scientist"],
  commerce: ["Chartered Accountant", "Lawyer", "Entrepreneur", "Corporate Manager", "Banker", "Business Administrator", "Social Worker"],
  arts: ["Lawyer", "Journalist", "Teacher/Professor", "Social Worker", "Artist/Designer", "Psychologist", "Political Scientist"]
};

const Colleges = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStream, setSelectedStream] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCareerInterest, setSelectedCareerInterest] = useState("all");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");

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
        }).filter(row => row.College).map(college => ({
          ...college,
          City: 'Chennai' // For now, all colleges are in Chennai
        }));
        
        setColleges(data);
        setFilteredColleges(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading colleges:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = colleges;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(college => 
        college.College.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.Course.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(college => 
        college.Type.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    // Filter by stream
    if (selectedStream !== "all") {
      const course = (college: College) => college.Course.toLowerCase();
      filtered = filtered.filter(college => {
        switch (selectedStream) {
          case "pcm":
            return course(college).includes('b.tech') || course(college).includes('engineering') || course(college).includes('b.e') || course(college).includes('bca') || course(college).includes('computer');
          case "pcb":
            return course(college).includes('mbbs') || course(college).includes('bds') || course(college).includes('nursing') || course(college).includes('b.pharm') || course(college).includes('veterinary') || course(college).includes('biotechnology');
          case "commerce":
            return course(college).includes('bcom') || course(college).includes('bba') || course(college).includes('ca') || course(college).includes('cs') || course(college).includes('finance');
          case "arts":
            return course(college).includes('ba') || course(college).includes('law') || course(college).includes('journalism') || course(college).includes('psychology') || (course(college).includes('bsc') && !course(college).includes('nursing'));
          default:
            return true;
        }
      });
    }

    // Filter by city
    if (selectedCity !== "all") {
      filtered = filtered.filter(college => 
        college.City?.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // Filter by fees range
    if (minFee || maxFee) {
      filtered = filtered.filter(college => {
        const fee = parseInt(college.Avg_Fee_per_year_INR);
        const min = minFee ? parseInt(minFee) : 0;
        const max = maxFee ? parseInt(maxFee) : Infinity;
        return fee >= min && fee <= max;
      });
    }

    setFilteredColleges(filtered);
  }, [searchQuery, selectedType, selectedStream, selectedCity, selectedCareerInterest, minFee, maxFee, colleges]);

  const getStreamBadgeColor = (course: string) => {
    const lowerCourse = course.toLowerCase();
    if (lowerCourse.includes('b.tech') || lowerCourse.includes('engineering') || lowerCourse.includes('b.e') || lowerCourse.includes('bca')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (lowerCourse.includes('mbbs') || lowerCourse.includes('bds') || lowerCourse.includes('nursing') || lowerCourse.includes('b.pharm') || lowerCourse.includes('biotechnology')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (lowerCourse.includes('bcom') || lowerCourse.includes('bba') || lowerCourse.includes('ca') || lowerCourse.includes('finance')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    if (lowerCourse.includes('ba') || lowerCourse.includes('law') || lowerCourse.includes('journalism')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading colleges...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Colleges & Courses
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore government and private colleges with course details
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Filters Section */}
          <Card className="shadow-elegant border-primary/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter Colleges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {/* First Row - Search and Primary Filters */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      type="text"
                      placeholder="Search colleges or courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <Select value={selectedStream} onValueChange={(value) => {
                    setSelectedStream(value);
                    setSelectedCareerInterest("all"); // Reset career interest when stream changes
                  }}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Stream" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      <SelectItem value="all">All Streams</SelectItem>
                      <SelectItem value="pcm">PCM (Physics, Chemistry, Maths)</SelectItem>
                      <SelectItem value="pcb">PCB (Physics, Chemistry, Biology)</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedCareerInterest} onValueChange={setSelectedCareerInterest}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Career Interest" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-40">
                      <SelectItem value="all">All Interests</SelectItem>
                      {selectedStream !== "all" && selectedStream in careerInterestsByStream && 
                        careerInterestsByStream[selectedStream as keyof typeof careerInterestsByStream].map((interest) => (
                          <SelectItem key={interest} value={interest.toLowerCase()}>
                            {interest}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Second Row - Additional Filters */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-30">
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="College Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-20">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="iit">IIT</SelectItem>
                      <SelectItem value="central">Central</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Min Fee (₹)"
                    value={minFee}
                    onChange={(e) => setMinFee(e.target.value)}
                    className="w-full"
                  />

                  <Input
                    type="number"
                    placeholder="Max Fee (₹)"
                    value={maxFee}
                    onChange={(e) => setMaxFee(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredColleges.length} of {colleges.length} colleges
                </div>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedStream("all");
                    setSelectedCity("all");
                    setSelectedCareerInterest("all");
                    setMinFee("");
                    setMaxFee("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Colleges Grid */}
          {filteredColleges.length > 0 ? (
            <div className="grid gap-6">
              {filteredColleges.map((college, index) => (
                <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          {college.College}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-sm ${getStreamBadgeColor(college.Course)}`}>
                            {college.Course}
                          </span>
                          <span className="bg-muted px-2 py-1 rounded text-sm">
                            {college.Type}
                          </span>
                          <span className="bg-accent/20 text-accent-foreground px-2 py-1 rounded text-sm">
                            {college.City}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-primary font-semibold">
                          <DollarSign className="h-4 w-4" />
                          <span>₹{parseInt(college.Avg_Fee_per_year_INR).toLocaleString()}/year</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Eligibility Criteria
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {college.Eligibility_Criteria}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">College Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span>{college.Type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Annual Fee:</span>
                            <span className="text-primary font-medium">
                              ₹{parseInt(college.Avg_Fee_per_year_INR).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-soft">
              <CardContent className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No colleges found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedStream("all");
                    setSelectedCity("all");
                  }}
                  variant="outline"
                  className="border-primary/20"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Colleges;