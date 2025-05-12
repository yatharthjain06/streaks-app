import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { format } from 'date-fns';
import { DailyNote } from '../types';

interface DailyNotesDialogProps {
  open: boolean;
  onClose: () => void;
  habitName: string;
  notes: DailyNote[];
}

const DailyNotesDialog: React.FC<DailyNotesDialogProps> = ({
  open,
  onClose,
  habitName,
  notes,
}) => {
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f6ff 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pr: 6,
        color: 'primary.main',
        fontWeight: 600
      }}>
        Daily Notes for {habitName}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'primary.main',
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {notes.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
            No daily notes yet.
          </Typography>
        ) : (
          <List>
            {sortedNotes.map((note) => (
              <ListItem 
                key={note.date}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'primary.light',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle1" 
                      color="primary.dark"
                      sx={{ fontWeight: 600 }}
                    >
                      {format(new Date(note.date), 'MMMM d, yyyy')}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {note.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DailyNotesDialog; 