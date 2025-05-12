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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Check, Delete, Close, Notes, History } from '@mui/icons-material';
import { format, isToday, differenceInDays } from 'date-fns';
import { Habit } from '../types';
import localforage from 'localforage';
import DailyNotesDialog from './DailyNotesDialog';

const HabitList: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

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
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const isAlreadyCompletedToday = habit.completedDates.includes(today);

    if (isAlreadyCompletedToday) {
      const updatedHabits = habits.map(h => {
        if (h.id === habitId) {
          const completedDates = h.completedDates.filter(date => date !== today);
          const previousDate = completedDates[completedDates.length - 1];
          const dailyNotes = h.dailyNotes.filter(note => note.date !== today);
          
          return {
            ...h,
            streak: previousDate && differenceInDays(new Date(today), new Date(previousDate)) === 1 ? h.streak - 1 : 0,
            lastCompleted: previousDate || null,
            completedDates,
            dailyNotes
          };
        }
        return h;
      });
      await saveHabits(updatedHabits);
    } else {
      setSelectedHabit(habit);
      setNoteDialogOpen(true);
    }
  };

  const handleNoteSubmit = async () => {
    if (!selectedHabit) return;

    const today = new Date().toISOString().split('T')[0];
    const updatedHabits = habits.map(habit => {
      if (habit.id === selectedHabit.id) {
        const lastCompleted = habit.lastCompleted;
        const streak = lastCompleted && differenceInDays(new Date(today), new Date(lastCompleted)) === 1
          ? habit.streak + 1
          : 1;

        return {
          ...habit,
          streak,
          lastCompleted: today,
          completedDates: [...habit.completedDates, today],
          dailyNotes: [...habit.dailyNotes, { date: today, description: noteText.trim() }]
        };
      }
      return habit;
    });

    await saveHabits(updatedHabits);
    setNoteDialogOpen(false);
    setNoteText('');
    setSelectedHabit(null);
  };

  const deleteHabit = async (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    await saveHabits(updatedHabits);
  };

  const handleViewHistory = (habit: Habit) => {
    setSelectedHabit(habit);
    setHistoryDialogOpen(true);
  };

  return (
    <>
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
                      onClick={() => handleViewHistory(habit)}
                      color="primary"
                      sx={{ 
                        mr: 1,
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      }}
                    >
                      <History />
                    </IconButton>
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

      <Dialog 
        open={noteDialogOpen} 
        onClose={() => setNoteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f6ff 100%)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'primary.main', fontWeight: 600 }}>
          Add Note for Today
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="How did it go today?"
            fullWidth
            multiline
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setNoteDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleNoteSubmit}
            variant="contained"
            color="secondary"
          >
            Save & Complete
          </Button>
        </DialogActions>
      </Dialog>

      {selectedHabit && (
        <DailyNotesDialog
          open={historyDialogOpen}
          onClose={() => setHistoryDialogOpen(false)}
          habitName={selectedHabit.name}
          notes={selectedHabit.dailyNotes}
        />
      )}
    </>
  );
};

export default HabitList; 