import React from 'react';

import APIFetch from '../../utilities/api';
import cookieCheck from '../../utilities/cookieCheck';
import ProfileRatingAdd from '../profileRatingAdd';

import './styles.css';

export default class ProfileRatings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: 0,
            commentStart: 0,
            commentEnd: 0,
            data: {
                userID: '123',
                strength: 0,
                punctuality: 0,
                friendliness: 0,
                fun: 0,
                playAgain: 0,
                comments: []
            }
        };
        
        this.renderComments = this.renderComments.bind(this);
        this.renderPageControl = this.renderPageControl.bind(this);
        this.pageBack = this.pageBack.bind(this);
        this.pageNext = this.pageNext.bind(this);
    }
    
    componentDidMount() {
        let fetchData = APIFetch('/ratings/getUserAvgRatings?userID=' + this.props.userID);

        fetchData.then(async (data) => {
            if (await data.ok) {
                let json = await data.json();
                
                let maxComments;
                if (json.comments.length < 5) {
                    maxComments = json.comments.length;
                } else {
                    maxComments = 5;
                }

                this.setState({status: 200, data: json, commentEnd: maxComments});
            } else {
                console.log('profile-ratings', 'network problem happened');
            }
        });
    }

    renderComments() {
        let comments = [];

        for (let i = this.state.commentStart; i < this.state.commentEnd; i++) {
            let comment = this.state.data.comments[i];
            
            comments.push(
                <div className = 'rating-overview-comment'>
                    <div className = 'rating-comment-info'>
                        <div>{comment.raterID}</div>
                        <div>{comment.rateDate}</div>
                    </div>
                    <div className = 'rating-comment-text'>
                        <p>{comment.comment}</p>
                    </div>
                </div>
            );
        }

        return comments;
    }

    renderPageControl() {
        return (
            <div className = 'rating-overview-comments-page-ctrl'>
                <div onClick = {this.pageBack} className = {this.state.commentStart === 0 && 'page-ctrl-disabled'} >previous</div> | <div onClick = {this.pageNext} className = {this.state.commentEnd === this.state.data.comments.length && 'page-ctrl-disabled'} >next</div>
            </div>
        )
    }
    
    pageBack() {
        if (this.state.commentStart !== 0) {
            this.setState({
                commentStart: this.state.commentStart - 5,
                commentEnd: this.state.commentStart
            });
        }
    }

    pageNext() {
        if (this.state.commentEnd !== this.state.data.comments.length) {
            let end;
            if (this.state.commentEnd + 5 > this.state.data.comments.length) {
                end = this.state.data.comments.length;
            } else {
                end = this.state.commentEnd + 5;
            }

            this.setState({
                commentStart: this.state.commentStart + 5,
                commentEnd: end
            });
        }
    }

    render() {
        return (
            <div style = {{width: '100%'}}>
                <div className = 'profile-header'>Ratings</div>
                <div className = 'rating-overview-wrapper'>
                    <div className = 'rating-overview-overview'>
                        <div>
                            <div className = 'star' style = {{'--rating': this.state.data.strength}}></div>
                            <div>Strength</div>
                        </div>
                        <div>
                            <div className = 'star' style = {{'--rating': this.state.data.punctuality}}></div>
                            <div>Punctuality</div>
                        </div>
                        <div>
                            <div className = 'star' style = {{'--rating': this.state.data.friendliness}}></div>
                            <div>Friendliness</div>
                        </div>
                        <div>
                            <div className = 'star' style = {{'--rating': this.state.data.fun}}></div>
                            <div>Fun</div>
                        </div>
                        <div>
                            <div>{this.state.data.playAgain}%</div>
                            <div>would play again</div>
                        </div>
                    </div>
                    <div className = 'rating-overview-comments-wrapper'>
                        {this.renderPageControl()}
                        
                        <div className = 'rating-overview-comments'>
                            {this.renderComments()}
                        </div>
                    </div>

                    {cookieCheck() && localStorage.getItem('id') !== this.props.userID && <ProfileRatingAdd userID = {this.props.userID} />}
                    {/* {cookieCheck() && <ProfileRatingAdd userID = {this.props.userID} />} */}
                </div>
            </div>
        );
    }
}