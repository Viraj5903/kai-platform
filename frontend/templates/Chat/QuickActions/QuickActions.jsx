import { ClickAwayListener, Grid, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';

import { setDisplayQuickActions, setInput } from '@/redux/slices/chatSlice';

/**
 * Renders the QuickActions component if open is true.
 * If open is false, returns null.
 *
 * @return {JSX.Element|null} The QuickActions component or null.
 */
const QuickActions = () => {
  const displayQuickActions = useSelector(
    (state) => state.chat.displayQuickActions // Selects the displayQuickActions property from the Redux store's chat state.
  );

  // The function to dispatch Redux actions.
  const dispatch = useDispatch();

  // For testing
  /**
   * Object containing quick actions with their corresponding descriptions.
   */
  const quickActions = {
    // Description for the summarize quick action.
    summarize: 'Summarize the topic',
    // Description for the suggestion quick action.
    suggestion: 'Suggest ways to learn interactive ways to learn to code.',
    // Description for the recommend_books quick action.
    recommend_books:
      'What books would you recommend for introduction to coding?',
  };

  /**
   * Handle action click event of the QuickActions component.
   *
   * When an action is clicked, the QuickActions component is closed and the selected action is dispatched as input to the chat.
   *
   * @param {string} quickActionSelected The selected quick action.
   * @return {void}
   */
  const handleActionClick = (quickActionSelected) => {
    // Close the QuickActions component
    dispatch(setDisplayQuickActions(false));

    // Dispatch the selected quick action as input to the chat
    dispatch(setInput(quickActions[quickActionSelected]));
  };

  /**
   * Handle close event of the QuickActions component.
   *
   * Closes the QuickActions component by dispatching an action to Redux.
   *
   * @return {void}
   */
  const handleClose = () => {
    // Dispatch an action to Redux to hide the QuickActions component.
    dispatch(setDisplayQuickActions(false));
  };

  /**
   * Renders the QuickActions component if displayQuickActions is true.
   * If displayQuickActions is false, returns null.
   *
   * @return {JSX.Element|null} The QuickActions component or null.
   */
  return displayQuickActions ? (
    // Wrap the QuickActions component with ClickAwayListener to handle clicks outside the component
    // ClickAwayListener triggers the handleClose function when a click occurs outside the component
    <ClickAwayListener onClickAway={handleClose}>
      {/* Render the Grid container for the QuickActions component */}
      <Grid {...styles.quickActionsGridContainer}>
        {/* Render each quick action as a Grid item */}
        {Object.keys(quickActions).map((action, key) => {
          // Generate a quick action component for each action
          // The quick action component is a Grid item that triggers the handleActionClick function when clicked
          return (
            <Grid
              key={key}
              onClick={() => handleActionClick(action)}
              {...styles.quickAction}
            >
              {/* Display the action text with a max height of 2 lines. The overflow is handled with ellipsis. */}
              <Typography {...styles.quickActionText}>
                {quickActions[action]}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </ClickAwayListener>
  ) : null;
};

export default QuickActions;
