import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { PRIORITIES } from './priority';

const UNSELECTED_COLOR = '#7A7A7A';
const SELECTED_COLOR = '#07F2E6';

const buttonStyles = {
  minWidth: 48,
  minHeight: 48,
  fontWeight: 600,
  color: '#ffffff',
  backgroundColor: UNSELECTED_COLOR,
  '&:hover': { backgroundColor: UNSELECTED_COLOR },
  '&.Mui-selected, &.Mui-selected:hover': {
    color: '#212121',
    backgroundColor: SELECTED_COLOR,
  },
};

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
      aria-label={`Priority for ${taskTitle}`}
    >
      {PRIORITIES.map(priority => (
        <ToggleButton key={priority} value={priority} sx={buttonStyles}>
          {priority}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default PriorityToggle;
