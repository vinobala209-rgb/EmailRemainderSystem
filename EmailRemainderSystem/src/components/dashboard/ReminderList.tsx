import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Search, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { EditReminderDialog } from "./EditReminderDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//updated reminder list
export const ReminderList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingReminder, setEditingReminder] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reminders, isLoading } = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete reminder",
      });
    } else {
      toast({
        title: "Success",
        description: "Reminder deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      queryClient.invalidateQueries({ queryKey: ["reminder-stats"] });
    }
  };

  const filteredReminders = reminders?.filter((reminder) => {
    const matchesSearch =
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || reminder.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "default",
      sent: "secondary",
      failed: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading reminders...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredReminders && filteredReminders.length > 0 ? (
        <div className="grid gap-4">
          {filteredReminders.map((reminder) => (
            <Card key={reminder.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{reminder.title}</h3>
                    {getStatusBadge(reminder.status)}
                    {reminder.is_recurring && (
                      <Badge variant="outline">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        {reminder.recurrence_pattern}
                      </Badge>
                    )}
                  </div>
                  {reminder.description && (
                    <p className="text-muted-foreground mb-3">{reminder.description}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Scheduled: {format(new Date(reminder.scheduled_time), "PPP p")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingReminder(reminder)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(reminder.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">
            {searchQuery || statusFilter !== "all"
              ? "No reminders match your filters"
              : "No reminders yet. Create your first reminder to get started!"}
          </p>
        </Card>
      )}

      {editingReminder && (
        <EditReminderDialog
          reminder={editingReminder}
          open={!!editingReminder}
          onOpenChange={(open) => !open && setEditingReminder(null)}
        />
      )}
    </div>
  );
};
