import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Briefcase, MapPin, Clock, ExternalLink, Search } from "lucide-react";

interface Job {
  job_id: string;
  job_title: string;
  job_publisher?: string;
  employer_name: string;
  job_location?: string;
  job_description: string;
  job_apply_link: string;
  job_employment_type?: string;
  job_posted_at_datetime_utc?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_benefits?: string[];
  job_required_experience?: {
    no_experience_required?: boolean;
    required_experience_in_months?: number;
  };
  job_required_skills?: string[];
  job_required_education?: {
    postgraduate_degree?: boolean;
    professional_certification?: boolean;
    high_school?: boolean;
  };
}

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("entry level internship student");
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const searchJobs = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`, {
        headers: {
          'X-RapidAPI-Key': 'ecca5fb74amshe8b166b28c9c78ep136978jsn694d75ebef07',
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchJobs(searchQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchJobs(searchQuery.trim());
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Date not specified';
    }
  };

  const formatSalary = (job: Job) => {
    if (job.job_min_salary && job.job_max_salary) {
      const currency = job.job_salary_currency || 'USD';
      const period = job.job_salary_period || 'YEAR';
      return `${currency} ${job.job_min_salary.toLocaleString()} - ${job.job_max_salary.toLocaleString()} per ${period.toLowerCase()}`;
    }
    return 'Salary not specified';
  };

  const formatExperience = (experience?: Job['job_required_experience']) => {
    if (!experience) return 'Experience not specified';
    if (experience.no_experience_required) return 'No experience required';
    if (experience.required_experience_in_months) {
      const years = Math.floor(experience.required_experience_in_months / 12);
      const months = experience.required_experience_in_months % 12;
      if (years > 0 && months > 0) return `${years} years ${months} months`;
      if (years > 0) return `${years} years`;
      return `${months} months`;
    }
    return 'Experience not specified';
  };

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
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Job Opportunities</h1>
          <p className="text-muted-foreground text-lg">Find internships and entry-level positions</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Section */}
          <Card className="shadow-elegant border-primary/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Jobs
              </CardTitle>
              <CardDescription>
                Search for internships and entry-level positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., software intern, marketing trainee, data analyst"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mb-8 border-destructive/50">
              <CardContent className="pt-6">
                <p className="text-destructive text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Searching for jobs...</p>
            </div>
          )}

          {/* Jobs List */}
          {!loading && jobs.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Found {jobs.length} opportunities
              </h2>
              
              {jobs.map((job) => (
                <Card key={job.job_id} className="shadow-soft hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{job.job_title}</CardTitle>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-2">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.employer_name}</span>
                          </div>
                          {job.job_location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.job_location}</span>
                            </div>
                          )}
                          {job.job_employment_type && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{job.job_employment_type}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="text-primary font-semibold">
                            {formatSalary(job)}
                          </div>
                          <div className="text-muted-foreground">
                            Experience: {formatExperience(job.job_required_experience)}
                          </div>
                          <div className="text-muted-foreground">
                            Posted: {formatDate(job.job_posted_at_datetime_utc)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {job.job_description.substring(0, 150)}...
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {job.job_employment_type && (
                          <span className="bg-muted px-2 py-1 rounded text-sm">
                            {job.job_employment_type}
                          </span>
                        )}
                        {job.job_required_experience?.no_experience_required && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            No Experience Required
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedJob(job)}
                          className="border-primary/20"
                        >
                          View Details
                        </Button>
                        <Button 
                          onClick={() => window.open(job.job_apply_link, '_blank')}
                          className="bg-gradient-primary hover:opacity-90 transition-opacity"
                        >
                          Apply Now
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && jobs.length === 0 && !error && (
            <Card className="shadow-soft">
              <CardContent className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or check back later.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("entry level internship student");
                    searchJobs("entry level internship student");
                  }}
                  variant="outline"
                  className="border-primary/20"
                >
                  Reset Search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{selectedJob.job_title}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{selectedJob.employer_name}</span>
                      </div>
                      {selectedJob.job_location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedJob.job_location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedJob(null)}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Salary Information</h4>
                    <p className="text-primary font-medium">{formatSalary(selectedJob)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Experience Required</h4>
                    <p>{formatExperience(selectedJob.job_required_experience)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Employment Type</h4>
                    <p>{selectedJob.job_employment_type || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Posted Date</h4>
                    <p>{formatDate(selectedJob.job_posted_at_datetime_utc)}</p>
                  </div>
                </div>
                
                {selectedJob.job_required_skills && selectedJob.job_required_skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.job_required_skills.map((skill, index) => (
                        <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedJob.job_benefits && selectedJob.job_benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Benefits</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedJob.job_benefits.map((benefit, index) => (
                        <li key={index} className="text-muted-foreground">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {selectedJob.job_description}
                  </p>
                </div>
                
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedJob(null)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => window.open(selectedJob.job_apply_link, '_blank')}
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;