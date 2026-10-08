import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const PRIORITIES = ['P1', 'P2', 'P3'];

function PriorityToggle({ taskTitle, value, onChange }) {
  // Clicking the selected button reports null; ignoring it keeps one priority selected.
  const handleChange = (event, priority) => {
    if (priority) onChange(priority);
  };

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={handleChange}
      className="priority-toggle"
      aria-label={`Priority for ${taskTitle}`}
    >
      {PRIORITIES.map(priority => (
        <ToggleButton key={priority} value={priority} className="priority-button">
          {priority}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default PriorityToggle;
