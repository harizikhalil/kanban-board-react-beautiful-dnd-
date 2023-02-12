import React from "react";
function getStyle({ draggableStyle, virtualStyle, isDragging }) {
  const combined = {
    ...virtualStyle,
    ...draggableStyle,
  };

  const grid = 8;

  const result = {
    ...combined,
    height: isDragging ? combined.height : combined.height - grid,
    left: isDragging ? combined.left : combined.left + grid,
    width: isDragging
      ? draggableStyle.width
      : `calc(${combined.width} - ${grid * 2}px)`,
    marginBottom: grid,
  };

  return result;
}
const Task = ({ provided, item, style, isDragging }) => {
  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={getStyle({
        draggableStyle: provided.draggableProps.style,
        virtualStyle: style,
        isDragging,
      })}
      className={`item ${isDragging ? "is-dragging" : ""}`}
    >
      {item.content}
    </div>
  );
};

export default Task;
