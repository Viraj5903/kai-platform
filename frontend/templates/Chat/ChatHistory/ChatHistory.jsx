import { Grid, List, ListItem, Typography } from '@mui/material';

import { useSelector } from 'react-redux';

import styles from './styles';

/**
 * ChatHistory component displays a list of chat entries.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.history - The array of chat entries to display.
 * @return {JSX.Element} The rendered ChatHistory component.
 */
const ChatHistory = ({ history }) => {
  // Get the current chat session ID from the Redux store
  const currentChatSessionId = useSelector((state) => state.chat.chat.id);

  /**
   * Render a ListItem component for each chat entry in the history array.
   * @param {Object} entry - A chat entry object.
   * @return {JSX.Element} The rendered ListItem component.
   */
  const renderListItem = (entry) => (
    <ListItem key={entry.id}>
      {/* Render a Typography component with the text of the first message in the chat entry. */}
      <Typography
        // Apply different styles based on whether the entry is the current chat session
        {...(currentChatSessionId === entry.id
          ? styles.chatHistoryTextCurrent
          : styles.chatHistoryText)}
      >
        {entry.messages[0].payload.text}
      </Typography>
    </ListItem>
  );

  /**
   * Render a CenterChatContentNoMessages component if the history array is empty.
   * @return {JSX.Element} The rendered CenterChatContentNoMessages component.
   */
  const centerChatContentNoMessages = () => (
    <Grid {...styles.centerChatContentNoMessage}>
      <Typography variant="p">No chat history</Typography>
    </Grid>
  );

  // Renders the chat history.
  // If there's no chat history, it renders a message indicating so.
  // Otherwise, it renders a List component containing a ListItem component for each chat entry.
  return (
    // Check if there's no chat history
    history.length === 0 ? (
      // If there's no chat history, render a message indicating so.
      centerChatContentNoMessages()
    ) : (
      // Otherwise, render a List component containing a ListItem component for each chat entry.
      <List>
        {/*
          Map over each chat entry and render a ListItem component.
          The ListItem component is rendered using the renderListItem function.
        */}
        {history.map(renderListItem)}
      </List>
    )
  );
};

export default ChatHistory;
