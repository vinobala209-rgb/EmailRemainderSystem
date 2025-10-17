import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Mail, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-subtle)" }}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold">Email Reminder System</span>
          </div>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Never Miss Another
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
              {" "}Important Event
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Schedule and manage email reminders for tasks, appointments, and deadlines.
            Simple, reliable, and always on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              Start Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground">
            Powerful features to keep you organized and on schedule
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Calendar,
              title: "Smart Scheduling",
              description: "Schedule reminders with specific dates and times that work for you",
            },
            {
              icon: Mail,
              title: "Email Delivery",
              description: "Receive reminders directly in your inbox, accessible anywhere",
            },
            {
              icon: Shield,
              title: "Secure & Private",
              description: "Your data is encrypted and protected with industry-standard security",
            },
            {
              icon: Bell,
              title: "Recurring Reminders",
              description: "Set up daily, weekly, or monthly reminders for recurring tasks",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-card rounded-2xl p-12 text-center max-w-3xl mx-auto shadow-lg" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Organized?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who never miss important events
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t mt-20">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2025 Email Reminder System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
