import { useEffect, useRef, useState } from 'react';

import {
  ArrowDownwardOutlined,
  InfoOutlined,
  Settings,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Fade,
  Grid,
  InputAdornment,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';

import NavigationIcon from '@/assets/svg/Navigation.svg';
import UnionPurpleIcon from '@/assets/svg/UnionPurple.svg';

import { MESSAGE_ROLE, MESSAGE_TYPES } from '@/constants/bots';

import ROUTES from '@/constants/routes';

import ChatSpinner from '../ChatSpinner';
import DiscoveryLibrary from '../DiscoveryLibrary';
import Message from '../Message';
import QuickActions from '../QuickActions';

import TextMessage from '../TextMessage';

import styles from './styles';

import {
  openInfoChat,
  resetChat,
  setActionType,
  setChatSession,
  setDisplayQuickActions,
  setError,
  setFullyScrolled,
  setInput,
  setMessages,
  setMore,
  setSessionLoaded,
  setStreaming,
  setStreamingDone,
  setTyping,
} from '@/redux/slices/chatSlice';

import createChatSession from '@/services/chatbot/createChatSession';
import sendMessage from '@/services/chatbot/sendMessage';

const DiscoveryLibraryWindow = (props) => {
  const { isDiscoveryOpen } = props;
  const dispatch = useDispatch();
  const {
    more,
    input,
    typing,
    chat,
    sessionLoaded,
    openSettingsChat,
    infoChatOpened,
    fullyScrolled,
    streamingDone,
    streaming,
    error,
    displayQuickActions,
    actionType,
  } = useSelector((state) => state.chat);
  const { data: userData } = useSelector((state) => state.user);
  const messagesContainerRef = useRef();
  const sessionId = localStorage.getItem('sessionId');

  const currentSession = chat;
  const chatMessages = currentSession?.messages;
  const showNewMessageIndicator = !fullyScrolled && streamingDone;
  const router = useRouter();
  const isDiscoveryPage = router.pathname === ROUTES.DISCOVERY;
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const startConversation = async (message) => {
    // Optionally dispatch a temporary message for the user's input
    dispatch(
      setMessages({
        role: MESSAGE_ROLE.HUMAN,
        message,
      })
    );

    dispatch(setTyping(true));

    // Define the chat payload
    const chatPayload = {
      user: {
        id: userData?.id,
        fullName: userData?.fullName,
        email: userData?.email,
      },
      type: 'chat',
      message,
    };

    // Send a chat session
    const { status, data } = await createChatSession(chatPayload, dispatch);

    // Remove typing bubble
    dispatch(setTyping(false));
    if (status === 'created') dispatch(setStreaming(true));

    // Set chat session
    dispatch(setChatSession(data));
    dispatch(setSessionLoaded(true));
    setSelectedPrompt(null);
    // dispatch(fetchHistory(userData.id));
  };

  const handleSendMessage = async () => {
    if (!input) {
      dispatch(setError('Please enter a message'));
      setTimeout(() => {
        dispatch(setError(null));
      }, 3000);
      return;
    }

    // BUG FIX: First checking whether the user has entered any text before setting streaming true amd then sending the message.
    dispatch(setStreaming(true));

    const message = {
      role: MESSAGE_ROLE.HUMAN,
      type: MESSAGE_TYPES.TEXT,
      payload: {
        text: input,
        action: actionType,
      },
    };

    if (!chatMessages) {
      // Start a new conversation if there are no existing messages
      await startConversation(message);
      return;
    }

    // Add the user's message to the chat
    dispatch(
      setMessages({
        role: MESSAGE_ROLE.HUMAN,
        message,
      })
    );

    dispatch(setTyping(true));

    // Ensure the user’s message is displayed before sending the message
    setTimeout(async () => {
      await sendMessage({ message, id: sessionId }, dispatch);
    }, 0);
    dispatch(setActionType(null));
  };

  const handleQuickReply = async (option) => {
    dispatch(setInput(option));
    dispatch(setStreaming(true));

    const message = {
      role: MESSAGE_ROLE.HUMAN,
      type: MESSAGE_TYPES.QUICK_REPLY,
      payload: {
        text: option,
        action: actionType,
      },
    };

    dispatch(
      setMessages({
        role: MESSAGE_ROLE.HUMAN,
      })
    );
    dispatch(setTyping(true));

    await sendMessage({ message, id: currentSession?.id }, dispatch);

    dispatch(setActionType(null));
  };

  const handleOnScroll = () => {
    const scrolled =
      Math.abs(
        messagesContainerRef.current.scrollHeight -
          messagesContainerRef.current.clientHeight -
          messagesContainerRef.current.scrollTop
      ) <= 1;

    if (fullyScrolled !== scrolled) dispatch(setFullyScrolled(scrolled));
  };

  const handleScrollToBottom = () => {
    messagesContainerRef.current?.scrollTo(
      0,
      messagesContainerRef.current?.scrollHeight,
      {
        behavior: 'smooth',
      }
    );

    dispatch(setStreamingDone(false));
  };
  /* Push Enter */
  const keyDownHandler = async (e) => {
    if (typing || !input || streaming) return;
    if (e.keyCode === 13) handleSendMessage();
  };

  const renderQuickAction = () => {
    return (
      <InputAdornment position="start">
        <Grid
          onClick={() => dispatch(setDisplayQuickActions(!displayQuickActions))}
          {...styles.quickActionButton}
        >
          <AddIcon {...styles.quickActionButtonAddIcon} />
          <Typography>Actions</Typography>
        </Grid>
      </InputAdornment>
    );
  };

  const renderSendIcon = () => {
    return (
      <InputAdornment position="end">
        <IconButton
          onClick={handleSendMessage}
          {...styles.bottomChatContent.iconButtonProps(
            typing || error || !input || streaming
          )}
        >
          <NavigationIcon />
        </IconButton>
      </InputAdornment>
    );
  };

  const renderCustomPrompt = () => {
    if (selectedPrompt) {
      return (
        <Grid
          onClick={() => dispatch(setMore({ role: 'shutdown' }))}
          {...styles.centerChat.centerChatGridProps}
        >
          <Grid {...styles.cardGridProps}>
            <Grid {...styles.cardContent}>
              <Typography {...styles.cardTitleProps}>
                {selectedPrompt.title}
              </Typography>
              <Grid item {...styles.unionPurpleIcon}>
                <UnionPurpleIcon />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
    return null;
  };
  const renderStartChatMessage = () => {
    return (
      <TextMessage
        isMyMessage={false}
        message="Hi! What would you like to build today?**"
      />
    );
  };

  const renderCenterChatContent = () => {
    if (selectedPrompt) {
      return renderCustomPrompt(); // Render custom prompt if selected
    }
    return (
      <Grid
        onClick={() => dispatch(setMore({ role: 'shutdown' }))}
        {...styles.centerChat.centerChatGridProps}
      >
        <Grid
          ref={messagesContainerRef}
          onScroll={handleOnScroll}
          {...styles.centerChat.messagesGridProps}
        >
          {/* Render the start chat message if there are no chat messages or if the info chat is not open. */}
          {(chatMessages?.length === 0 || !chatMessages) && !infoChatOpened
            ? renderStartChatMessage()
            : null}
          {chatMessages?.map(
            (message, index) =>
              message?.role !== MESSAGE_ROLE.SYSTEM && (
                <Message
                  ref={messagesContainerRef}
                  {...message}
                  messagesLength={chatMessages?.length}
                  messageNo={index + 1}
                  onQuickReply={handleQuickReply}
                  streaming={streaming}
                  fullyScrolled={fullyScrolled}
                  key={index}
                />
              )
          )}
          {typing && <ChatSpinner />}
        </Grid>
      </Grid>
    );
  };
  const renderNewMessageIndicator = () => {
    return (
      <Fade in={showNewMessageIndicator}>
        <Button
          startIcon={<ArrowDownwardOutlined />}
          onClick={handleScrollToBottom}
          {...styles.newMessageButtonProps}
        />
      </Fade>
    );
  };

  const renderBottomChatContent = () => {
    if (!openSettingsChat && !infoChatOpened)
      return (
        <Grid {...styles.bottomChatContent.bottomChatContentGridProps}>
          {/* Default Prompt Component */}
          {/* <DefaultPrompt handleSendMessage={handleSendMessage} /> */}

          {/* Quick Actions Component */}
          <QuickActions handleSendMessage={handleSendMessage} />
          <Grid {...styles.bottomChatContent.chatInputGridProps(!!error)}>
            <TextField
              value={input}
              onChange={(e) => dispatch(setInput(e.currentTarget.value))}
              onKeyUp={keyDownHandler}
              error={!!error}
              helperText={error}
              disabled={!!error}
              focused={false}
              {...styles.bottomChatContent.chatInputProps(
                renderQuickAction,
                renderSendIcon,
                !!error
              )}
            />
          </Grid>
        </Grid>
      );

    return null;
  };

  return (
    <Grid container {...styles.chatInterface}>
      {/* Discovery Library Slide */}
      {isDiscoveryPage && (
        <Slide
          direction="right"
          in={isDiscoveryOpen}
          mountOnEnter
          unmountOnExit
        >
          <Grid item {...styles.discoveryLibrary(isDiscoveryOpen)}>
            <DiscoveryLibrary
              show={isDiscoveryOpen}
              selectedPrompt={setSelectedPrompt}
            />
          </Grid>
        </Slide>
      )}

      <Grid item {...styles.chatGridProps(isDiscoveryOpen)}>
        {/* Center Chat Content */}
        {renderCenterChatContent()}
        {renderNewMessageIndicator()}
        {/* Bottom Chat Content */}
        {renderBottomChatContent()}
      </Grid>
    </Grid>
  );
};

export default DiscoveryLibraryWindow;