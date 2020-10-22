/**
 * Reusable stateless form component for Note
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';

// import form components
import { TextAreaInput } from '../../../global/components/forms';

const NoteComment = ({
  formTitle,
  handleFormChange,
  handleFormSubmit,
  note
}) => {
  const header = formTitle ? <div className="formHeader"><h2> {formTitle} </h2><hr/></div> : <div/>;
  return (
  <div className="form-container -slim">
    <form name="noteForm" className="note-form" onSubmit={handleFormSubmit}>
      {header}
      <TextAreaInput
        change={handleFormChange}
        name="note.content"
        value={note.content}
      />
      <div className="input-group">
        <div className="yt-row space-between">
          <button className="yt-btn bordered comment" type="submit" > Add Comment </button>
        </div>
      </div>
    </form>
  </div>
  )
}

NoteComment.propTypes = {
  formTitle: PropTypes.string,
  handleFormChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  note: PropTypes.object.isRequired
}

NoteComment.defaultProps = {
 formTitle: ''
}

export default NoteComment;