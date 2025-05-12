import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Check, Delete, Close } from '@mui/icons-material';
import { format, isToday, differenceInDays } from 'date-fns';
import { Habit } from '../types';
import localforage from 'localforage';

const HabitList: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const loadHabits = async () => {
      const savedHabits = await localforage.getItem<Habit[]>('habits');
      if (savedHabits) {
        setHabits(savedHabits);
      }
    };
    loadHabits();
  }, []);

  const saveHabits = async (updatedHabits: Habit[]) => {
    await localforage.setItem('habits', updatedHabits);
    setHabits(updatedHabits);
  };

  const toggleHabit = async (habitId: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toISOString().split('T')[0];
        const isAlreadyCompletedToday = habit.completedDates.includes(today);
        
        if (isAlreadyCompletedToday) {
          // Remove today's completion and update streak
          const completedDates = habit.completedDates.filter(date => date !== today);
          const previousDate = completedDates[completedDates.length - 1];
          
          return {
            ...habit,
            streak: previousDate && differenceInDays(new Date(today), new Date(previousDate)) === 1 ? habit.streak - 1 : 0,
            lastCompleted: previousDate || null,
            completedDates,
          };
        } else {
          // Complete the habit for today
          const lastCompleted = habit.lastCompleted;
          const streak = lastCompleted && differenceInDays(new Date(today), new Date(lastCompleted)) === 1
            ? habit.streak + 1
            : 1;

          return {
            ...habit,
            streak,
            lastCompleted: today,
            completedDates: [...habit.completedDates, today],
          };
        }
      }
      return habit;
    });

    await saveHabits(updatedHabits);
  };

  const deleteHabit = async (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    await saveHabits(updatedHabits);
  };

  return (
    <Paper 
      elevation={2}
      sx={{
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f6ff 100%)',
        border: '1px solid',
        borderColor: 'primary.light',
        borderRadius: 3,
      }}
    >
      <List>
        {habits.length === 0 ? (
          <ListItem>
            <ListItemText
              primary={
                <Typography 
                  align="center" 
                  sx={{ 
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  No habits added yet. Add your first habit to get started!
                </Typography>
              }
            />
          </ListItem>
        ) : (
          habits.map((habit) => {
            const completedToday = habit.lastCompleted ? isToday(new Date(habit.lastCompleted)) : false;
            return (
              <ListItem 
                key={habit.id}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'primary.light',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(103, 58, 183, 0.04)',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'primary.dark'
                      }}
                    >
                      {habit.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {habit.description && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary',
                            mb: 1
                          }}
                        >
                          {habit.description}
                        </Typography>
                      )}
                      <Chip
                        label={`${habit.streak} day streak`}
                        size="small"
                        color={habit.streak > 0 ? "primary" : "default"}
                        sx={{ 
                          mr: 1,
                          fontWeight: 500
                        }}
                      />
                      {completedToday && (
                        <Chip
                          label="Completed today"
                          size="small"
                          color="secondary"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => toggleHabit(habit.id)}
                    color={completedToday ? "secondary" : "primary"}
                    sx={{ 
                      mr: 1,
                      '&:hover': {
                        backgroundColor: completedToday ? 'secondary.light' : 'primary.light',
                      },
                    }}
                  >
                    {completedToday ? <Close /> : <Check />}
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => deleteHabit(habit.id)}
                    color="error"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'error.light',
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })
        )}
      </List>
    </Paper>
  );
};

export default HabitList; 