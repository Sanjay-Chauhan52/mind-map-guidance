import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, LogOut, User } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  age: z.number().min(10, "Age must be at least 10").max(25, "Age must be at most 25"),
  gender: z.enum(["male", "female", "other"]),
  currentClass: z.enum(["10th", "12th"]),
  languagePreference: z.enum(["English", "Hindi", "Tamil"]),
  city: z.string().min(2, "City must be at least 2 characters").max(100),
});

type ProfileData = z.infer<typeof profileSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading: profileLoading, signOut, hasProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    name: "",
    age: undefined,
    gender: undefined,
    currentClass: undefined,
    languagePreference: "English",
    city: "",
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (profile) {
      setFormData({
        name: profile.name,
        age: profile.age,
        gender: profile.gender as any,
        currentClass: profile.current_class as any,
        languagePreference: profile.language_preference as any,
        city: profile.city,
      });
    } else {
      setIsEditing(true); // If no profile exists, start in edit mode
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate form data
      const validatedData = profileSchema.parse({
        ...formData,
        age: Number(formData.age),
      });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to continue",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { error } = hasProfile
        ? await supabase
            .from("profiles")
            .update({
              name: validatedData.name,
              age: validatedData.age,
              gender: validatedData.gender,
              current_class: validatedData.currentClass,
              language_preference: validatedData.languagePreference,
              city: validatedData.city,
            })
            .eq("user_id", user.id)
        : await supabase
            .from("profiles")
            .insert({
              user_id: user.id,
              name: validatedData.name,
              age: validatedData.age,
              gender: validatedData.gender,
              current_class: validatedData.currentClass,
              language_preference: validatedData.languagePreference,
              city: validatedData.city,
            });

      if (error) {
        console.error("Profile creation error:", error);
        toast({
          title: "Error",
          description: "Failed to create profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: hasProfile ? "Profile updated successfully!" : "Profile created successfully!",
      });

      setIsEditing(false);
      
      // Only redirect if creating a new profile
      if (!hasProfile) {
        if (validatedData.currentClass === "10th") {
          navigate("/quiz/class10");
        } else {
          navigate("/colleges");
        }
      }
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

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
            Back
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-primary">EduGuide</h1>
            <p className="text-sm text-muted-foreground">
              {hasProfile ? (isEditing ? "Edit Profile" : "Your Profile") : "Create Your Profile"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasProfile && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>
                  {hasProfile ? (isEditing ? "Edit Your Profile" : "Your Profile") : "Tell us about yourself"}
                </CardTitle>
                <CardDescription>
                  {hasProfile && !isEditing 
                    ? "Your profile information and preferences"
                    : "We'll use this information to provide personalized recommendations"
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {hasProfile && !isEditing ? (
              // View mode
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <p className="text-lg font-medium">{profile?.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                    <p className="text-lg font-medium">{profile?.age} years</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                    <p className="text-lg font-medium capitalize">{profile?.gender}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Current Class</Label>
                    <p className="text-lg font-medium">{profile?.current_class} Standard</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Language Preference</Label>
                    <p className="text-lg font-medium">{profile?.language_preference}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">City</Label>
                    <p className="text-lg font-medium">{profile?.city}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => {
                        if (profile?.current_class === "10th") {
                          navigate("/quiz/class10");
                        } else {
                          navigate("/colleges");
                        }
                      }}
                      className="flex-1"
                    >
                      {profile?.current_class === "10th" ? "Take Stream Assessment" : "Explore Colleges"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Edit/Create mode
              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min="10"
                  max="25"
                  value={formData.age || ""}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  placeholder="Enter your age"
                  required
                />
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <Label>Gender *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value as any })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Current Class */}
              <div className="space-y-2">
                <Label>Current Class *</Label>
                <Select 
                  value={formData.currentClass} 
                  onValueChange={(value) => setFormData({ ...formData, currentClass: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10th">10th Standard</SelectItem>
                    <SelectItem value="12th">12th Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language Preference */}
              <div className="space-y-2">
                <Label>Language Preference *</Label>
                <Select 
                  value={formData.languagePreference} 
                  onValueChange={(value) => setFormData({ ...formData, languagePreference: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City or District *</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter your city or district"
                  required
                />
              </div>

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      if (hasProfile) {
                        setIsEditing(false);
                        // Reset form data to profile data
                        setFormData({
                          name: profile?.name,
                          age: profile?.age,
                          gender: profile?.gender as any,
                          currentClass: profile?.current_class as any,
                          languagePreference: profile?.language_preference as any,
                          city: profile?.city,
                        });
                      } else {
                        navigate('/');
                      }
                    }}
                    disabled={loading}
                    className="flex-1"
                  >
                    {hasProfile ? "Cancel" : "Back"}
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={loading}
                  >
                    {loading ? "Saving..." : hasProfile ? "Save Changes" : "Create Profile"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;