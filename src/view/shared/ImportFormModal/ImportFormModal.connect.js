import connect from 'view/utils/connect';
import Component from './ImportFormModal.jsx';

export default connect(
  props => props.formModal,
  dispatch => ({
    onClose: () => dispatch({type: 'on-mindset-import-form-modal-close'}),

    onFileChange: data =>
      dispatch({type: 'on-mindset-import-form-modal-file-change', data}),

    onImport: () => dispatch({type: 'on-mindset-import-form-modal-import'})
  })
)(Component);
