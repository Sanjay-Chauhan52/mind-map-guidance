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
}

const Colleges = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStream, setSelectedStream] = useState("all");

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
          case "engineering":
            return course(college).includes('b.tech') || course(college).includes('engineering') || course(college).includes('b.e');
          case "medical":
            return course(college).includes('mbbs') || course(college).includes('bds') || course(college).includes('nursing') || course(college).includes('b.pharm');
          case "commerce":
            return course(college).includes('bcom') || course(college).includes('bba') || course(college).includes('bca');
          case "arts":
            return course(college).includes('ba') || (course(college).includes('bsc') && !course(college).includes('nursing'));
          default:
            return true;
        }
      });
    }

    setFilteredColleges(filtered);
  }, [searchQuery, selectedType, selectedStream, colleges]);

  const getStreamBadgeColor = (course: string) => {
    const lowerCourse = course.toLowerCase();
    if (lowerCourse.includes('b.tech') || lowerCourse.includes('engineering') || lowerCourse.includes('b.e')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (lowerCourse.includes('mbbs') || lowerCourse.includes('bds') || lowerCourse.includes('nursing') || lowerCourse.includes('b.pharm')) {
      return 'bg-green-100 text-green-800';
    }
    if (lowerCourse.includes('bcom') || lowerCourse.includes('bba') || lowerCourse.includes('bca')) {
      return 'bg-orange-100 text-orange-800';
    }
    return 'bg-purple-100 text-purple-800';
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
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="College Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="iit">IIT</SelectItem>
                    <SelectItem value="central">Central</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedStream} onValueChange={setSelectedStream}>
                  <SelectTrigger>
                    <SelectValue placeholder="Stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Streams</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredColleges.length} of {colleges.length} colleges
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