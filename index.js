import { tweetsData } from './data.js'
import { blockList } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let currentFeeds = ""
const allFeedEle = document.getElementById("all-feeds")
const likedFeedEle = document.getElementById("liked-feeds")
const savedFeedEle = document.getElementById("saved-feeds")
const myFeedEle = document.getElementById("my-feeds")

function init() {
    if(!JSON.parse(localStorage.getItem("tweetsDataLocal")) || !JSON.parse(localStorage.getItem("blockListLocal"))){
        localStorage.setItem("tweetsDataLocal", JSON.stringify(tweetsData))
        localStorage.setItem("blockListLocal", JSON.stringify(blockList))
    } else {
        console.log("Loading data from the local storage")
    }
}
init()

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.save){
        handleSaveClick(e.target.dataset.save)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'all-feeds') {
        handleAllFeedsClick()
    }
    else if(e.target.id === 'liked-feeds') {
        handleLikedFeedsClick()
    }
    else if(e.target.id === 'saved-feeds') {
        handleSavedFeedsClick()
    }
    else if(e.target.id === 'my-feeds') {
        handleSelfFeedsClick()
    }
    else if(e.target.dataset.tweetoption){
        handleTweetOptionClick(e.target.dataset.tweetoption)
    }
    else if(e.target.dataset.tweetdelete){
        handleTweetDeleteClick(e.target.dataset.tweetdelete);
    }
    else if(e.target.dataset.userblock){
        console.log("user click on block")
        handleBlockUserClick(e.target.dataset.userblock);
    }
    else if(e.target.id === "resetToDefault"){
        handleResetLick()
    }
})

function handleLikeClick(tweetId){ 
    const tweetsDataLocal = getItemLocal("tweetsDataLocal")
    const targetTweetObj = tweetsDataLocal.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    setItemLocal("tweetsDataLocal", tweetsDataLocal)
    render(currentFeeds)
}

function handleRetweetClick(tweetId){
    const tweetsDataLocal = getItemLocal("tweetsDataLocal")
    const targetTweetObj = tweetsDataLocal.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    setItemLocal("tweetsDataLocal", tweetsDataLocal)
    render(currentFeeds) 
}

function handleSaveClick(tweetId){
    const tweetsDataLocal = getItemLocal("tweetsDataLocal")
    const targetTweetObj = tweetsDataLocal.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    targetTweetObj.isSaved = !targetTweetObj.isSaved
    console.log(targetTweetObj)
    setItemLocal("tweetsDataLocal", tweetsDataLocal)
    render(currentFeeds)
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetsDataLocal = getItemLocal("tweetsDataLocal")
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsDataLocal.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isSaved: false,
            uuid: uuidv4()
        })
    setItemLocal("tweetsDataLocal", tweetsDataLocal)
    render(currentFeeds)
    tweetInput.value = ''
    }
}

function handleAllFeedsClick() {
    currentFeeds = ""
    render()
}

function handleLikedFeedsClick() {
    currentFeeds = "liked"
    render("liked")
}

function handleSavedFeedsClick() {
    currentFeeds = "saved"
    render("saved")
}

function handleSelfFeedsClick() {
    currentFeeds = "self"
    render("self")
}

function handleTweetOptionClick(tweetId) {
    document.getElementById(`dropdown-${tweetId}`).classList.toggle('hidden')
}

function handleTweetDeleteClick(tweetId) {
    const tweetsDataLocal = getItemLocal("tweetsDataLocal")
    const targetTweetObj = tweetsDataLocal
    const index = targetTweetObj.findIndex(function(e) {return e.uuid === tweetId})
    targetTweetObj.splice(index, 1)
    setItemLocal("tweetsDataLocal", tweetsDataLocal)
    render(currentFeeds)
}

function handleBlockUserClick(tweetHandle) {
    const blockListLocal = getItemLocal("blockListLocal")
    blockListLocal.push(tweetHandle)
    setItemLocal("blockListLocal", blockListLocal)
    render(currentFeeds)
}

function handleResetLick() {
    if(confirm("Do you want to initialize the database? All data will be wiped and reset to default.")) {
        localStorage.clear()
        init()
        render()
    } else {
        console.log("Cancel")
    }
}

