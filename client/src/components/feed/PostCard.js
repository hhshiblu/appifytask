'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { getComments, createComment } from '../../actions/comments';
import { getReplies, createReply } from '../../actions/replies';
import { getReacts, toggleReact } from '../../actions/reacts';
import { getFirstName, getUserInitial, getUploadUrl, getUniqueUsers } from '../../actions/utils';
import UserAvatar from './UserAvatar';
import TimeAgo from './TimeAgo';
import EngagementListModal from './EngagementListModal';

const INITIAL_COMMENTS = 2;
const LOAD_MORE_COMMENTS = 5;

function renderMentionContent(content) {
  if (!content) return null;
  const parts = content.split(/(@[A-Za-z0-9_]+)/g);
  return parts.map((part, i) =>
    part.startsWith('@') ? (
      <span key={i} style={{ color: '#0ACF83', fontWeight: 600 }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function ReactionBadge({ count, onClick }) {
  if (!count || count <= 0) return null;

  return (
    <div
      className="_total_reactions"
      style={{ position: 'static', boxShadow: 'rgb(149 157 165 / 20%) 0px 4px 12px', cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="_total_react">
        <span className="_reaction_like">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        </span>
      </div>
      <span className="_total">{count}</span>
    </div>
  );
}

function CommentActions({ item, showReplyAction, onReplyClick, onLike, liked, likeCount, onLikeCountClick }) {
  return (
    <div className="_comment_reply" style={{ marginTop: 8 }}>
      <div
        className="_comment_reply_num"
        style={{
          position: 'static',
          bottom: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <ul
          className="_comment_reply_list"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          <li style={{ margin: 0 }}>
            <span
              role="button"
              tabIndex={0}
              onClick={onLike}
              onKeyDown={(e) => e.key === 'Enter' && onLike?.()}
              style={{ fontWeight: liked ? 700 : 500, cursor: 'pointer' }}
            >
              {liked ? 'Liked' : 'Like'}
            </span>
          </li>
          {showReplyAction && (
            <li style={{ margin: 0 }}>
              <span
                role="button"
                tabIndex={0}
                onClick={onReplyClick}
                onKeyDown={(e) => e.key === 'Enter' && onReplyClick?.()}
              >
                Reply
              </span>
            </li>
          )}
          <li style={{ margin: 0 }}>
            <span className="_time_link">
              <TimeAgo date={item.created_at} />
            </span>
          </li>
        </ul>
        <ReactionBadge count={likeCount} onClick={onLikeCountClick} />
      </div>
    </div>
  );
}

function CommentComposer({
  userInitial,
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = 'Write a comment',
  imageFile,
  onImageChange,
  onImageClear,
}) {
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="_feed_inner_comment_box">
      <form className="_feed_inner_comment_box_form" onSubmit={onSubmit}>
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image" style={{ flexShrink: 0, marginRight: 8 }}>
            <UserAvatar initial={userInitial} size="xs" />
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <textarea
              className="form-control _comment_textarea"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            {imageFile && (
              <div style={{ marginTop: 6, position: 'relative', display: 'inline-block' }}>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt=""
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, display: 'block' }}
                />
                <button
                  type="button"
                  onClick={onImageClear}
                  aria-label="Remove image"
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#333',
                    color: '#fff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    lineHeight: 1,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="_feed_inner_comment_box_icon">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onImageChange?.(e.target.files?.[0] || null)}
          />
          <button
            type="button"
            className="_feed_inner_comment_box_icon_btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
            </svg>
          </button>
          <button type="submit" disabled={disabled} className="_feed_inner_comment_box_icon_btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path fill="#000" fillOpacity=".46" d="M14.5 1.5L1.5 8.25l5.25 2.25L10.5 15.5l4-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

function CommentBubble({ item, targetType = 'comment', showReplyAction = false, onReplyClick }) {
  const [liked, setLiked] = useState(!!item.user_liked);
  const [likeCount, setLikeCount] = useState(Number(item.reacts_count) || 0);
  const [isPending, startTransition] = useTransition();
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [likers, setLikers] = useState([]);
  const [loadingLikers, setLoadingLikers] = useState(false);
  const imageUrl = getUploadUrl(item.image);

  const handleLike = () => {
    startTransition(async () => {
      const data = await toggleReact(item.id, targetType);
      if (data.success) {
        const newLiked = data.action === 'liked';
        setLiked(newLiked);
        setLikeCount((c) => (newLiked ? c + 1 : Math.max(0, c - 1)));
      }
    });
  };

  const handleLikeCountClick = async () => {
    if (likeCount <= 0) return;
    setLikesModalOpen(true);
    setLoadingLikers(true);
    const data = await getReacts(item.id, targetType);
    setLikers(data);
    setLoadingLikers(false);
  };

  return (
    <div
      className="_comment_details"
      style={{ marginBottom: showReplyAction ? 16 : 12, width: '100%', maxWidth: '100%' }}
    >
      <div className="_comment_details_top">
        <div className="_comment_name">
          <h4 className="_comment_name_title">{getFirstName(item)}</h4>
        </div>
      </div>
      {item.content && (
        <div className="_comment_status">
          <p className="_comment_status_text">
            <span>{renderMentionContent(item.content)}</span>
          </p>
        </div>
      )}
      {imageUrl && (
        <div style={{ marginTop: 8 }}>
          <img
            src={imageUrl}
            alt=""
            style={{ maxWidth: 140, maxHeight: 100, objectFit: 'cover', borderRadius: 8, display: 'block' }}
          />
        </div>
      )}
      <CommentActions
        item={item}
        showReplyAction={showReplyAction}
        onReplyClick={onReplyClick}
        onLike={handleLike}
        liked={liked}
        likeCount={likeCount}
        onLikeCountClick={handleLikeCountClick}
      />
      <EngagementListModal
        isOpen={likesModalOpen}
        onClose={() => setLikesModalOpen(false)}
        title="Liked by"
        items={likers}
        loading={loadingLikers}
        emptyText="No likes yet"
      />
    </div>
  );
}

function NestedReply({ reply }) {
  return (
    <div className="_comment_main" style={{ marginTop: 16, width: '100%' }}>
      <div className="_comment_image" style={{ flexShrink: 0, border: 'none', overflow: 'visible' }}>
        <UserAvatar initial={getUserInitial(reply)} size="sm" />
      </div>
      <div className="_comment_area" style={{ width: '100%', flex: '1 1 auto' }}>
        <CommentBubble item={reply} targetType="reply" />
      </div>
    </div>
  );
}

function CommentItem({ comment, userInitial, onReplyAdded, onCountChange }) {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesCount, setRepliesCount] = useState(Number(comment.replies_count) || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyImage, setReplyImage] = useState(null);
  const [isPending, startTransition] = useTransition();

  const mentionName = getFirstName(comment);

  const loadReplies = async () => {
    const data = await getReplies(comment.id);
    setReplies(data);
    setRepliesCount(data.length);
    return data;
  };

  const handleToggleReplies = () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    startTransition(async () => {
      await loadReplies();
      setShowReplies(true);
    });
  };

  const openReplyForm = () => {
    const mention = `@${mentionName} `;
    setReplyText((prev) => (prev.startsWith(mention) ? prev : mention));
    setShowReplyForm(true);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim() && !replyImage) return;

    const formData = new FormData();
    formData.append('commentId', comment.id);
    if (replyText.trim()) formData.append('content', replyText.trim());
    if (replyImage) formData.append('image', replyImage);

    startTransition(async () => {
      const result = await createReply(formData);
      if (result.success) {
        setReplyText('');
        setReplyImage(null);
        await loadReplies();
        setShowReplies(true);
        setShowReplyForm(false);
        setRepliesCount((c) => c + 1);
        onCountChange?.(1);
        onReplyAdded?.();
      } else {
        toast.error(result.message || 'Failed to post reply');
      }
    });
  };

  return (
    <div className="_comment_main" style={{ width: '100%' }}>
      <div className="_comment_image" style={{ flexShrink: 0, border: 'none', overflow: 'visible' }}>
        <UserAvatar initial={getUserInitial(comment)} size="sm" />
      </div>
      <div className="_comment_area" style={{ width: '100%', flex: '1 1 auto' }}>
        <CommentBubble
          item={comment}
          targetType="comment"
          showReplyAction
          onReplyClick={openReplyForm}
        />

        {repliesCount > 0 && (
          <button
            type="button"
            className="_previous_comment_txt"
            onClick={handleToggleReplies}
            style={{ marginTop: 8, marginBottom: showReplies ? 4 : 8 }}
          >
            {showReplies
              ? 'Hide replies'
              : `View ${repliesCount} ${repliesCount === 1 ? 'reply' : 'replies'}`}
          </button>
        )}

        {showReplies && replies.map((reply) => (
          <NestedReply key={reply.id} reply={reply} />
        ))}

        {showReplyForm && (
          <CommentComposer
            userInitial={userInitial}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onSubmit={handleReplySubmit}
            disabled={isPending}
            placeholder={`Reply to @${mentionName}`}
            imageFile={replyImage}
            onImageChange={setReplyImage}
            onImageClear={() => setReplyImage(null)}
          />
        )}
      </div>
    </div>
  );
}

function CommentSection({ postId, initialCount = 0, user, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [isPending, startTransition] = useTransition();

  const currentUserInitial = getUserInitial(user);

  const loadComments = async (limit, offset) => {
    return getComments(postId, { limit, offset });
  };

  const refreshVisibleComments = async (visibleCount) => {
    const result = await loadComments(visibleCount, 0);
    setComments(result.comments);
    setTotal(result.total);
    setHasMore(result.hasMore);
    setLoaded(true);
  };

  useEffect(() => {
    if (initialCount > 0) {
      refreshVisibleComments(INITIAL_COMMENTS);
    }
  }, [postId, initialCount]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const result = await loadComments(LOAD_MORE_COMMENTS, comments.length);
      setComments((prev) => [...prev, ...result.comments]);
      setTotal(result.total);
      setHasMore(result.hasMore);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() && !commentImage) return;

    const formData = new FormData();
    formData.append('postId', postId);
    if (commentText.trim()) formData.append('content', commentText.trim());
    if (commentImage) formData.append('image', commentImage);

    startTransition(async () => {
      const result = await createComment(formData);

      if (result.success) {
        setCommentText('');
        setCommentImage(null);
        const nextCount = comments.length + 1;
        setLoaded(true);
        onCountChange?.(1);   
        await refreshVisibleComments(Math.max(nextCount, INITIAL_COMMENTS));
      } else {
        toast.error(result.message || 'Failed to post comment');
      }
    });
  };

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <CommentComposer
          userInitial={currentUserInitial}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onSubmit={handleSubmit}
          disabled={isPending}
          imageFile={commentImage}
          onImageChange={setCommentImage}
          onImageClear={() => setCommentImage(null)}
        />
      </div>

      {loaded && comments.length > 0 && (
        <div
          className="_timline_comment_main"
          style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}
        >
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              userInitial={currentUserInitial}
              onCountChange={onCountChange}
              onReplyAdded={() => refreshVisibleComments(comments.length)}
            />
          ))}

          {hasMore && (
            <div className="_previous_comment _previous_comment_sticky">
              <button
                type="button"
                className="_previous_comment_txt"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'View more comments'}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export function PostReactions({ post, user, commentsCount }) {
  const [liked, setLiked] = useState(!!post.user_liked);
  const [count, setCount] = useState(Number(post.reacts_count) || 0);
  const [reactors, setReactors] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (count > 0) {
      getReacts(post.id, 'post').then(setReactors);
    } else {
      setReactors([]);
    }
  }, [post.id, count]);

  const openLikesModal = async () => {
    if (count <= 0) return;
    setModalTitle('Liked by');
    setModalOpen(true);
    setModalLoading(true);
    const data = await getReacts(post.id, 'post');
    setReactors(data);
    setModalItems(data);
    setModalLoading(false);
  };

  const openCommentsModal = async () => {
    if (commentsCount <= 0) return;
    setModalTitle('Commented by');
    setModalOpen(true);
    setModalLoading(true);
    const { comments } = await getComments(post.id, { limit: 100, offset: 0 });
    setModalItems(getUniqueUsers(comments));
    setModalLoading(false);
  };

  const handleReact = () => {
    startTransition(async () => {
      const result = await toggleReact(post.id, 'post');
      if (result.success) {
        const newLiked = result.action === 'liked';
        setLiked(newLiked);
        setCount((c) => (newLiked ? c + 1 : Math.max(0, c - 1)));

        if (newLiked && user) {
          setReactors((prev) => {
            if (prev.some((r) => r.user_id === user.id)) return prev;
            return [{ user_id: user.id, first_name: user.first_name, last_name: user.last_name }, ...prev];
          });
        } else if (!newLiked && user) {
          setReactors((prev) => prev.filter((r) => r.user_id !== user.id));
        }
      }
    });
  };

  return (
    <>
      <div
        className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24"
        style={{ marginBottom: 26, height: 26, alignItems: 'center' }}
      >
        <div
          className="_feed_inner_timeline_total_reacts_image"
          style={{ height: 22, alignItems: 'center', flexShrink: 0, cursor: count > 0 ? 'pointer' : 'default' }}
          role={count > 0 ? 'button' : undefined}
          tabIndex={count > 0 ? 0 : undefined}
          onClick={openLikesModal}
          onKeyDown={(e) => e.key === 'Enter' && openLikesModal()}
        >
          {count > 0 && reactors.slice(0, 4).map((reactor, index) => (
            <div
              key={reactor.id || reactor.user_id || index}
              style={{
                marginLeft: index > 0 ? -8 : 0,
                border: '1.5px solid #fff',
                borderRadius: '50%',
                display: 'flex',
                flexShrink: 0,
              }}
            >
              <UserAvatar initial={getUserInitial(reactor)} size="react" />
            </div>
          ))}
          {count > 0 && (
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                minWidth: 22,
                minHeight: 22,
                margin: '0 0 0 -8px',
                borderRadius: '50%',
                backgroundColor: '#9E9E9E',
                border: '1.5px solid #fff',
                fontSize: 9,
                fontWeight: 600,
                lineHeight: 1,
                color: '#ffffff',
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            >
              {count > 9 ? '9+' : `${count}+`}
            </p>
          )}
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <span
              role={commentsCount > 0 ? 'button' : undefined}
              tabIndex={commentsCount > 0 ? 0 : undefined}
              style={{ cursor: commentsCount > 0 ? 'pointer' : 'default' }}
              onClick={openCommentsModal}
              onKeyDown={(e) => e.key === 'Enter' && openCommentsModal()}
            >
              {commentsCount} Comment
            </span>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>0 Share</span>
          </p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction _padd_r24 _padd_l24">
        <button
          type="button"
          onClick={handleReact}
          disabled={isPending}
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction${liked ? ' _feed_reaction_active' : ''}`}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
                <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
                <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
                <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
              </svg>
              Haha
            </span>
          </span>
        </button>
        <button type="button" className="_feed_inner_timeline_reaction_comment _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
              </svg>
              Comment
            </span>
          </span>
        </button>
        <button type="button" className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      <EngagementListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        items={modalItems}
        loading={modalLoading}
        emptyText={modalTitle === 'Liked by' ? 'No likes yet' : 'No comments yet'}
      />
    </>
  );
}

export function PostCard({ post, user }) {
  const imageUrl = getUploadUrl(post.image);
  const firstName = getFirstName(post);
  const userInitial = getUserInitial(post);
  const [commentsCount, setCommentsCount] = useState(Number(post.comments_count) || 0);

  const handleCountChange = (delta) => {
    setCommentsCount((c) => c + delta);
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image" style={{ flexShrink: 0 }}>
              <UserAvatar initial={userInitial} size="md" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{firstName}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                <TimeAgo date={post.created_at} /> .{' '}
                <span className="capitalize">{post.visibility || 'public'}</span>
              </p>
            </div>
          </div>
        </div>

        {post.content && (
          <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        )}

        {imageUrl && (
          <div
            className="_feed_inner_timeline_image"
            style={{ marginBottom: 24, overflow: 'hidden', borderRadius: 6 }}
          >
            <img
              src={imageUrl}
              alt=""
              className="_time_img"
              style={{
                display: 'block',
                width: '100%',
                height: 400,
                objectFit: 'cover',
                marginBottom: 0,
                borderRadius: 6,
              }}
            />
          </div>
        )}
      </div>

      <PostReactions post={post} user={user} commentsCount={commentsCount} />
      <CommentSection
        postId={post.id}
        initialCount={commentsCount}
        user={user}
        onCountChange={handleCountChange}
      />
    </div>
  );
}
