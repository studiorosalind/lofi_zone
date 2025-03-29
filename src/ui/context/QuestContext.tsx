import { createContext, useState, useContext, ReactNode } from "react";

// Quest data model
export interface Quest {
  id: string;
  title: string;
  detail?: string;
  deadline?: Date;
  priority: 'high' | 'middle' | 'low';
  estimated_time?: number; // in minutes, default 25
  status: 'planned' | 'in_progress' | 'done';
  quest_type: 'chapter' | 'plot' | 'task';
  dependent_on?: string; // id of another quest
}

// Context type
interface QuestContextType {
  quests: Quest[];
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (id: string, quest: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  getQuestById: (id: string) => Quest | undefined;
  getTaskQuests: () => Quest[];
  getChapterQuests: () => Quest[];
  getPlotQuests: () => Quest[];
  getQuestsByParent: (parentId: string) => Quest[];
  getOrphanedTasks: () => Quest[];
  toggleQuestStatus: (id: string) => void;
}

// Create context
const QuestContext = createContext<QuestContextType | undefined>(undefined);

// Sample data for testing
const sampleQuests: Quest[] = [
  
];

// Provider component
export const QuestProvider = ({ children }: { children: ReactNode }) => {
  const [quests, setQuests] = useState<Quest[]>(sampleQuests);

  // Add a new quest
  const addQuest = (quest: Omit<Quest, "id">) => {
    const newQuest: Quest = {
      ...quest,
      id: `quest-${Date.now()}`,
    };
    setQuests((prev) => [...prev, newQuest]);
  };

  // Update an existing quest
  const updateQuest = (id: string, updatedFields: Partial<Quest>) => {
    setQuests((prev) =>
      prev.map((quest) =>
        quest.id === id ? { ...quest, ...updatedFields } : quest
      )
    );
  };

  // Delete a quest
  const deleteQuest = (id: string) => {
    setQuests((prev) => prev.filter((quest) => quest.id !== id));
  };

  // Get a quest by ID
  const getQuestById = (id: string) => {
    return quests.find((quest) => quest.id === id);
  };

  // Get all task-type quests
  const getTaskQuests = () => {
    return quests.filter((quest) => quest.quest_type === "task");
  };

  // Get all chapter-type quests
  const getChapterQuests = () => {
    return quests.filter((quest) => quest.quest_type === "chapter");
  };

  // Get all plot-type quests
  const getPlotQuests = () => {
    return quests.filter((quest) => quest.quest_type === "plot");
  };

  // Get quests that depend on a specific parent
  const getQuestsByParent = (parentId: string) => {
    return quests.filter((quest) => quest.dependent_on === parentId);
  };

  // Get tasks without a chapter/plot parent
  const getOrphanedTasks = () => {
    return quests.filter(
      (quest) => quest.quest_type === "task" && !quest.dependent_on
    );
  };

  // Toggle a quest's status between done and its previous state
  const toggleQuestStatus = (id: string) => {
    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.id === id) {
          if (quest.status === "done") {
            // If it's done, revert to in_progress
            return { ...quest, status: "in_progress" };
          } else {
            // If it's not done, mark as done
            return { ...quest, status: "done" };
          }
        }
        return quest;
      })
    );
  };

  return (
    <QuestContext.Provider
      value={{
        quests,
        addQuest,
        updateQuest,
        deleteQuest,
        getQuestById,
        getTaskQuests,
        getChapterQuests,
        getPlotQuests,
        getQuestsByParent,
        getOrphanedTasks,
        toggleQuestStatus,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};

// Custom hook for using the quest context
export const useQuest = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error("useQuest must be used within a QuestProvider");
  }
  return context;
};
