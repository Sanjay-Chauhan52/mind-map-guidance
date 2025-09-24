import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Newspaper, ExternalLink, Calendar, User } from "lucide-react";

interface NewsArticle {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author?: string;
}

interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    trailText?: string;
    thumbnail?: string;
  };
}

const News = () => {
  const navigate = useNavigate();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [guardianArticles, setGuardianArticles] = useState<GuardianArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch from NewsAPI
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=education+OR+career+OR+university+OR+college&sortBy=publishedAt&language=en&pageSize=10&apiKey=a0d97574f94c49b1b9d6fccf82a6b824`
        );

        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          setNewsArticles(newsData.articles || []);
        }

        // Fetch from Guardian API
        const guardianResponse = await fetch(
          `https://content.guardianapis.com/search?q=education%20OR%20career%20OR%20university&show-fields=trailText,thumbnail&page-size=10&api-key=9f1f2584-2684-42ac-931e-33bb238f3c23`
        );

        if (guardianResponse.ok) {
          const guardianData = await guardianResponse.json();
          setGuardianArticles(guardianData.response?.results || []);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Date not specified';
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
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
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Education News</h1>
          <p className="text-muted-foreground text-lg">Stay updated with latest education and career trends</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading news...</p>
            </div>
          )}

          {error && (
            <Card className="mb-8 border-destructive/50">
              <CardContent className="pt-6">
                <p className="text-destructive text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && (
            <Tabs defaultValue="newsapi" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="newsapi">Latest News</TabsTrigger>
                <TabsTrigger value="guardian">Guardian Education</TabsTrigger>
              </TabsList>

              <TabsContent value="newsapi">
                <div className="space-y-6">
                  {newsArticles.length > 0 ? (
                    newsArticles.map((article, index) => (
                      <Card key={index} className="shadow-soft hover:shadow-elegant transition-all duration-300">
                        <div className="flex flex-col md:flex-row">
                          {article.urlToImage && (
                            <div className="md:w-48 h-48 md:h-auto">
                              <img
                                src={article.urlToImage}
                                alt={article.title}
                                className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <CardHeader>
                              <div className="flex justify-between items-start gap-4">
                                <CardTitle className="text-xl leading-tight">
                                  {article.title}
                                </CardTitle>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Newspaper className="h-4 w-4" />
                                  <span>{article.source.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(article.publishedAt)}</span>
                                </div>
                                {article.author && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>{article.author}</span>
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground mb-4 leading-relaxed">
                                {truncateText(article.description || '')}
                              </p>
                              <Button
                                onClick={() => window.open(article.url, '_blank')}
                                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                              >
                                Read Full Article
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </Button>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="shadow-soft">
                      <CardContent className="text-center py-8">
                        <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                        <p className="text-muted-foreground">
                          No education news available at the moment. Please check back later.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="guardian">
                <div className="space-y-6">
                  {guardianArticles.length > 0 ? (
                    guardianArticles.map((article) => (
                      <Card key={article.id} className="shadow-soft hover:shadow-elegant transition-all duration-300">
                        <div className="flex flex-col md:flex-row">
                          {article.fields?.thumbnail && (
                            <div className="md:w-48 h-48 md:h-auto">
                              <img
                                src={article.fields.thumbnail}
                                alt={article.webTitle}
                                className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <CardHeader>
                              <CardTitle className="text-xl leading-tight">
                                {article.webTitle}
                              </CardTitle>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Newspaper className="h-4 w-4" />
                                  <span>The Guardian</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(article.webPublicationDate)}</span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {article.fields?.trailText && (
                                <p className="text-muted-foreground mb-4 leading-relaxed">
                                  {truncateText(article.fields.trailText)}
                                </p>
                              )}
                              <Button
                                onClick={() => window.open(article.webUrl, '_blank')}
                                className="bg-gradient-primary hover:opacity-90 transition-opacity"
                              >
                                Read Full Article
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </Button>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="shadow-soft">
                      <CardContent className="text-center py-8">
                        <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                        <p className="text-muted-foreground">
                          No Guardian education articles available at the moment. Please check back later.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default News;