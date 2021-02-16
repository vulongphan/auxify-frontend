import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { faBan } from '@fortawesome/free-solid-svg-icons'

import api from '../api/api.js';


function QueueItem(props) {
  const room_id = props.room_id;
  const setCookie = props.setCookie;

  /**
   * update the vote of the song whose like button is clicked
   * @param {number} index: the index of the song in the queue whose like button is clicked
   */
  const onClickLike = (song_cookie, user_vote, index) => {
    let amount = 0;
    if (user_vote[1] === -1) {
      user_vote[1] = 1;
      amount = 2;
    }
    else if (user_vote[1] === 0) {
      user_vote[1] = 1;
      amount = 1;
    }
    else if (user_vote[1] === 1) {
      user_vote[1] = 0;
      amount = -1;
    }
    setCookie(song_cookie, user_vote[0] + "_" + user_vote[1], 4);
    
    let payload = { index: index, amount: amount };
    api.vote(room_id, payload)
      .then(() => console.log("Click liked button at " + index))
      .catch(err => console.log(err));
  }


  /**
   * update the vote of the song whose dislike button is clicked
   * @param {*} index: the index of the song in the queue whose dislike button is clicked
   */
  const onClickDislike = (song_cookie, user_vote, index) => {
    let amount = 0;
    if (user_vote[1] === -1) {
      user_vote[1] = 0;
      amount = 1;
    }
    else if (user_vote[1] === 0) {
      user_vote[1] = -1;
      amount = -1;
    }
    else if (user_vote[1] === 1) {
      user_vote[1] = -1;
      amount = -2;
    }
    setCookie(song_cookie, user_vote[0] + "_" + user_vote[1], 4);
    let payload = { index: index, amount: amount };
    api.vote(room_id, payload)
      .then(() => console.log("Click liked button at " + index))
      .catch(err => console.log(err));
  }

  /**
   * update the report of the song whose report button is clicked
   * @param {*} index 
   */
  const onClickReport = (song_cookie, user_vote, index) => {
    let amount = 0;
    if (user_vote[0] === 0) {
      user_vote[0] = 1;
      amount = 1;
    }
    else {
      user_vote[0] = 0;
      amount = -1;
    }
    setCookie(song_cookie, user_vote[0] + "_" + user_vote[1], 4);
    let payload = { index: index, amount: amount };
    api.report(room_id, payload)
      .then(() => console.log("Click reported button at " + index))
      .catch(err => console.log(err));
  }

  /* Rendering className of report/like/dislike button based on props.user_vote */
  const songInfo = props.songInfo;
  const song_cookie = props.room_id + "_" + props.id;
  let LIKE_CLASS = "like";
  let DISLIKE_CLASS = "dislike";
  let REPORT_CLASS = "report";
  if (props.user_vote !== undefined) {
    if (props.user_vote[1] === -1) {
      LIKE_CLASS = "like";
      DISLIKE_CLASS = "disliked";
    }
    else if (props.user_vote[1] === 0) {
      LIKE_CLASS = "like";
      DISLIKE_CLASS = "dislike";
    }
    else if (props.user_vote[1] === 1) {
      LIKE_CLASS = "liked";
      DISLIKE_CLASS = "dislike";
    }
    if (props.user_vote[0] === 0) {
      REPORT_CLASS = "report";
    }
    else REPORT_CLASS = "reported";
  }

  return (
    <tr className="queue-item">
      <td width="10%">
        <img alt="" src={songInfo.image_url} />
      </td>
      <td width="60%">
        <table>
          <tbody>
            <tr>
              <td
                className="queue-item__track-name text_style"
                align="left">
                {songInfo.name}</td>
            </tr>
            <tr>
              <td
                className="queue-item__artist-name text_style"
                align="left">
                {songInfo.artists.join(', ')}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td width="1%" className="text_style" id="report-cnt">
        {songInfo.report}
      </td>
      <td width="10%">
        <FontAwesomeIcon
          id={'report' + props.id}
          className={REPORT_CLASS}
          onClick={() => onClickReport(song_cookie, props.user_vote, props.index)}
          icon={faBan}
        />
      </td>
      <td width="10%">
        <FontAwesomeIcon
          id={'like' + props.id}
          className={LIKE_CLASS}
          onClick={() => onClickLike(song_cookie, props.user_vote, props.index)}
          icon={faHeart}
        />
      </td>
      <td width="10%">
        <FontAwesomeIcon
          id={'dislike' + props.id}
          className={DISLIKE_CLASS}
          onClick={() => onClickDislike(song_cookie, props.user_vote, props.index)}
          icon={faThumbsDown}
        />
      </td>

      <td width="5%" className="text_style" id="vote-cnt">
        {songInfo.vote}
      </td>
    </tr>
  );
}

class Queue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info_clicked: true
    }
  }
  render() {
    const queue = this.props.queue;

    return (
      <div className="queue-container">
        {!this.props.is_host &&
          <div className="text_style highlight" id="coming_up" >Coming Up</div>}
        {this.props.is_host &&
          <button
            className="text_style highlight" id="play_next"
            onClick={this.props.play}> Play Next
            </button>}
        {this.props.is_host &&
          <FontAwesomeIcon className="text_style highlight" id="info" icon={faInfoCircle}
            onClick={() => {
              if (this.state.info_clicked === false) this.setState({ info_clicked: true });
              else this.setState({ info_clicked: false })
            }} />
        }
        {this.props.is_host && this.state.info_clicked &&
          <div className="text_style" id="instruction">
            <div> Click 'Play Next' to skip to the next song </div>
            <div> Click on the info circle to hide this alert </div>
          </div>
        }
        <table id="queue">
          <tbody>
            {queue.map((song, index) => {
              let songInfo = {};
              songInfo = {
                image_url: song.image_url,
                name: song.name,
                artists: song.artists,
                vote: song.vote,
                report: song.report
              };
              let song_cookie = this.props.room_id + "_" + song.id;
              let user_vote = this.props.user_votes[song_cookie]; // user_vote[0] is report count and user_vote[1] is vote count
              return (
                <QueueItem
                  room_id={this.props.room_id}
                  key={song.id}
                  id={song.id}
                  index={index}
                  songInfo={songInfo}
                  setCookie = {this.props.setCookie}
                  user_vote={user_vote} />
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Queue;