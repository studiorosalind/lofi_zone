import { format } from "date-fns";
import { Calendar, Clock, LayoutList, Bookmark, CheckCircle } from "lucide-react";
import { Quest, useQuest } from "../../context/QuestContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface QuestDetailModalProps {
  quest: Quest | null;
  open: boolean;
  onClose: () => void;
}

export function QuestDetailModal({ quest, open, onClose }: QuestDetailModalProps) {
  const { getQuestById } = useQuest();
  
  // Don't try to render anything if quest is null
  if (!quest || !open) return null;
  
  // Get parent quest if it exists
  const parentQuest = quest.dependent_on ? getQuestById(quest.dependent_on) : null;
  
  // Status colors
  const statusColors = {
    planned: "bg-blue-500/20 text-blue-400 border-blue-500",
    in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
    done: "bg-green-500/20 text-green-400 border-green-500",
  };
  
  // Priority colors
  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500",
    middle: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
    low: "bg-blue-500/20 text-blue-400 border-blue-500",
  };
  
  // Quest type icons
  const typeIcons = {
    chapter: <Bookmark className="h-5 w-5" />,
    plot: <LayoutList className="h-5 w-5" />,
    task: <CheckCircle className="h-5 w-5" />,
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
      hideCloseButton
      className="bg-gray-800/95 backdrop-blur-xl text-white border-gray-700 max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">{quest.title}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Status, Priority, Type */}
          <div className="flex flex-wrap gap-2">
            <div className={`px-3 py-1 rounded-full text-sm border ${statusColors[quest.status]}`}>
              {quest.status === "in_progress" ? "In Progress" : quest.status.charAt(0).toUpperCase() + quest.status.slice(1)}
            </div>
            
            <div className={`px-3 py-1 rounded-full text-sm border ${priorityColors[quest.priority]}`}>
              {quest.priority.charAt(0).toUpperCase() + quest.priority.slice(1)} Priority
            </div>
            
            <div className="px-3 py-1 rounded-full text-sm border border-purple-500 bg-purple-500/20 text-purple-400 flex items-center gap-1">
              {typeIcons[quest.quest_type]}
              <span>{quest.quest_type.charAt(0).toUpperCase() + quest.quest_type.slice(1)}</span>
            </div>
          </div>
          
          {/* Details */}
          {quest.detail && (
            <div className="bg-black/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Details</h3>
              <p className="text-white whitespace-pre-wrap">{quest.detail}</p>
            </div>
          )}
          
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            {quest.deadline && (
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-300 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Deadline</span>
                </div>
                <div className="text-white">{format(quest.deadline, "PPP")}</div>
              </div>
            )}
            
            {quest.estimated_time && (
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-300 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Estimated Time</span>
                </div>
                <div className="text-white">{quest.estimated_time} minutes</div>
              </div>
            )}
          </div>
          
          {/* Parent Quest */}
          {parentQuest && (
            <div className="bg-black/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <LayoutList className="h-4 w-4" />
                <span className="text-sm font-medium">Part of</span>
              </div>
              <div className="text-white flex items-center gap-2">
                {typeIcons[parentQuest.quest_type]}
                <span>{parentQuest.title}</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
