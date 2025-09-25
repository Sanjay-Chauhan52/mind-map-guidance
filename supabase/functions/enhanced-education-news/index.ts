import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const newsApiKey = Deno.env.get('NEWSAPI_KEY');
const guardianApiKey = Deno.env.get('GUARDIAN_API_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  isDeadlineRelated?: boolean;
  aiSummary?: string;
  importanceScore?: number;
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
  isDeadlineRelated?: boolean;
  aiSummary?: string;
  importanceScore?: number;
}

async function analyzeArticleWithAI(title: string, description: string): Promise<{
  isDeadlineRelated: boolean;
  aiSummary: string;
  importanceScore: number;
}> {
  try {
    const prompt = `Analyze this education news article:
Title: ${title}
Description: ${description}

Please determine:
1. Is this article related to exam deadlines, application deadlines, important dates, or time-sensitive education opportunities? (yes/no)
2. Provide a brief summary focusing on any deadlines, dates, or urgent information (max 100 words)
3. Rate the importance for students/educators on a scale of 1-10 (10 being most urgent/important)

Respond in JSON format:
{
  "isDeadlineRelated": boolean,
  "aiSummary": "summary text",
  "importanceScore": number
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an education news analyzer focusing on deadlines and important dates. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, await response.text());
      return {
        isDeadlineRelated: false,
        aiSummary: description || 'No description available',
        importanceScore: 5
      };
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const analysis = JSON.parse(content);
      return {
        isDeadlineRelated: analysis.isDeadlineRelated || false,
        aiSummary: analysis.aiSummary || description || 'No description available',
        importanceScore: analysis.importanceScore || 5
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      return {
        isDeadlineRelated: false,
        aiSummary: description || 'No description available',
        importanceScore: 5
      };
    }
  } catch (error) {
    console.error('Error analyzing article with AI:', error);
    return {
      isDeadlineRelated: false,
      aiSummary: description || 'No description available',
      importanceScore: 5
    };
  }
}

async function fetchNewsAPI(): Promise<NewsArticle[]> {
  try {
    console.log('Fetching from NewsAPI...');
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=education+OR+exam+OR+deadline+OR+admission+OR+university+OR+college&sortBy=publishedAt&language=en&pageSize=15&apiKey=${newsApiKey}`
    );

    if (!response.ok) {
      console.error('NewsAPI error:', response.status, await response.text());
      return [];
    }

    const data = await response.json();
    const articles = data.articles || [];
    
    // Analyze each article with AI
    const enhancedArticles: NewsArticle[] = [];
    for (const article of articles.slice(0, 10)) {
      const analysis = await analyzeArticleWithAI(
        article.title,
        article.description || ''
      );
      
      enhancedArticles.push({
        ...article,
        ...analysis
      });
    }
    
    // Sort by importance score and deadline relevance
    return enhancedArticles.sort((a, b) => {
      if (a.isDeadlineRelated && !b.isDeadlineRelated) return -1;
      if (!a.isDeadlineRelated && b.isDeadlineRelated) return 1;
      return (b.importanceScore || 0) - (a.importanceScore || 0);
    });

  } catch (error) {
    console.error('Error fetching NewsAPI:', error);
    return [];
  }
}

async function fetchGuardianAPI(): Promise<GuardianArticle[]> {
  try {
    console.log('Fetching from Guardian API...');
    const response = await fetch(
      `https://content.guardianapis.com/search?q=education%20OR%20exam%20OR%20deadline%20OR%20admission%20OR%20university&show-fields=trailText,thumbnail&page-size=15&api-key=${guardianApiKey}`
    );

    if (!response.ok) {
      console.error('Guardian API error:', response.status, await response.text());
      return [];
    }

    const data = await response.json();
    const articles = data.response?.results || [];
    
    // Analyze each article with AI
    const enhancedArticles: GuardianArticle[] = [];
    for (const article of articles.slice(0, 10)) {
      const analysis = await analyzeArticleWithAI(
        article.webTitle,
        article.fields?.trailText || ''
      );
      
      enhancedArticles.push({
        ...article,
        ...analysis
      });
    }
    
    // Sort by importance score and deadline relevance
    return enhancedArticles.sort((a, b) => {
      if (a.isDeadlineRelated && !b.isDeadlineRelated) return -1;
      if (!a.isDeadlineRelated && b.isDeadlineRelated) return 1;
      return (b.importanceScore || 0) - (a.importanceScore || 0);
    });

  } catch (error) {
    console.error('Error fetching Guardian API:', error);
    return [];
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting enhanced education news fetch...');
    
    // Fetch from both APIs in parallel
    const [newsArticles, guardianArticles] = await Promise.all([
      fetchNewsAPI(),
      fetchGuardianAPI()
    ]);

    console.log(`Fetched ${newsArticles.length} NewsAPI articles, ${guardianArticles.length} Guardian articles`);

    return new Response(JSON.stringify({
      success: true,
      newsArticles,
      guardianArticles,
      summary: {
        totalArticles: newsArticles.length + guardianArticles.length,
        deadlineRelated: [...newsArticles, ...guardianArticles].filter(a => a.isDeadlineRelated).length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-education-news function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      newsArticles: [],
      guardianArticles: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});