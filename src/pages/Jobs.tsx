import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Briefcase, MapPin, Clock, ExternalLink, Search } from "lucide-react";

interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_location?: string;
  job_description: string;
  job_apply_link: string;
  job_employment_type?: string;
  job_posted_at_datetime_utc?: string;
}

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("entry level internship student");
  const [error, setError] = useState<string | null>(null);

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

  const truncateDescription = (description: string, maxLength: number = 200) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
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
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
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
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Posted: {formatDate(job.job_posted_at_datetime_utc)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {truncateDescription(job.job_description)}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {job.job_employment_type && (
                          <span className="bg-muted px-2 py-1 rounded text-sm">
                            {job.job_employment_type}
                          </span>
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => window.open(job.job_apply_link, '_blank')}
                        className="bg-gradient-primary hover:opacity-90 transition-opacity"
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
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
      </main>
    </div>
  );
};

export default Jobs;