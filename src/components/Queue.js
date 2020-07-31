import React from 'react';

function QueueItem(props) {
  const songInfo = props.songInfo;
  return (
    <tr>
      <td>
        <img src={songInfo.image} width="30" height="30" />
      </td>
      <td> {songInfo.name}</td>
      <td> - {songInfo.artists.map(artist => artist.name).join(', ')}</td>
      <td>
        <button onClick={() => props.onVoteUp(props.index)}>upvote</button>
      </td>
      <td>
        <button onClick={() => props.onVoteDown(props.index)}>downvote</button>
      </td>
      <td>
        {props.vote}
      </td>
    </tr>
  );
}

class Queue extends React.Component {
  render() {
    const queue = this.props.queue;
    const vote = this.props.vote;

    return (
      <div className="queue-container">
        <div>Queue</div>
        <table>
          <tbody id="queue">
            {queue.map((song, index) => {
              var songInfo = {
                image: song.album.images[2].url,
                name: song.name,
                artists: song.artists,
              };
              return (
                <QueueItem
                  key={song.id}
                  index={index}
                  vote={vote[index]}
                  songInfo={songInfo}
                  onVoteUp={this.props.onVoteUp}
                  onVoteDown={this.props.onVoteDown} />
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Queue;
