import React, {Component} from 'react';
import Container from "@material-ui/core/Container";
import {loadMessages, sendMessage} from "../../../store/actions";
import {connect} from "react-redux";
import MessageForm from "../../MessageForm/MessageForm";
import Message from "../../Message/Message";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

class Chat extends Component {
  state = {
    author: '',
    message: '',
    error: false,
  };

  componentDidMount() {
    this.props.loadMessages();
    this.timer = setInterval(()=>this.props.loadByDate(this.props.lastMsgDate), 5000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.error !== this.props.error) {
      this.setState({error: true})
    }
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
  };
  sendMsg = async (e) => {
    e.preventDefault();
    await this.props.sendMsg({author: this.state.author, message: this.state.message});
    this.setState({author: '', message: ''});
  };
  render() {
    return (
        <Container maxWidth='md'>

          { this.props.messages.map(message => {
            let time = message.datetime;
            return (
                <Message key={message.id}
                         msgTxt={message.message}
                         msgAuthor={message.author}
                         time={time.substring(time.indexOf('T') + 1, time.indexOf('.'))}/>
              )})
          }
          <MessageForm
              onChange={this.handleChange}
              author={this.state.author}
              msg={this.state.message}
              onSubmit={e => this.sendMsg(e)}
          />
          <Snackbar
              open={this.state.error}
              autoHideDuration={2000}
              onClose={() => {this.setState({error: false})}}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <SnackbarContent style={{
              backgroundColor:'red',
            }} message={<span>{this.props.error}!</span>}
            />
          </Snackbar>
        </Container>
    );
  }
}
const mapStateToProps = state => ({
  messages: state.messages,
  lastMsgDate: state.lastMsgDate,
  error: state.error,
});
const mapDispatchToProps = dispatch => ({
  loadMessages: () => dispatch(loadMessages()),
  loadByDate: (date) => dispatch(loadMessages(date)),
  sendMsg: (msg) => dispatch(sendMessage(msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);