import React from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'

import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Paper, ListItem, ListItemAvatar, Avatar, ListItemText, List, Divider } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import errorImg from '../img/img-placeholder.svg'

const styles = {
  paper: { margin: '10px auto', padding: 20, maxWidth: 600 },
}

const History = props => {
  if (!props._history || !Array.isArray(props._history) || props._history.length === 0) {
    return (
      <Paper
        style={styles.paper}
      >
        <Typography
          align='center'
          variant='h4'
        >
          You haven't made any purchases yet! Go to
        <Link to='/shop' style={{ textDecoration: 'none', fontWeight: 'bold' }}> shop </Link>
          and buy something!
      </Typography>
      </Paper>
    )
  }

  return (
    <div style={{ marginTop: 30 }}>
      {props._history.map(record => (
        <ExpansionPanel key={record.key}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography >{record.date} - {record.totalPrice}$</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List>
              {record.items.map((item, index) => (
                <React.Fragment key={item.key}>
                  <ListItem alignItems="flex-start" style={{ margin: 10 }}>
                    <ListItemAvatar style={{ marginTop: -5 }}>
                      <Avatar
                        alt={item.name}
                        src={item.photo}
                        className='avatar'
                        onError={evt => evt.target.src = errorImg}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.quantity + ' x ' + item.name}
                    />
                  </ListItem>
                  {index !== record.items.length - 1 ? <Divider /> : null}
                </React.Fragment>
              ))}
            </List>






          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  )
}

const mapStateToProps = state => ({
  _history: state.user.history
})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History)