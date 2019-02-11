export const BoardStyle = theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
  },
  board: {
    position: 'relative',
    width: 450,
    height: 450,
  },
  hover: {
    position: 'relative',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    top: 0,
    left: 15,
    zIndex: 1,
    '&>div': {
      transition: 'none',
    },
  },
  field: {
    position: 'absolute',
    top: 0,
    left: 15,
    padding: '75px 0 0 0',
    boxSizing: 'border-box',
    width: 420,
    height: 435,
    overflow: 'hidden',
    cursor: 'pointer',
  },
  column: {
    display: 'inline-flex',
    flexFlow: 'column wrap',
    height: 360,
  },
  front: {
    position: 'absolute',
    top: 60,
    border: '15px solid #007fff',
    borderRadius: 4,
    boxSizing: 'border-box',
    width: 450,
    height: 390,
    pointerEvents: 'none',
    background: 'radial-gradient(circle, transparent, transparent 18px, #007fff 20px, #007fff 23px, #1f90ff 23px, #1f90ff 36px, #007fff) center top/60px 60px',
  },
  disc: {
    position: 'relative',
    top: 0,
    width: 60,
    height: 60,
    color: '#fff',
    background: 'radial-gradient(circle, currentcolor 12px, #666 13px, currentcolor 14px, currentcolor 21px, #666 22px, transparent 23px, transparent) center/60px',
    opacity: 0,
    transition: 'opacity 0.2s, top 0s 0.2s, color 0s 0.2s',
  },
  red: {
    opacity: 1,
    color: '#cc0105',
  },
  black: {
    opacity: 1,
    color: '#000000',
  },
  slot: {
    width: 60,
    height: 60,
  },
  message: {
    textAlign: 'center',
    margin: 10,
    fontWeight: 900,
  },
  chips: {
    textAlign: 'center',
    marginTop: 20,
    '&>div': {
      margin: theme.spacing.unit,
    },
  },
});