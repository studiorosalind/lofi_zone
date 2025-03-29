import { Check, Clock, Calendar, MoreVertical, Trash, Edit } from "lucide-react";
import { Quest } from "../../context/QuestContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "../../lib/utils";

interface QuestCardProps {
  quest: Quest;
  onToggleStatus: (id: string) => void;
  onOpenMenu?: (id: string, event: React.MouseEvent) => void;
  onCardClick?: (quest: Quest) => void;
  onDelete?: (id: string) => void;
  onEdit?: (quest: Quest) => void;
  compact?: boolean;
  showMenuOptions?: boolean;
}

export function QuestCard({ 
  quest, 
  onToggleStatus, 
  onOpenMenu, 
  onCardClick,
  onDelete,
  onEdit,
  compact = false,
  showMenuOptions = false
}: QuestCardProps) {
  const priorityColors = {
    high: "text-red-400",
    middle: "text-yellow-400",
    low: "text-blue-400",
  };

  const statusColors = {
    planned: "bg-blue-500/20 border-blue-500",
    in_progress: "bg-yellow-500/20 border-yellow-500",
    done: "bg-green-500/20 border-green-500",
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 bg-black/20 rounded-lg transition-all",
        quest.status === "done" ? "opacity-70" : "opacity-100",
        onCardClick ? "cursor-pointer hover:bg-black/30" : ""
      )}
      onClick={onCardClick ? () => onCardClick(quest) : undefined}
    >
      {/* Status indicator */}
      <button
        onClick={() => onToggleStatus(quest.id)}
        className={cn(
          "h-6 w-6 rounded-full flex items-center justify-center border",
          statusColors[quest.status]
        )}
      >
        {quest.status === "done" && <Check className="h-4 w-4 text-green-500" />}
      </button>

      {/* Quest content */}
      <div className="flex-1 min-w-0">
        <div className={cn(
          "font-medium flex items-center gap-2",
          quest.status === "done" ? "line-through" : ""
        )}>
          <span className="truncate">{quest.title}</span>
          <span className={cn("text-xs font-bold", priorityColors[quest.priority])}>
            {quest.priority !== "middle" && quest.priority.toUpperCase()}
          </span>
        </div>
        
        {!compact && (
          <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
            {quest.deadline && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDistanceToNow(quest.deadline, { addSuffix: true })}</span>
              </div>
            )}
            {quest.estimated_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{quest.estimated_time} min</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {onOpenMenu && !showMenuOptions && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onOpenMenu(quest.id, e);
          }}
          className="p-1 hover:bg-white/10 rounded-full"
        >
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      )}
      
      {/* Direct action buttons when showMenuOptions is true */}
      {showMenuOptions && (
        <div className="flex items-center gap-1">
          {onEdit && (
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onEdit(quest);
              }}
              className="p-1 hover:bg-white/10 rounded-full text-blue-400 hover:text-blue-300"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          
          {onDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onDelete(quest.id);
              }}
              className="p-1 hover:bg-white/10 rounded-full text-red-400 hover:text-red-300"
              title="Delete"
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
