export default {
    control: {
      backgroundColor: '#fff',
      wordBreak: 'break-word',
      fontSize: 14,
      fontWeight: 'normal',
    },
  
    highlighter: {
      overflow: 'hidden',
    },
  
    input: {
      margin: 0,
    },
  
    '&singleLine': {
      control: {
        display: 'inline-block',
  
        width: 130,
      },
  
      highlighter: {
        padding: 1,
        border: '2px inset transparent',
      },
  
      input: {
        padding: 1,
  
        border: '2px inset',
      },
    },
  
    '&multiLine': {
      control: {
        fontFamily: 'Lato,sans-serif!important',
        border: '1px solid silver',
      },
  
      highlighter: {
        padding: 9,
      },
  
      input: {
        overflow: 'auto',
        height: 70,
        padding: 9,
        minHeight: 63,
        outline: 0,
        border: 0,
      },
    },
  
    suggestions: {
      left:'0px',
      width: 'inherit',
      marginTop: '0px',
      bottom: '35px',
      top: 'auto',
      list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 14,
        overflowY:'auto',
        maxHeight:'80px',
      },
  
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
  
        '&focused': {
          backgroundColor: '#cee4e5',
        },
      },
    },
  }
  