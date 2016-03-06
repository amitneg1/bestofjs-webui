import { push } from 'react-router-redux';
import notie from 'notie';

import createApi from '../api/userContent';
import * as crud from './crudActions';

const api = createApi('reviews');

// ==========
// FETCH ALL
// ==========

export function fetchAllReviews() {
  return dispatch => {
    api.getAll()
      .then(json => dispatch(crud.fetchAllItemsSuccess('review', json)))
      .catch(err => {
        console.error('Error when calling Review API', err);
      });
  };
}

// ==========
// CREATE
// ==========

export function createReview(project, formData, auth) {
  const payload = Object.assign({}, formData, {
    project: project.id,
    createdBy: auth.username || 'Anonymous'
  });
  return dispatch => {
    // dispatch(createReviewRequest(payload));
    return api.create(payload, auth.token)
      .then(json => {
        const data = Object.assign({}, json);
        dispatch(crud.createItemSuccess('review', data));
        const path = `/projects/${project.id}/reviews/`;
        dispatch(push(path));
        notie.alert(1, 'Thank you for the review!', 3);
      })
      .catch(err => {
        console.error('Error when calling Review API', err);
        notie.alert(3, `Sorry, we were unable to save the review. ${err.message}`, 3);
      });
  };
}

// ==========
// UPDATE
// ==========

export function updateReview(formData, auth) {
  const payload = Object.assign({}, formData, {
    updatedBy: auth.username || 'Anonymous'
  });
  return dispatch => {
    // dispatch(updateReviewRequest(payload));
    return api.update(payload, auth.token)
      .then(json => {
        const data = Object.assign({}, json);
        dispatch(crud.updateItemSuccess('review', data));
        const path = `/projects/${formData.project}/reviews/`;
        dispatch(push(path));
        notie.alert(1, 'Your review has been updated.', 3);
      })
      .catch(err => {
        console.error('Error when calling Review API', err.message);
        notie.alert(3, 'Sorry, we were unable to save the review.', 3);
      });
  };
}
