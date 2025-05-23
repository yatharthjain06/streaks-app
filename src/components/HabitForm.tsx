import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { HabitFormData, Habit } from '../types';
import localforage from 'localforage';

interface HabitFormProps {
  onHabitAdded: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onHabitAdded }) => {
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description?.trim(),
      streak: 0,
      lastCompleted: null,
      createdAt: new Date().toISOString(),
      completedDates: [],
      dailyNotes: []
    };

    const existingHabits = await localforage.getItem<Habit[]>('habits') || [];
    
    const updatedHabits = existingHabits.map(habit => ({
      ...habit,
      dailyNotes: habit.dailyNotes || []
    }));
    
    await localforage.setItem('habits', [...updatedHabits, newHabit]);
    
    setFormData({ name: '', description: '' });
    onHabitAdded();
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f6ff 100%)',
        border: '1px solid',
        borderColor: 'primary.light',
        borderRadius: 3,
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: 'primary.main',
          fontWeight: 600,
        }}
      >
        Add New Habit
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Habit Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <TextField
          fullWidth
          label="Description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          margin="normal"
          multiline
          rows={2}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            disabled={!formData.name.trim()}
            sx={{
              px: 4,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'secondary.dark',
              },
            }}
          >
            Add Habit
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default HabitForm; 