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
import { Check, Delete } from '@mui/icons-material';
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

  const completeHabit = async (habitId: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toISOString().split('T')[0];
        const isAlreadyCompletedToday = habit.completedDates.includes(today);
        
        if (!isAlreadyCompletedToday) {
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
    <Paper elevation={2}>
      <List>
        {habits.length === 0 ? (
          <ListItem>
            <ListItemText
              primary={
                <Typography align="center" color="textSecondary">
                  No habits added yet. Add your first habit to get started!
                </Typography>
              }
            />
          </ListItem>
        ) : (
          habits.map((habit) => {
            const completedToday = habit.lastCompleted ? isToday(new Date(habit.lastCompleted)) : false;
            return (
              <ListItem key={habit.id}>
                <ListItemText
                  primary={habit.name}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {habit.description && (
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {habit.description}
                        </Typography>
                      )}
                      <Chip
                        label={`${habit.streak} day streak`}
                        size="small"
                        color={habit.streak > 0 ? "primary" : "default"}
                        sx={{ mr: 1 }}
                      />
                      {completedToday && (
                        <Chip
                          label="Completed today"
                          size="small"
                          color="success"
                        />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => completeHabit(habit.id)}
                    disabled={completedToday}
                    color={completedToday ? undefined : "primary"}
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => deleteHabit(habit.id)}
                    color="error"
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