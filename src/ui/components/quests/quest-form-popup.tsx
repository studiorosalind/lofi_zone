import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Quest, useQuest } from "../../context/QuestContext";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../../lib/utils";

interface QuestFormPopupProps {
  open: boolean;
  onClose: () => void;
  questToEdit?: Quest;
}

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  detail: z.string().optional(),
  deadline: z.date().optional(),
  priority: z.enum(["high", "middle", "low"]),
  estimated_time: z.number().min(1).optional(),
  status: z.enum(["planned", "in_progress", "done"]),
  quest_type: z.enum(["chapter", "plot", "task"]),
  dependent_on: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function QuestFormPopup({ open, onClose, questToEdit }: QuestFormPopupProps) {
  const { quests, addQuest, updateQuest } = useQuest();
  const [availableDependencies, setAvailableDependencies] = useState<Quest[]>([]);
  
  const isEditMode = !!questToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: questToEdit?.title || "",
      detail: questToEdit?.detail || "",
      deadline: questToEdit?.deadline,
      priority: questToEdit?.priority || "middle",
      estimated_time: questToEdit?.estimated_time || 25,
      status: questToEdit?.status || "planned",
      quest_type: questToEdit?.quest_type || "task",
      dependent_on: questToEdit?.dependent_on,
    },
  });

  // Update available dependencies based on quest type
  useEffect(() => {
    const questType = form.watch("quest_type");
    
    if (questType === "chapter") {
      // Chapters can't depend on anything
      setAvailableDependencies([]);
    } else if (questType === "plot") {
      // Plots can only depend on chapters
      setAvailableDependencies(
        quests.filter(q => q.quest_type === "chapter" && q.id !== questToEdit?.id)
      );
    } else {
      // Tasks can depend on chapters or plots
      setAvailableDependencies(
        quests.filter(q => 
          (q.quest_type === "chapter" || q.quest_type === "plot") && 
          q.id !== questToEdit?.id
        )
      );
    }
  }, [form.watch("quest_type"), quests, questToEdit]);

  const onSubmit = (data: FormValues) => {
    if (isEditMode && questToEdit) {
      updateQuest(questToEdit.id, data);
    } else {
      addQuest(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-800/95 backdrop-blur-xl text-white border-gray-700 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modify Quest" : "Create New Quest"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter quest title" 
                      className="bg-gray-700/50 border-gray-600 text-white"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Detail */}
            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Detail (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter quest details" 
                      className="bg-gray-700/50 border-gray-600 text-white resize-none h-20"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Quest Type */}
            <FormField
              control={form.control}
              name="quest_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Quest Type</FormLabel>
                  <Select
                    disabled={isEditMode} // Can't change quest type when editing
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select quest type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="chapter">Chapter</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Only show deadline and estimated time for tasks */}
            {form.watch("quest_type") === "task" && (
              <>
                {/* Deadline */}
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-white">Deadline (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal bg-gray-700/50 border-gray-600 text-white",
                                !field.value && "text-gray-400"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                "Select a date"
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-700 border-gray-600">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="bg-gray-700 text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                {/* Estimated Time */}
                <FormField
                  control={form.control}
                  name="estimated_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Estimated Time (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          className="bg-gray-700/50 border-gray-600 text-white"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Dependent On - only show when not editing */}
            {!isEditMode && availableDependencies.length > 0 && (
              <FormField
                control={form.control}
                name="dependent_on"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Dependent On (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select dependency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white max-h-60">
                        <SelectItem value="">None</SelectItem>
                        {availableDependencies.map((quest) => (
                          <SelectItem key={quest.id} value={quest.id}>
                            {quest.title} ({quest.quest_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="bg-transparent border-gray-500 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isEditMode ? "Update Quest" : "Create Quest"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
