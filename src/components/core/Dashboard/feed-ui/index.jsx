import React, { useState } from 'react';
import styles from './index.module.css';
const FeedUi = ({feeds}) => {
    const [commentsShow, setCommentsShow] = useState(Array(feeds.length).fill(false));
    const [isOpened, setIsOpened] = useState(Array(feeds.length).fill(false));
    const textLimit = 200;
    const handleCommentsShow = (index) => {
        setIsOpened(prevState => {
            const updatedState = [...prevState];
            updatedState[index] = !updatedState[index];
            return updatedState;
        });
    };
    const [likes, setLikes] = useState(feeds.map(feed => feed.likes));
    
    const handleSetLikes = (index) =>{
        
        setLikes(
            prevLikes => {
                let likesUpdate = [...prevLikes]
                likesUpdate[index] += 1;
                return likesUpdate;

            }
        )
    }

    const [newComment, setNewComment] = useState(feeds.map(() => ''));
    const [feedsState, setFeedsState] = useState(feeds);
    const formatDate = (date) => {
        const options = {
            month: 'short',
            day: 'numeric', 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true, 
        };
        return new Date(date).toLocaleString('en-US', options);
    };
    
  
    const handleAddComment = (index) => {
        const commentText = newComment[index].trim();
        if (!commentText) return;
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const updatedFeeds = [...feedsState];
        updatedFeeds[index].comments = [
            ...updatedFeeds[index].comments,
            {
                name: 'James Smith',
                avatar: 'user3',
                date: formattedDate,
                text: newComment,
            }
        ];
        setFeedsState(updatedFeeds); 
        setNewComment(prevComments => {
            const updatedComments = [...prevComments];
            updatedComments[index] = '';
            return updatedComments;
        });
    };

    const handleCommentChange = (index, value) => {
        setNewComment(prevComments => {
            const updatedComment = [...prevComments];
            updatedComment[index] = value;
            return updatedComment;
        });
    };
    return(
        <>
                   {feeds && feeds.length > 0 && (
                        feeds.map((feed, index) => (
                            <div className={styles['feed-wrapper']} key={index}>
                                <div className={styles['user-data']}>
                                    <div className={styles['user-avatar']}>
                                        <img src={`../assets/img/${feed.avatar}.png`} alt={feed.name}/>
                                    </div>
                                    <div className={styles['user-info']}>
                                        <p className={styles['user-name']}>{feed.name}</p>
                                        <p className={styles['feed-date']}>{feed.date}</p>
                                    </div>
                                </div>
                                <div className={styles['feed-text']}>
                                    {isOpened[index] || feed.text.length <= textLimit ? (
                                        feed.text
                                    ) : (
                                        `${feed.text.slice(0, textLimit)}...`
                                    )}
                                    {feed.text.length > textLimit && (
                                        <button className={styles['text-show-btn']} onClick={() => handleCommentsShow(index)}>
                                            {isOpened[index] ? 'Show Less' : 'Show More'}
                                        </button>
                                    )}
                                </div>
                                <div className={styles['interaction-buttons']}>
                                    <button className={styles['button-like']} onClick={()=>handleSetLikes(index)}>
                                        <img src={`../assets/img/icons/like.png`} alt="like"/>
                                        <p className={styles['likes-count']} >{likes[index]}</p>
                                    </button>
                                    <button className={styles['button-comments']} onClick={() => {
                                        setCommentsShow(prevState => {
                                            const updatedState = [...prevState];
                                            updatedState[index] = !updatedState[index];
                                            return updatedState;
                                        });
                                    }}>
                                        <img src={`../assets/img/icons/comment.png`} alt="comments"/>
                                        <p className={styles['comments-count']}>{feed.comments.length}</p>
                                    </button>
                                </div>
                                {commentsShow[index]  && (
                                <>
                                    <div className={styles['comments-wrapper']}>
                                        {feed.comments.map((comment, index) => (
                                            <div className={styles['comment-item']} key={index}>
                                               <div className={styles['user-data']}>
                                                    <div className={styles['user-avatar']}>
                                                        <img src={`../assets/img/${comment.avatar}.png`} alt={comment.name}/>
                                                    </div>
                                                    <div className={styles['user-info']}>
                                                        <p className={styles['user-name']}>{comment.name}</p>
                                                        <p className={styles['comment-text']}>{comment.text}</p>
                                                        <p className={styles['feed-date']}>{comment.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles['comment-form']}>
                                        <div className={styles['user-avatar']}>
                                            <img src={`../assets/img/user3.png`} alt='James Smith'/>
                                        </div> 
                                        <div className={styles['form-wrapper']}>
                                            <textarea
                                            className={styles.textarea}
                                            value={newComment[index]}
                                            onChange={(e)=>handleCommentChange(index, e.target.value)}
                                            placeholder='The largest investors and contribution percentages'
                                            />
                                            <button 
                                            className={`${styles['add-comment-btn']}`}
                                            onClick={()=>handleAddComment(index)}
                                            >
                                                <img src={`../assets/img/icons/send.png`} alt='icon'/>
                                            </button>
                                        </div>
                                    </div>
                                </>
                                )}
                            </div>
                        ))
                    )}

                </>
    );
}

export default FeedUi;