function getFeedHtml(feeds){
    let feedHtml = ``
    
    const tweetsDataLocal = getItemLocal("tweetsDataLocal")
    const blockListLocal = getItemLocal("blockListLocal")

    if(!feeds) {
        allFeedEle.classList.add("feed-color", "fa-xl")
        allFeedEle.classList.remove("fa-lg")
        likedFeedEle.classList.remove("feed-color", "fa-xl")
        likedFeedEle.classList.add("fa-lg")
        savedFeedEle.classList.remove("feed-color", "fa-xl")
        savedFeedEle.classList.add("fa-lg")
        myFeedEle.classList.remove("feed-color", "fa-xl")
        myFeedEle.classList.add("fa-lg")
    } else if(feeds === "liked") {
        likedFeedEle.classList.add("feed-color", "fa-xl")
        likedFeedEle.classList.remove("fa-lg")
        allFeedEle.classList.remove("feed-color", "fa-xl")
        allFeedEle.classList.add("fa-lg")
        savedFeedEle.classList.remove("feed-color", "fa-xl")
        savedFeedEle.classList.add("fa-lg")
        myFeedEle.classList.remove("feed-color", "fa-xl")
        myFeedEle.classList.add("fa-lg")
    } else if(feeds === "saved") {
        savedFeedEle.classList.add("feed-color", "fa-xl")
        savedFeedEle.classList.remove("fa-lg")
        likedFeedEle.classList.remove("feed-color", "fa-xl")
        likedFeedEle.classList.add("fa-lg")
        allFeedEle.classList.remove("feed-color", "fa-xl")
        allFeedEle.classList.add("fa-lg")
        myFeedEle.classList.remove("feed-color", "fa-xl")
        myFeedEle.classList.add("fa-lg")
    } else if(feeds === "self") {
        myFeedEle.classList.add("feed-color", "fa-xl")
        myFeedEle.classList.remove("fa-lg")
        likedFeedEle.classList.remove("feed-color", "fa-xl")
        likedFeedEle.classList.add("fa-lg")
        savedFeedEle.classList.remove("feed-color", "fa-xl")
        savedFeedEle.classList.add("fa-lg")
        allFeedEle.classList.remove("feed-color", "fa-xl")
        allFeedEle.classList.add("fa-lg")
    } 

    tweetsDataLocal.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let saveIconClass = ''

        if(tweet.isSaved){
            saveIconClass = 'saved'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }

        let deleteHtml = ''

        if(tweet.handle === "@Scrimba"){
            deleteHtml =
            `
            <div class="delete-section">
                <p data-tweetdelete="${tweet.uuid}">delete tweet</p>
                <i class="fa-solid fa-trash" data-tweetdelete="${tweet.uuid}"></i>
            </div>
            `
        }

        let blockHtml = ''

        if(tweet.handle !== "@Scrimba"){
            blockHtml =
            `
            <div class="block-section">
                <p data-userblock="${tweet.handle}">block this user</p>
                <i class="fa-solid fa-ban" data-userblock="${tweet.handle}"></i>
            </div>
            `
        }

        let currentFeedHtml = `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div class="all-tweet-content">
            <div class="top-handle-option">
                <p class="handle">${tweet.handle}</p>
                <i class="fa-solid fa-ellipsis" data-tweetoption="${tweet.uuid}"></i>
            </div>
            <div class="hidden tweet-dropdown" id="dropdown-${tweet.uuid}">
                ${deleteHtml}
                ${blockHtml}
            </div>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-bookmark ${saveIconClass}"
                    data-save="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
        // List all conditions to hide tweets on screen
        // If user has been added to the blocked list, then this currnet tweet wouldnt not be rendered
        blockListLocal.forEach(function(handle){
            if(tweet.handle === handle) {
                currentFeedHtml = ``
            }
        })
        // in this case, create a parameter taking input from getFeedHtml(). When it is = "like" then change the feed to show only liked tweet
        if(feeds === "liked" && !tweet.isLiked) {
            currentFeedHtml = ``
        }
        if(feeds === "saved" && !tweet.isSaved) {
            currentFeedHtml = ``
        }
        if(feeds === "self" && tweet.handle !== "@Scrimba") {
            currentFeedHtml = ``
        }
        feedHtml = feedHtml + currentFeedHtml

   })
   return feedHtml 
}

function render(feeds){
    document.getElementById('feed').innerHTML = getFeedHtml(feeds)
}

render()

// function localStorgeTest() {
//     localStorage.setItem("tweetsDataLocal", JSON.stringify(tweetsData))
// }

// function localStorgeClear() {
//     localStorage.clear()
// }

// function readLocalStorage() {
//     let td = JSON.parse(localStorage.getItem("tweetsDataLocal"))
//     console.log(td)
//     td.forEach(function(tweet){
//         console.log(tweet.handle)
//         if(tweet.handle === "@Elon ✅"){
//             console.log("inside")
//             tweet.handle = "@Elon"
//         }
//     })
//     localStorage.setItem("tweetsDataLocal", JSON.stringify(td))
// }

function setItemLocal(key, jsonItem) {
    localStorage.setItem(key, JSON.stringify(jsonItem))
}

function getItemLocal(key) {
    return JSON.parse(localStorage.getItem(key))
}

// localStorgeTest()
// localStorgeClear()
// readLocalStorage()
// getLocalStorage()
