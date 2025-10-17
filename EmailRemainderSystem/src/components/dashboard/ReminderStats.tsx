import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

export const ReminderStats = () => {
  const { data: stats } = useQuery({
    queryKey: ["reminder-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: reminders, error } = await supabase
        .from("reminders")
        .select("status")
        .eq("user_id", user.id);

      if (error) throw error;

      const pending = reminders?.filter((r) => r.status === "pending").length || 0;
      const sent = reminders?.filter((r) => r.status === "sent").length || 0;
      const failed = reminders?.filter((r) => r.status === "failed").length || 0;
      const total = reminders?.length || 0;

      return { pending, sent, failed, total };
    },
  });

  const statCards = [
    {
      icon: Calendar,
      label: "Total Reminders",
      value: stats?.total || 0,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Clock,
      label: "Pending",
      value: stats?.pending || 0,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: CheckCircle,
      label: "Sent",
      value: stats?.sent || 0,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: XCircle,
      label: "Failed",
      value: stats?.failed || 0,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
