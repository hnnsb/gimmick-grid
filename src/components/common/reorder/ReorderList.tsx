import React, {ReactNode, useEffect, useRef, useState} from 'react';
import './reorder-list.css';

export interface ReorderListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onReorder?: (newItems: T[]) => void;
  itemClassName?: string;
  listClassName?: string;
  dragDisabled?: boolean;
  showIndexNumbers?: boolean;
}

function ReorderList<T>({
                          items,
                          renderItem,
                          onReorder,
                          itemClassName = '',
                          listClassName = '',
                          dragDisabled = false,
                          showIndexNumbers = false,
                        }: Readonly<ReorderListProps<T>>) {
  const [list, setList] = useState<T[]>(items);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Synchronisiere mit externen Änderungen an items
  useEffect(() => {
    setList(items);
  }, [items]);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;

    const element = e.currentTarget as HTMLElement;
    element.classList.add('reorder-drag-over');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('reorder-drag-over');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();

    // Entferne alle Markierungen
    document.querySelectorAll('.reorder-drag-over').forEach(el => {
      el.classList.remove('reorder-drag-over');
    });

    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const newList = [...list];
    const draggedItem = newList.splice(dragItem.current, 1)[0];
    newList.splice(dragOverItem.current, 0, draggedItem);

    setList(newList);

    if (onReorder) {
      onReorder(newList);
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className={`reorder-list ${listClassName} ${!dragDisabled ? 'reorder-enabled' : ''}`}>
      {list.map((item, index) => (
        <div role={"draggable"}
             key={index}
             className={`reorder-item ${itemClassName} ${dragItem.current === index ? 'reorder-dragging' : ''}`}
             draggable={!dragDisabled}
             onDragStart={() => handleDragStart(index)}
             onDragOver={!dragDisabled ? handleDragOver : undefined}
             onDragEnter={(e) => !dragDisabled && handleDragEnter(e, index)}
             onDragLeave={!dragDisabled ? handleDragLeave : undefined}
             onDragEnd={!dragDisabled ? handleDragEnd : undefined}
        >
          {showIndexNumbers && (
            <div className="reorder-index-number">{index + 1}</div>
          )}
          <div className="reorder-content">
            {renderItem(item, index)}
          </div>
          {!dragDisabled && (
            <div className="reorder-handle">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor"
                      d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"/>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReorderList;
