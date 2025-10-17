import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
//interface for editReminderDialog
interface EditReminderDialogProps {
  reminder: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditReminderDialog = ({ reminder, open, onOpenChange }: EditReminderDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(reminder.is_recurring);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scheduledDate = format(new Date(reminder.scheduled_time), "yyyy-MM-dd");
  const scheduledTime = format(new Date(reminder.scheduled_time), "HH:mm");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const newDate = formData.get("date") as string;
    const newTime = formData.get("time") as string;
    const recurrencePattern = isRecurring ? (formData.get("recurrence") as string) : null;

    const scheduledDateTime = new Date(`${newDate}T${newTime}`);

    const { error } = await supabase
      .from("reminders")
      .update({
        title,
        description,
        scheduled_time: scheduledDateTime.toISOString(),
        is_recurring: isRecurring,
        recurrence_pattern: recurrencePattern,
      })
      .eq("id", reminder.id);

    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update reminder",
      });
    } else {
      toast({
        title: "Success",
        description: "Reminder updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      queryClient.invalidateQueries({ queryKey: ["reminder-stats"] });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Reminder</DialogTitle>
          <DialogDescription>Update your reminder details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              name="title"
              defaultValue={reminder.title}
              placeholder="Meeting with team"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              defaultValue={reminder.description || ""}
              placeholder="Discuss project progress and next steps"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date *</Label>
              <Input
                id="edit-date"
                name="date"
                type="date"
                defaultValue={scheduledDate}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-time">Time *</Label>
              <Input
                id="edit-time"
                name="time"
                type="time"
                defaultValue={scheduledTime}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <Label htmlFor="edit-recurring">Recurring Reminder</Label>
          </div>

          {isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="edit-recurrence">Recurrence Pattern</Label>
              <Select name="recurrence" defaultValue={reminder.recurrence_pattern || "daily"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Reminder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
