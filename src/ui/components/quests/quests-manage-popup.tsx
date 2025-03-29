import { X, Plus, MoreVertical } from "lucide-react";
import { useQuest, Quest } from "../../context/QuestContext";
import { QuestCard } from "./quest-card";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

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
    toggleQuestStatus 
  } = useQuest();
  
  const chapters = getChapterQuests();
  const orphanedTasks = getOrphanedTasks();

  const handleOpenMenu = (questId: string, event: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      onEditQuest(quest);
    }
  };

  // Get all quests for dropdown menu
  const quests = [...getChapterQuests(), ...getPlotQuests(), ...getOrphanedTasks()];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
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
            variant="translucent"
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
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700/50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                          <DropdownMenuItem 
                            className="hover:bg-gray-700 cursor-pointer"
                            onClick={() => onEditQuest(chapter)}
                          >
                            Modify Quest
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700/50"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                                      <DropdownMenuItem 
                                        className="hover:bg-gray-700 cursor-pointer"
                                        onClick={() => onEditQuest(plot)}
                                      >
                                        Modify Quest
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                
                                <AccordionContent className="pl-4 space-y-2">
                                  {/* Tasks under this plot */}
                                  {plotTasks.length > 0 ? (
                                    plotTasks.map((task) => (
                                      <div key={task.id} className="flex items-center">
                                        <QuestCard 
                                          quest={task} 
                                          onToggleStatus={toggleQuestStatus}
                                          onOpenMenu={handleOpenMenu}
                                          compact
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
          
          {/* Orphaned tasks (tasks without chapter/plot) */}
          {orphanedTasks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Independent Tasks</h3>
              <div className="space-y-2">
                {orphanedTasks.map((task) => (
                  <QuestCard 
                    key={task.id} 
                    quest={task} 
                    onToggleStatus={toggleQuestStatus}
                    onOpenMenu={handleOpenMenu}
                  />
                ))}
              </div>
            </div>
          )}
          
          {chapters.length === 0 && orphanedTasks.length === 0 && (
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
