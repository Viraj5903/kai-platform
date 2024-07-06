import { useState } from 'react';
import moment from 'moment';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CircularProgress, Fab, Grid, Typography } from '@mui/material';

import { useSelector } from 'react-redux';

import ChatHistory from '../ChatHistory';

import styles from './styles';

const testData = [
  {
    createdAt: 'Thu Jul 04 2024 10:19:32 GMT-0400 (Eastern Daylight Time)',
    id: 'H4yMmnuIJAfGT76YWnZ2',
    messages: [
      {
        payload: {
          text: 'Hi Kai. I am Test. How are you doing? I am fine what about you?',
          role: 'human',
          timestamp: 'Thu Jun 27 2024 10:19:32 GMT-0400 (Eastern Daylight Time)',
          type: 'text',
        },
      },
      {
        payload: {
          text: '👋 Hi Test! I am here to help you with any educational queries you may have. Feel free to ask me anything! 📚',
          role: 'ai',
          timestamp: 'Thu Jun 27 2024 10:19:34 GMT-0400 (Eastern Daylight Time)',
          type: 'text',
        },
      },
    ],
    type: 'chat',
    updatedAt: 'Thu Jun 26 2024 10:19:32 GMT-0400 (Eastern Daylight Time)',
    user: {
      email: 'test@gmail.com',
      fullName: 'Test',
      id: 'Nn1j4XPFbu3U0hKTUURXoTomhoSe',
    },
  },
  {
    createdAt: 'Thu Jun 27 2024 10:19:32 GMT-0400 (Eastern Daylight Time)',
    id: 'H4yMmnuIJAfGT76YWnZ3',
    messages: [
      {
        payload: {
          text: 'Hi Kai.',
          role: 'human',
          timestamp: 'Thu Jun 27 2024 10:19:32 GMT-0400 (Eastern Daylight Time)',
          type: 'text',
        },
      },
      {
        payload: {
          text: '👋 Hi Test! I am here to help you with any educational queries you may have. Feel free to ask me anything! 📚',
          role: 'ai',
          timestamp: 'Thu Jun 27 2022 10:19:34 GMT-0400 (Eastern Daylight Time)',
          type: 'text',
        },
      },
    ],
    type: 'chat',
    updatedAt: 'Thu Jun 27 2024 10:19:32 GMT-0400 (Eastern Daylight Time)',
    user: {
      email: 'test@gmail.com',
      fullName: 'Test',
      id: 'Nn1j4XPFbu3U0hKTUURXoTomhoSe',
    },
  },
];

const ChatHistoryWindow = () => {
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const historyLoaded = useSelector((state) => state.chat.historyLoaded);

  const toggleHistorySidebar = () => {
    setShowHistorySidebar(!showHistorySidebar);
  };

  const chatHistoryLoader = () => {
    return (
      <Grid container justifyContent="center" alignItems="center" height="100%">
        <CircularProgress disableShrink size={75} color="primary" />
      </Grid>
    );
  };

  const filterChatHistory = (category) => {
    const now = moment();
    switch (category) {
      case 'Today':
        return testData.filter(chat => moment(chat.createdAt).isSame(now, 'day'));
      case 'Yesterday':
        return testData.filter(chat => moment(chat.createdAt).isSame(now.clone().subtract(1, 'day'), 'day'));
      case 'Previous Week':
        return testData.filter(chat => moment(chat.createdAt).isBetween(now.clone().subtract(1, 'week').startOf('week'), now.clone().subtract(1, 'week').endOf('week')));
      case 'Older Chat':
        return testData.filter(chat => moment(chat.createdAt).isBefore(now.clone().subtract(1, 'week').startOf('week')));
      default:
        return testData;
    }
  };

  const renderChatHistory = (category) => {
    const filteredChats = filterChatHistory(category);
    if (filteredChats.length === 0) return null;

    return (
      <>
        <Typography variant="h6">{category}</Typography>
        <ChatHistory history={filteredChats} />
      </>
    );
  };

  return (
    <Grid {...styles.historySideBar(showHistorySidebar)}>
      <Grid {...styles.historySideBarHeader}>
        <Grid {...styles.historySideBarTitle(showHistorySidebar)}>
          <Typography {...styles.historySideBarTitleText}>
            Chat History
          </Typography>
        </Grid>
        <Fab
          aria-label={showHistorySidebar ? 'close chat history' : 'open chat history'}
          size="medium"
          onClick={toggleHistorySidebar}
          {...styles.toggleHistoryButton(showHistorySidebar)}
        >
          {showHistorySidebar ? <RemoveIcon /> : <AddIcon />}
        </Fab>
      </Grid>

      <Grid {...styles.historySideBarContent(showHistorySidebar)}>
        {!historyLoaded ? (
          <>
            {renderChatHistory('Today')}
            {renderChatHistory('Yesterday')}
            {renderChatHistory('Previous Week')}
            {renderChatHistory('Older Chat')}
          </>
        ) : (
          chatHistoryLoader()
        )}
      </Grid>
    </Grid>
  );
};

export default ChatHistoryWindow;
