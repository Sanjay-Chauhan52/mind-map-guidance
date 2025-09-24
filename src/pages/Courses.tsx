import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, BookOpen, Clock, DollarSign } from "lucide-react";

interface Course {
  Course: string;
  College: string;
  Avg_Fee_per_year_INR: string;
  Eligibility_Criteria: string;
  Type: string;
  City: string;
}

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStream, setSelectedStream] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  useEffect(() => {
    // Load course data
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
          City: 'Chennai'
        }));
        
        setCourses(data);
        setFilteredCourses(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading courses:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.Course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.College.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by stream
    if (selectedStream !== "all") {
      const courseName = (course: Course) => course.Course.toLowerCase();
      filtered = filtered.filter(course => {
        switch (selectedStream) {
          case "engineering":
            return courseName(course).includes('b.tech') || courseName(course).includes('engineering') || courseName(course).includes('b.e');
          case "medical":
            return courseName(course).includes('mbbs') || courseName(course).includes('bds') || courseName(course).includes('nursing') || courseName(course).includes('b.pharm');
          case "commerce":
            return courseName(course).includes('bcom') || courseName(course).includes('bba') || courseName(course).includes('bca');
          case "arts":
            return courseName(course).includes('ba') || (courseName(course).includes('bsc') && !courseName(course).includes('nursing'));
          default:
            return true;
        }
      });
    }

    // Filter by level
    if (selectedLevel !== "all") {
      const courseName = (course: Course) => course.Course.toLowerCase();
      filtered = filtered.filter(course => {
        switch (selectedLevel) {
          case "undergraduate":
            return courseName(course).includes('b.') || courseName(course).includes('bachelor') || courseName(course).includes('bds') || courseName(course).includes('mbbs');
          case "postgraduate":
            return courseName(course).includes('m.') || courseName(course).includes('master') || courseName(course).includes('mba') || courseName(course).includes('msc');
          case "doctoral":
            return courseName(course).includes('phd') || courseName(course).includes('doctoral');
          default:
            return true;
        }
      });
    }

    setFilteredCourses(filtered);
  }, [searchQuery, selectedStream, selectedLevel, courses]);

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

  const getCourseDuration = (course: string) => {
    const lowerCourse = course.toLowerCase();
    if (lowerCourse.includes('mbbs')) return '5.5 years';
    if (lowerCourse.includes('b.tech') || lowerCourse.includes('engineering') || lowerCourse.includes('b.e')) return '4 years';
    if (lowerCourse.includes('bds')) return '5 years';
    if (lowerCourse.includes('nursing')) return '4 years';
    if (lowerCourse.includes('b.pharm')) return '4 years';
    if (lowerCourse.includes('bcom') || lowerCourse.includes('bba') || lowerCourse.includes('bca')) return '3 years';
    if (lowerCourse.includes('ba') || lowerCourse.includes('bsc')) return '3 years';
    if (lowerCourse.includes('mba') || lowerCourse.includes('msc') || lowerCourse.includes('m.tech')) return '2 years';
    if (lowerCourse.includes('phd')) return '3-5 years';
    return 'Variable';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
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
            Courses Directory
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore available courses with duration, fees, and eligibility details
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
                Search & Filter Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  placeholder="Search courses or colleges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                
                <Select value={selectedStream} onValueChange={setSelectedStream}>
                  <SelectTrigger className="bg-background border-border z-40">
                    <SelectValue placeholder="Stream" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-40">
                    <SelectItem value="all">All Streams</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="bg-background border-border z-30">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-30">
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    <SelectItem value="doctoral">Doctoral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredCourses.length} of {courses.length} courses
              </div>
            </CardContent>
          </Card>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid gap-6">
              {filteredCourses.map((course, index) => (
                <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          {course.Course}
                        </CardTitle>
                        <p className="text-muted-foreground mb-2">Offered by: {course.College}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-sm ${getStreamBadgeColor(course.Course)}`}>
                            {course.Course}
                          </span>
                          <span className="bg-muted px-2 py-1 rounded text-sm">
                            {course.Type}
                          </span>
                          <span className="bg-accent/20 text-accent-foreground px-2 py-1 rounded text-sm flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getCourseDuration(course.Course)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-primary font-semibold">
                          <DollarSign className="h-4 w-4" />
                          <span>₹{parseInt(course.Avg_Fee_per_year_INR).toLocaleString()}/year</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                        <p className="text-muted-foreground text-sm">
                          {course.Eligibility_Criteria}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Course Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{getCourseDuration(course.Course)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">College Type:</span>
                            <span>{course.Type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{course.City}</span>
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
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStream("all");
                    setSelectedLevel("all");
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

export default Courses;