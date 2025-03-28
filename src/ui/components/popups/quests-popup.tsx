"use client"

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useQuest } from "../../context/QuestContext";
import { QuestCard } from "../quests/quest-card";
import { QuestsManagePopup } from "../quests/quests-manage-popup";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface QuestsPopupProps {
  onClose: () => void;
}

export default function QuestsPopup({ onClose }: QuestsPopupProps) {
  const { getTaskQuests, toggleQuestStatus } = useQuest();
  const [manageQuestsOpen, setManageQuestsOpen] = useState(false);

  // Get all task-type quests
  const taskQuests = getTaskQuests();

  // Sort quests by:
  // 1. Status (in_progress > planned > done)
  // 2. Priority (high > middle > low)
  // 3. Deadline (ascending)
  // 4. Estimated time (ascending)
  const sortedQuests = [...taskQuests].sort((a, b) => {
    // Status sorting
    const statusOrder = { in_progress: 0, planned: 1, done: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }

    // Priority sorting
    const priorityOrder = { high: 0, middle: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Deadline sorting (if both have deadlines)
    if (a.deadline && b.deadline) {
      return a.deadline.getTime() - b.deadline.getTime();
    } else if (a.deadline) {
      return -1; // a has deadline, b doesn't
    } else if (b.deadline) {
      return 1; // b has deadline, a doesn't
    }

    // Estimated time sorting
    const aTime = a.estimated_time || 25;
    const bTime = b.estimated_time || 25;
    return aTime - bTime;
  });

  // Calculate progress
  const completedQuests = taskQuests.filter(q => q.status === "done").length;
  const totalQuests = taskQuests.length;
  const progressText = `${completedQuests}/${totalQuests}`;

  return (
    <>
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-xl text-white p-6 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quests</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <ScrollArea className="h-[40vh] pr-4">
            <div className="space-y-3">
              {sortedQuests.length > 0 ? (
                sortedQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onToggleStatus={toggleQuestStatus}
                  />
                ))
              ) : (
                <div className="text-center py-6 text-gray-400">
                  No tasks found. Create a new quest to get started.
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
            <div className="text-sm text-gray-300">Progress: {progressText}</div>
            <Button
              onClick={() => setManageQuestsOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Manage Quests
            </Button>
          </div>
        </div>
      </div>

      {/* Manage Quests Popup */}
      {manageQuestsOpen && (
        <QuestsManagePopup
          open={manageQuestsOpen}
          onClose={() => setManageQuestsOpen(false)}
        />
      )}
    </>
  );
}
