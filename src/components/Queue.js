import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import api from '../api/api.js';


function QueueItem(props) {
  const room_id = props.room_id;
  const LIKE = 'liked';
  const DISLIKE = 'disliked';
  const LIKE_BTN_ID = 'like' + props.id;
  const DISLIKE_BTN_ID = 'dislike' + props.id;

  /**
   * update the vote of the song whose like button is clicked
   * @param {number} index: the index of the song in the queue whose like button is clicked
   */
  const onClickLike = (index) => {
    var payload;
    var likeList = document.getElementById(LIKE_BTN_ID).classList; //return the className(s) of the LIKE button element as a list
    var dislikeList = document.getElementById(DISLIKE_BTN_ID).classList; //return the className(s) of the Dislike button element as a list
    if (!likeList.contains(LIKE)) { //if the song has not been liked before
      if (!dislikeList.contains(DISLIKE)) payload = { index: index, amount: 1 };
      else { //if the song has been disliked before
        payload = { index: index, amount: 2 };
        dislikeList.remove(DISLIKE);
      }
      likeList.add(LIKE);
      //if the song has been liked before
    } else {
      payload = { index: index, amount: -1 };
      likeList.remove(LIKE);
    }
    api.vote(room_id, payload)
      .then(() => console.log("Click liked button at " + index))
      .catch(err => console.log(err));
  }

  /**
   * update the vote of the song whose dislike button is clicked
   * @param {*} index: the index of the song in the queue whose dislike button is clicked
   */
  const onClickDislike = (index) => {
    var payload;
    var likeList = document.getElementById(LIKE_BTN_ID).classList;
    var dislikeList = document.getElementById(DISLIKE_BTN_ID).classList;
    if (!dislikeList.contains(DISLIKE)) {
      //if the song has not been disliked before
      if (!likeList.contains(LIKE)) payload = { index: index, amount: -1 };
      //if the song has been liked before
      else {
        payload = { index: index, amount: -2 };
        likeList.remove(LIKE);
      }
      dislikeList.add(DISLIKE);
      //if the song has been disliked before
    } else {
      payload = { index: index, amount: 1 };
      dislikeList.remove(DISLIKE);
    }
    api.vote(room_id, payload)
      .then(() => console.log("Click disliked button at " + index))
      .catch(err => console.log(err));
  }

  const songInfo = props.songInfo;
  return (
    <tr className="queue-item">
      <td width="10%">
        <img alt="" src={songInfo.image} />
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
                {songInfo.artists.map(artist => artist.name).join(', ')}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td width="15%">
        <button
          id={'like' + props.id}
          className="vote-btn like text_style"
          onClick={() => onClickLike(props.index, props.id)}>
          Like</button>
      </td>
      <td width="10%">
        <button
          id={'dislike' + props.id}
          className="vote-btn dislike text_style"
          onClick={() => onClickDislike(props.index)}>
          Dislike</button>
      </td>
      <td width="5%" className="text_style">
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
            <div>After you see that Auxify is connected to your device, add a song to the queue and click "Play Next" to synchronize our queue to</div>
            <div> your account. If you ever find that the queue is disconnected from your Spotify, click on Play Next to reconnect.</div>
          </div>
        }
        <table id="queue">
          <tbody>
            {queue.map((song, index) => {
              var songInfo = {
                image: song.album.images[2].url,
                name: song.name,
                artists: song.artists,
                vote: song.vote,
              };
              return (
                <QueueItem
                  room_id={this.props.room_id}
                  key={song.id}
                  id={song.id}
                  index={index}
                  songInfo={songInfo} />
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Queue;
