import React from 'react'

import { Paper, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core'

const styles = {
  paper: { padding: '0 20px', margin: '10px 0', cursor: 'pointer' },
  avatar: { width: 100, height: 100, marginRight: 30 },
  text: { marginTop: 30 }
}

const ItemsList = props => {
  return (
    <div>
      {props.data.map(item => (
        <Paper
          key={item.key}
          style={styles.paper}
          onClick={() => props.history.push('/shop/' + item.key)}
          className='list-item__paper'
        >
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                style={styles.avatar}
                alt={item.name}
                src={item.photo}
              />
            </ListItemAvatar>
            <ListItemText
              style={styles.text}
              primary={item.name + ' - ' + item.price + '$'}
              secondary={item.description.length <= 50 ? item.description : item.description.slice(0, 40) + '...'}
            />
          </ListItem>
        </Paper>
      ))}
    </div>
  )
}

export default (ItemsList)