// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const TaskListItem = ({
  task
}) => {
  return (
    <li>
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <Link className="yt-btn x-small bordered" to={`/tasks/${task._id}`}> Comment </Link>
      
    </li>
  )
}
//<Link to={`/tasks/${task._id}`}> {task.name}</Link>
TaskListItem.propTypes = {
  task: PropTypes.object.isRequired
}

export default TaskListItem;
