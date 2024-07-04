/**
 * Styles for the chat history list item text.
 */
const styles = {
  /**
   * Styles for the chat history text.
   *
   * @property {Object} sx The styled-components styles.
   */
  chatHistoryText: {
    sx: {
      width: '100%', // Set the width of the chat history list item text to 100%.
      whiteSpace: 'nowrap', // Prevent wrapping of the text to the next line.
      overflow: 'hidden', // Hide any overflowing content.
      textOverflow: 'ellipsis', // If the text overflows, hide the part that does and add ellipsis at the end to indicate that the text has been truncated.
    },
  },
  /**
   * Style for the chat history text that is currently selected.
   */
  chatHistoryTextCurrent: {
    sx: {
      color: 'rgba(115,80,255,255)',
      width: '100%', // Set the width of the chat history list item text to 100%.
      whiteSpace: 'nowrap', // Prevent wrapping of the text to the next line.
      overflow: 'hidden', // Hide any overflowing content.
      textOverflow: 'ellipsis', // If the text overflows, hide the part that does and add ellipsis at the end to indicate that the text has been truncated.
    },
  },

  centerChatContentNoMessage: {
    container: true,
    justifyContent: 'center',
    alignItems: 'center',
    sx: {
      width: '100%',
      height: '10%',
      textAlign: 'center',
    },
  },
};

export default styles;
