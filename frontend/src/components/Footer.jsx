import React from "react";

const Footer = ({ completedTasksCount = 0, activeTasksCount = 0 }) => {
  return (
    <>
      {completedTasksCount + activeTasksCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {completedTasksCount > 0 && (
              <>
                🎉Wonderfull! You completed {completedTasksCount} Task
                {activeTasksCount > 0 &&
                  `, Some ${activeTasksCount} Task. Fighting!`}
              </>
            )}

            {completedTasksCount === 0 && activeTasksCount > 0 && (
              <>Let's Start {activeTasksCount} Task!</>
            )}
          </p>
        </div>
      )}
    </>
  );
};

export default Footer;
