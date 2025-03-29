import { useState, KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { useQuest } from "../../context/QuestContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface QuickQuestInputProps {
  onQuestAdded?: () => void;
}

export function QuickQuestInput({ onQuestAdded }: QuickQuestInputProps) {
  const [title, setTitle] = useState("");
  const { addQuest } = useQuest();
  
  const handleAddQuest = () => {
    if (title.trim()) {
      addQuest({
        title: title.trim(),
        priority: "middle",
        status: "in_progress",
        quest_type: "task",
      });
      
      setTitle("");
      if (onQuestAdded) {
        onQuestAdded();
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddQuest();
    }
  };
  
  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a quick task..."
        className="bg-black/30 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
      />
      <Button
        onClick={handleAddQuest}
        disabled={!title.trim()}
        variant="translucent"
        size="icon"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
