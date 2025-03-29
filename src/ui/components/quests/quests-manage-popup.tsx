import { X, Plus, Trash, Edit } from "lucide-react";
import { useQuest, Quest } from "../../context/QuestContext";
import { QuestCard } from "./quest-card";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

interface QuestsManagePopupProps {
  open: boolean;
  onClose: () => void;
  onCreateQuest: () => void;
  onEditQuest: (quest: Quest) => void;
}


export function QuestsManagePopup({ open, onClose, onCreateQuest, onEditQuest }: QuestsManagePopupProps) {
  const { 
    getChapterQuests, 
    getPlotQuests, 
    getQuestsByParent, 
    getOrphanedTasks,
    toggleQuestStatus,
    deleteQuest
  } = useQuest();
  
  // Get all chapters
  const chapters = getChapterQuests();
  
  // Get plots without chapters (orphaned plots)
  const plots = getPlotQuests();
  const orphanedPlots = plots.filter(plot => !plot.dependent_on);
  
  // Get tasks without any parent
  const orphanedTasks = getOrphanedTasks();

  // Handle delete confirmation
  const handleDelete = (quest: Quest) => {
    if (window.confirm(`Are you sure you want to delete "${quest.title}"?`)) {
      deleteQuest(quest.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()} modal={true}>
      <DialogContent className="bg-gray-800/95 backdrop-blur-xl text-white border-gray-700 max-w-2xl max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Manage Quests</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-400">
            Organize your quests by chapter, plot, and task
          </div>
          <Button 
            onClick={onCreateQuest}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Quest
          </Button>
        </div>
        
        <ScrollArea className="h-[60vh] pr-4">
          {/* Chapters with their plots and tasks */}
          {chapters.length > 0 && (
            <Accordion type="multiple" className="w-full">
              {chapters.map((chapter) => {
                const chapterPlots = getQuestsByParent(chapter.id);
                
                return (
                  <AccordionItem 
                    key={chapter.id} 
                    value={chapter.id}
                    className="border-b border-gray-700"
                  >
                    <div className="flex items-center">
                      <AccordionTrigger className="flex-1 py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{chapter.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            chapter.status === "done" ? "bg-green-500/20 text-green-400" :
                            chapter.status === "in_progress" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-blue-500/20 text-blue-400"
                          }`}>
                            {chapter.status}
                          </span>
                        </div>
                      </AccordionTrigger>
                      
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-gray-700/50"
                          onClick={() => onEditQuest(chapter)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-gray-700/50"
                          onClick={() => handleDelete(chapter)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <AccordionContent className="pl-4">
                      {/* Plots under this chapter */}
                      {chapterPlots.length > 0 ? (
                        <Accordion type="multiple" className="w-full">
                          {chapterPlots.map((plot) => {
                            const plotTasks = getQuestsByParent(plot.id);
                            
                            return (
                              <AccordionItem 
                                key={plot.id} 
                                value={plot.id}
                                className="border-b border-gray-700/50"
                              >
                                <div className="flex items-center">
                                  <AccordionTrigger className="flex-1 py-2 hover:no-underline">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{plot.title}</span>
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        plot.status === "done" ? "bg-green-500/20 text-green-400" :
                                        plot.status === "in_progress" ? "bg-yellow-500/20 text-yellow-400" :
                                        "bg-blue-500/20 text-blue-400"
                                      }`}>
                                        {plot.status}
                                      </span>
                                    </div>
                                  </AccordionTrigger>
                                  
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-gray-700/50"
                                      onClick={() => onEditQuest(plot)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-gray-700/50"
                                      onClick={() => handleDelete(plot)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                <AccordionContent className="pl-4 space-y-2">
                                  {/* Tasks under this plot */}
                                  {plotTasks.length > 0 ? (
                                    plotTasks.map((task) => (
                                      <div key={task.id} className="flex items-center">
                                        <QuestCard 
                                          quest={task} 
                                          onToggleStatus={toggleQuestStatus}
                                          onEdit={(quest) => onEditQuest(quest)}
                                          onDelete={() => handleDelete(task)}
                                          compact
                                          showMenuOptions
                                        />
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-sm text-gray-400 py-2">
                                      No tasks in this plot
                                    </div>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      ) : (
                        <div className="text-sm text-gray-400 py-2">
                          No plots in this chapter
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
          
          {/* Orphaned plots (plots without chapters) */}
          {orphanedPlots.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Independent Plots</h3>
              <Accordion type="multiple" className="w-full">
                {orphanedPlots.map((plot) => {
                  const plotTasks = getQuestsByParent(plot.id);
                  
                  return (
                    <AccordionItem 
                      key={plot.id} 
                      value={plot.id}
                      className="border-b border-gray-700"
                    >
                      <div className="flex items-center">
                        <AccordionTrigger className="flex-1 py-2 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{plot.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              plot.status === "done" ? "bg-green-500/20 text-green-400" :
                              plot.status === "in_progress" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-blue-500/20 text-blue-400"
                            }`}>
                              {plot.status}
                            </span>
                          </div>
                        </AccordionTrigger>
                        
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-gray-700/50"
                            onClick={() => onEditQuest(plot)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-gray-700/50"
                            onClick={() => handleDelete(plot)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <AccordionContent className="pl-4 space-y-2">
                        {/* Tasks under this plot */}
                        {plotTasks.length > 0 ? (
                          plotTasks.map((task) => (
                            <div key={task.id} className="flex items-center">
                              <QuestCard 
                                quest={task} 
                                onToggleStatus={toggleQuestStatus}
                                onEdit={(quest) => onEditQuest(quest)}
                                onDelete={() => handleDelete(task)}
                                compact
                                showMenuOptions
                              />
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-400 py-2">
                            No tasks in this plot
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          )}
          
          {/* Orphaned tasks (tasks without any parent) */}
          {orphanedTasks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Independent Tasks</h3>
              <div className="space-y-2">
                {orphanedTasks.map((task) => (
                  <QuestCard 
                    key={task.id} 
                    quest={task} 
                    onToggleStatus={toggleQuestStatus}
                    onEdit={(quest) => onEditQuest(quest)}
                    onDelete={() => handleDelete(task)}
                    showMenuOptions
                  />
                ))}
              </div>
            </div>
          )}
          
          {chapters.length === 0 && orphanedPlots.length === 0 && orphanedTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <div className="text-center mb-4">
                No quests found. Create your first quest to get started.
              </div>
              <Button 
                onClick={onCreateQuest}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Quest
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
