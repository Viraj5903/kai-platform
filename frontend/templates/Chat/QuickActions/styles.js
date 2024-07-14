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
      position: 'relative',
      padding: '5px 10px',
      paddingLeft: '40px',
      flexDirection: 'row',
      flex: '1',
      backgroundColor: 'transparent',
      color: 'rgb(88,20,244)',
      border: '2px solid rgb(88,20,244)',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, color 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgb(88,20,244)',
        color: 'white',
        '&::before': { // star transition
          background: 'white', 
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      },
      '&::before': { // star shape styling
        content: '""',
        position: 'absolute',
        width: '23px',
        height: '23px',
        left: '8px',
        top: '17px',
        background: 'rgb(88,20,244)',
        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', // CSS star shape
        
      },
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
