const handleKeyPress = (event, updateTask) => {
  if (event.key === "Enter") {
    updateTask();
  }
};

export default handleKeyPress;
