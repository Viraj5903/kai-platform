/**
 * Styles for the QuickActions component
 */
const styles = {
  /**
   * Styles for the container of the quick actions
   */
  quickActionsGridContainer: {
    container: true,
    sx: {
      width: '90%',
      display: 'flex',
      flexDirection: 'row',
      gap: '10px',
      marginBottom: '10px',
    },
  },
  /**
   * Styles for a single quick action
   */
  quickAction: {
    container: true,
    item: true,
    sx: {
      padding: '5px 10px',
      flexDirection: 'row',
      flex: '1',
      backgroundColor: 'transparent',
      color: 'rgb(88,20,244)',
      border: '2px solid rgb(88,20,244)',
      borderRadius: '10px',
      cursor: 'pointer',
    },
  },
  /**
   * Styles for the text of a quick action
   */
  quickActionText: {
    sx: {
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
};

export default styles;
