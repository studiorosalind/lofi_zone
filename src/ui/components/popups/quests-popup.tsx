"use client"

import { useState, useCallback, useMemo } from "react";
import { X, Plus } from "lucide-react";
import { useQuest, Quest } from "../../context/QuestContext";
import { QuestCard } from "../quests/quest-card";
import { QuestsManagePopup } from "../quests/quests-manage-popup";
import { QuestFormPopup } from "../quests/quest-form-popup";
import { QuestDetailModal } from "../quests/quest-detail-modal";
import { QuestCompletionEffect } from "../quests/quest-completion-effect";
import { QuickQuestInput } from "../quests/quick-quest-input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface QuestsPopupProps {
  onClose: () => void;
}

export default function QuestsPopup({ onClose }: QuestsPopupProps) {
  const { getTaskQuests, toggleQuestStatus } = useQuest();
  const [manageQuestsOpen, setManageQuestsOpen] = useState(false);
  const [formQuestOpen, setFormQuestOpen] = useState(false);
  const [questToEdit, setQuestToEdit] = useState<Quest | undefined>(undefined);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [completedQuestId, setCompletedQuestId] = useState<string | null>(null);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);

  // Get all task-type quests
  const taskQuests = getTaskQuests();
  
  // Filter and sort quests - use useMemo to avoid recalculating on every render
  const visibleQuests = useMemo(() => {
    // Filter out completed quests that should be hidden
    const filtered = taskQuests.filter(quest => 
      quest.status !== "done" || !completedQuestId || quest.id !== completedQuestId
    );
    
    // Sort quests
    return [...filtered].sort((a, b) => {
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
  }, [taskQuests, completedQuestId]);

  // Calculate progress
  const progressText = useMemo(() => {
    const completedQuests = taskQuests.filter(q => q.status === "done").length;
    const totalQuests = taskQuests.length;
    return `${completedQuests}/${totalQuests}`;
  }, [taskQuests]);

  // Custom toggle status handler to show completion effect - use useCallback to avoid recreating on every render
  const handleToggleStatus = useCallback((id: string) => {
    const quest = taskQuests.find(q => q.id === id);
    if (quest && quest.status !== "done") {
      // If marking as done, show completion effect
      setCompletedQuestId(id);
      setShowCompletionEffect(true);
    } else {
      // If unmarking as done, just toggle without effects
      setCompletedQuestId(null);
    }
    // The actual toggle happens in the toggleQuestStatus function
    toggleQuestStatus(id);
  }, [taskQuests, toggleQuestStatus]);
  
  // Handle completion effect finished - use useCallback to avoid recreating on every render
  const handleCompletionEffectFinished = useCallback(() => {
    setShowCompletionEffect(false);
    // Keep the completedQuestId to keep filtering it out
  }, []);

  // Handle quest card click - use useCallback to avoid recreating on every render
  const handleQuestCardClick = useCallback((quest: Quest) => {
    setSelectedQuest(quest);
  }, []);

  // Handle quest detail modal close - use useCallback to avoid recreating on every render
  const handleQuestDetailClose = useCallback(() => {
    setSelectedQuest(null);
  }, []);

  // Handle manage quests open - use useCallback to avoid recreating on every render
  const handleManageQuestsOpen = useCallback(() => {
    setManageQuestsOpen(true);
  }, []);

  // Handle manage quests close - use useCallback to avoid recreating on every render
  const handleManageQuestsClose = useCallback(() => {
    setManageQuestsOpen(false);
  }, []);

  // Handle create quest - use useCallback to avoid recreating on every render
  const handleCreateQuest = useCallback(() => {
    setManageQuestsOpen(false);
    setFormQuestOpen(true);
  }, []);

  // Handle edit quest - use useCallback to avoid recreating on every render
  const handleEditQuest = useCallback((quest: Quest) => {
    setQuestToEdit(quest);
    setFormQuestOpen(true);
  }, []);

  // Handle form close - use useCallback to avoid recreating on every render
  const handleFormClose = useCallback(() => {
    setFormQuestOpen(false);
    setQuestToEdit(undefined);
  }, []);

  // Handle form closed - use useCallback to avoid recreating on every render
  const handleFormClosed = useCallback(() => {
    setFormQuestOpen(false);
    setQuestToEdit(undefined);
    setManageQuestsOpen(true);
  }, []);

  // Handle quest added - use useCallback to avoid recreating on every render
  const handleQuestAdded = useCallback(() => {
    setCompletedQuestId(null);
  }, []);

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
              {visibleQuests.length > 0 ? (
                visibleQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onToggleStatus={handleToggleStatus}
                    onCardClick={handleQuestCardClick}
                  />
                ))
              ) : (
                <div className="text-center py-6 text-gray-400">
                  No tasks found. Create a new quest to get started.
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Quest Input */}
          <QuickQuestInput onQuestAdded={handleQuestAdded} />
          
          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
            <div className="text-sm text-gray-300">Progress: {progressText}</div>
            <Button
              onClick={handleManageQuestsOpen}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Manage Quests
            </Button>
          </div>
        </div>
      </div>

      {/* Manage Quests Popup */}
      {manageQuestsOpen && !formQuestOpen && (
        <QuestsManagePopup
          open={manageQuestsOpen}
          onClose={handleManageQuestsClose}
          onCreateQuest={handleCreateQuest}
          onEditQuest={handleEditQuest}
        />
      )}

      {/* Quest Form Popup */}
      {formQuestOpen && (
        <QuestFormPopup
          open={formQuestOpen}
          onClose={handleFormClose}
          onFormClosed={handleFormClosed}
          questToEdit={questToEdit}
        />
      )}
      
      {/* Quest Detail Modal */}
      {selectedQuest && (
        <QuestDetailModal
          quest={selectedQuest}
          open={!!selectedQuest}
          onClose={handleQuestDetailClose}
        />
      )}
      
      {/* Quest Completion Effect */}
      <QuestCompletionEffect
        show={showCompletionEffect}
        onComplete={handleCompletionEffectFinished}
      />
    </>
  );
}
