import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, User } from 'lucide-react';

export type KanbanStage =
  | 'Applied'
  | 'Screened'
  | 'Shortlisted'
  | 'Interview R1'
  | 'Interview R2'
  | 'Final Round'
  | 'Offered'
  | 'Placed'
  | 'Rejected';

export const KANBAN_STAGES: KanbanStage[] = [
  'Applied', 'Screened', 'Shortlisted', 'Interview R1',
  'Interview R2', 'Final Round', 'Offered', 'Placed', 'Rejected',
];

export interface KanbanCard {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  matchScore?: number;
}

export interface KanbanBoardProps {
  columns: Record<KanbanStage, KanbanCard[]>;
  onCardMove?: (cardId: string, fromStage: KanbanStage, toStage: KanbanStage, newIndex: number) => void;
  className?: string;
}

const stageColors: Record<KanbanStage, string> = {
  Applied: 'bg-blue-500',
  Screened: 'bg-cyan-500',
  Shortlisted: 'bg-violet-500',
  'Interview R1': 'bg-amber-500',
  'Interview R2': 'bg-orange-500',
  'Final Round': 'bg-pink-500',
  Offered: 'bg-emerald-500',
  Placed: 'bg-green-500',
  Rejected: 'bg-red-500',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Sortable card component
const SortableCard: React.FC<{ card: KanbanCard; overlay?: boolean }> = ({ card, overlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      className={`
        group flex items-start gap-2.5 p-3 rounded-lg border border-[#27272a]
        bg-[#0f0f14] hover:border-[#3f3f46] transition-colors cursor-grab
        ${isDragging ? 'opacity-40' : ''}
        ${overlay ? 'shadow-2xl shadow-black/50 border-[#6366f1]/40 bg-[#18181f] rotate-2' : ''}
      `}
      {...(overlay ? {} : { ...attributes, ...listeners })}
    >
      <GripVertical size={14} className="text-[#3f3f46] mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
        {card.avatar ? (
          <img src={card.avatar} alt="" className="w-full h-full rounded-full object-cover" />
        ) : (
          getInitials(card.name)
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#fafafa] truncate">{card.name}</p>
        <p className="text-[10px] text-[#71717a] truncate">{card.role}</p>
        {card.matchScore !== undefined && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="h-1 flex-1 rounded-full bg-[#27272a] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#6366f1]"
                style={{ width: `${card.matchScore}%` }}
              />
            </div>
            <span className="text-[9px] text-[#52525b]">{card.matchScore}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Droppable column
const KanbanColumn: React.FC<{
  stage: KanbanStage;
  cards: KanbanCard[];
}> = ({ stage, cards }) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      className={`
        flex flex-col w-[260px] shrink-0 rounded-xl
        border border-[#27272a] bg-[#09090b]
        transition-all duration-200
        ${isOver ? 'border-[#6366f1]/40 bg-[#6366f1]/[0.02]' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-[#27272a]">
        <span className={`w-2 h-2 rounded-full ${stageColors[stage]}`} />
        <h3 className="text-xs font-semibold text-[#fafafa] flex-1">{stage}</h3>
        <span className="text-[10px] text-[#52525b] bg-[#18181f] px-1.5 py-0.5 rounded-md font-mono">
          {cards.length}
        </span>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className="flex-1 p-2 space-y-2 min-h-[120px] overflow-y-auto max-h-[500px]">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </SortableContext>
        {cards.length === 0 && (
          <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-[#27272a] text-[#3f3f46] text-xs">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns: initialColumns,
  onCardMove,
  className = '',
}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const findCardColumn = (cardId: string): KanbanStage | null => {
    for (const stage of KANBAN_STAGES) {
      if (columns[stage]?.some((c) => c.id === cardId)) return stage;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const stage = findCardColumn(active.id as string);
    if (stage) {
      const card = columns[stage].find((c) => c.id === active.id);
      setActiveCard(card || null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeStage = findCardColumn(activeId);
    // Check if over a column
    const overStage = KANBAN_STAGES.includes(overId as KanbanStage)
      ? (overId as KanbanStage)
      : findCardColumn(overId);

    if (!activeStage || !overStage || activeStage === overStage) return;

    setColumns((prev) => {
      const activeCards = [...prev[activeStage]];
      const overCards = [...prev[overStage]];
      const activeIndex = activeCards.findIndex((c) => c.id === activeId);
      const [movedCard] = activeCards.splice(activeIndex, 1);
      overCards.push(movedCard);

      return {
        ...prev,
        [activeStage]: activeCards,
        [overStage]: overCards,
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeStage = findCardColumn(activeId);
    const overStage = KANBAN_STAGES.includes(overId as KanbanStage)
      ? (overId as KanbanStage)
      : findCardColumn(overId);

    if (!activeStage || !overStage) return;

    if (activeStage === overStage) {
      const items = columns[activeStage];
      const oldIndex = items.findIndex((c) => c.id === activeId);
      const newIndex = items.findIndex((c) => c.id === overId);
      if (oldIndex !== newIndex) {
        setColumns((prev) => ({
          ...prev,
          [activeStage]: arrayMove(prev[activeStage], oldIndex, newIndex),
        }));
      }
    }

    if (activeStage !== overStage) {
      const newIndex = columns[overStage].findIndex((c) => c.id === activeId);
      onCardMove?.(activeId, activeStage, overStage, newIndex >= 0 ? newIndex : columns[overStage].length - 1);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={`flex gap-3 overflow-x-auto pb-4 ${className}`}>
        {KANBAN_STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            cards={columns[stage] || []}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard ? <SortableCard card={activeCard} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

KanbanBoard.displayName = 'KanbanBoard';

export { KanbanBoard };
export default KanbanBoard;
