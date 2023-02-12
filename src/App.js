import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FixedSizeList, areEqual } from "react-window";
import Task from "./Task";
import "./App.css";
const itemsFromBackend = [
  { id: "5", content: "task 1" },
  { id: "6", content: " task 2" },
  { id: "7", content: " task 3" },
  { id: "8", content: " task 4" },
  { id: "9", content: "task 5" },
  { id: "10", content: "task 6" },
  { id: "11", content: " task 7" },
  { id: "12", content: " task 8" },
  { id: "13", content: " task 9" },
  { id: "14", content: "task 10" },
];

const columnsFromBackend = [
  {
    name: "Requested",
    items: itemsFromBackend,
  },
  {
    name: "To do",
    items: [],
  },
  {
    name: "In Progress",
    items: [],
  },
  {
    name: "Done",
    items: [],
  },
];

const Row = React.memo(function Row(props) {
  const { data: items, index, style } = props;
  const item = items[index];

  // We are rendering an extra item for the placeholder
  if (!item) {
    return null;
  }

  return (
    <Draggable draggableId={item.id} index={index} key={item.id}>
      {(provided) => <Task provided={provided} item={item} style={style} />}
    </Draggable>
  );
}, areEqual);
const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    setColumns(columnsFromBackend);
  }, []);
  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            console.log("columnId", columnId);
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable
                    droppableId={columnId}
                    key={columnId}
                    mode="virtual"
                    renderClone={(provided, snapshot, rubric) => (
                      <Task
                        provided={provided}
                        isDragging={snapshot.isDragging}
                        item={column.items[rubric.source.index]}
                        style={{}}
                      />
                    )}
                  >
                    {(provided, snapshot) => {
                      const itemCount = snapshot.isUsingPlaceholder
                        ? column.items.length + 1
                        : column.items.length;
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 300,
                            height: 500,
                          }}
                        >
                          {column.items.length > 0 ? (
                            <FixedSizeList
                              height={480}
                              itemCount={itemCount}
                              itemSize={116}
                              width={280}
                              // you will want to use List.outerRef rather than List.innerRef as it has the correct height when the list is unpopulated
                              outerRef={provided.innerRef}
                              itemData={column.items}
                              className="task-list"
                            >
                              {Row}
                            </FixedSizeList>
                          ) : (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              style={{
                                width: "100%",
                                height: 500,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              no items find
                            </div>
                          )}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
      {/* <style>
        {`
        .item{
          background:red;
        }
        .item.is-dragging{
          background: yellow;
          color:blue
        }
        
        .task-list{
          padding: 8px;
          flex-grow: 1;
          transition:  background-color ease 0.2s;
        }
        
        `}
      </style> */}
    </>
  );
}

export default App;
