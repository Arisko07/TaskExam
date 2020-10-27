/**
 * View component for /tasks/:taskId
 *
 * Displays a single task from the 'byId' map in the task reducer
 * as defined by the 'selected' property
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import actions
import * as taskActions from '../taskActions';
import * as noteActions from '../../note/noteActions'
import * as userActions from '../../user/userActions'

// import global components
import Binder from '../../../global/components/Binder.js.jsx';

// import resource components
import TaskLayout from '../components/TaskLayout.js.jsx';
import NoteComment from '../../note/components/NoteComment.js.jsx';
import NoteLayout from '../../note/components/NoteLayout.js.jsx';
import NoteListItem from '../../note/components/NoteListItem.js.jsx';

import { CheckboxInput, TextAreaInput } from '../../../global/components/forms';

class SingleTask extends Binder {
  constructor(props) {
    super(props);
    this.state = {
      note: _.cloneDeep(this.props.defaultNote.obj)
    }

    this._bind(
      '_handleFormChange'
      , '_handleNoteSubmit'
    );
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(taskActions.fetchSingleIfNeeded(match.params.taskId));
    dispatch(noteActions.fetchDefaultNote());
    dispatch(noteActions.fetchListIfNeeded('_task', match.params.taskId));
    dispatch(userActions.fetchListIfNeeded());
  }

  componentWillReceiveProps(nextProps) {
    const { 
      dispatch, 
      match 
    } = this.props;

    dispatch(noteActions.fetchListIfNeeded('_task', match.params.taskId));
    this.setState({
      note: _.cloneDeep(nextProps.defaultNote.obj)
    })
  }

  _handleTaskStatusUpdate(status) {

    const { taskStore, dispatch } = this.props;
    let selectedTask = taskStore.selected.getItem();

    selectedTask.complete = (status == "approve") ? true: false;
    selectedTask.status = status;

    dispatch(taskActions.sendUpdateTask(selectedTask)).then(taskRes => {
      if(taskRes.success) {

      } else {
        alert("ERROR - Check logs");
      }
    })
  }
  
  _handleFormChange(e) {
    /**
     * This let's us change arbitrarily nested objects with one pass
     */
    let newState = _.update(this.state, e.target.name, () => {
      return e.target.value;
    });
    this.setState({newState});
  }

  _handleNoteSubmit(e) {
    e.preventDefault();

    const { 
      defaultNote, 
      taskStore, 
      loggedInUser, 
      dispatch, 
      match 
    } = this.props;
    
    var noteComment = {...this.state.note};

    const selectedTask = taskStore.selected.getItem();

    noteComment._flow = selectedTask._flow;
    noteComment._user = loggedInUser._id;
    noteComment._task = match.params.taskId;

    dispatch(noteActions.sendCreateNote(noteComment)).then(noteRes => {
      if(noteRes.success) {
        dispatch(noteActions.invalidateList('_task', match.params.taskId));
        this.setState({
          note: _.cloneDeep(defaultNote.obj)
        });
      } else {
        alert("ERROR - Check logs");
      }
    });
  }
  render() {
    const { note } = this.state;
    const { 
      defaultNote, 
      match, 
      taskStore,
      noteStore,
      userStore,
      loggedInUser
    } = this.props;
  
    const selectedTask = taskStore.selected.getItem();
    
    const isEmpty = (
      !selectedTask
      || !selectedTask._id
      || taskStore.selected.didInvalidate
    );

    const isFetching = (
      taskStore.selected.isFetching
    )
    console.log(noteStore)
    const noteList = noteStore.lists && noteStore.lists._task ? noteStore.lists._task[match.params.taskId] : null;

    const noteListItems = noteStore.util.getList("_task", match.params.taskId);
    console.log(userStore)
    const isNoteListEmpty = (
      !noteListItems
      || !noteList
    );

    const isNoteListFetching = (
      !noteListItems
      || !noteList
      || noteList.isFetching
    );
    
    const isnoteCommentEmpty = !note;

    const parseDatetime = (datetime) => {
      let date = new Date(datetime);

      return date.toLocaleDateString() + ' @ ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
    const parseUser = (user) => {
     
      return (user.firstName + " " + user.lastName)
    
    }
    const isAdmin = (loggedInUser.roles) ? loggedInUser.roles.includes("admin") : false;

    return (
      <TaskLayout>
        { isEmpty ?
          (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>) :
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <div className="content-header">
              <div className="title-description-container">
                <div className="title">  
                <h1> { selectedTask.name } </h1>
                </div>
                <p>{ selectedTask.description }</p>
                {
                  (isAdmin && selectedTask.status === "open") ?
                <div className="btn-admin-container">
                  <button className="yt-btn approve" onClick={() => this._handleTaskStatusUpdate('approve')}>Approve</button>
                  <button className="yt-btn reject" onClick={() => this._handleTaskStatusUpdate('reject')}>Reject</button>
                </div> : ''
                }
              </div>
              <div className="btn-container">
                <Link className="yt-btn x-small bordered comment" to={`${this.props.match.url}/update`}> Edit </Link>
              </div>
            </div>
            <hr/>
            <div>
            {
              isNoteListEmpty ? "" :
              <div style={{ opacity: isNoteListFetching ? 0.5 : 1}}>
                <ul className="comment-list">
                  {noteListItems.map((note, i) =>
                    <li key={note._id + i}>
                      <div className="placeholder-wrapper">
                        <div className="placeholder"></div>
                      </div>
                      <div>
                  <h3>{parseUser(userStore.byId[note._user])}</h3>
                        <p>{parseDatetime(note.created)}</p>
                        <p>{note.content}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            }
            </div>
            <hr/>
            {
            !isnoteCommentEmpty ?
              <div>
                <NoteComment
                  note={note}
                  handleFormChange={this._handleFormChange}
                  handleFormSubmit={this._handleNoteSubmit}
                />
              </div> : <div></div>
            }
          </div>
        }
      </TaskLayout>
    )
  }
}

SingleTask.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStoreToProps = (store) => {
  /**
  * NOTE: Yote refer's to the global Redux 'state' as 'store' to keep it mentally
  * differentiated from the React component's internal state
  */
  return {
    defaultNote: store.note.defaultItem,
    taskStore: store.task, 
    noteStore: store.note,
    userStore: store.user,
    loggedInUser: store.user.loggedIn.user
  }
}

export default withRouter(
  connect(
    mapStoreToProps
  )(SingleTask)
);
