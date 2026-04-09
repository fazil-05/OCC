import React, { useRef, useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { MockFeedPost } from '@/constants/occ-mock-feed';
import { dash } from '@/constants/occ-dashboard-theme';

type Props = { post: MockFeedPost; width: number };

type Comment = {
  id: string;
  user: string;
  text: string;
  time: string;
};

export function FeedPostCard({ post, width }: Props) {
  const cardW = width - 32;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  // Double tap logic
  const lastTap = useRef(0);
  const heartScale = useRef(new Animated.Value(0)).current;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) {
        setLiked(true);
        setLikeCount((p) => p + 1);
      }
      heartScale.setValue(0);
      Animated.sequence([
        Animated.spring(heartScale, { toValue: 1.2, useNativeDriver: true }),
        Animated.spring(heartScale, { toValue: 0, useNativeDriver: true }),
      ]).start();
    }
    lastTap.current = now;
  };

  const toggleLike = () => {
    if (liked) {
      setLikeCount((p) => p - 1);
    } else {
      setLikeCount((p) => p + 1);
    }
    setLiked(!liked);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(),
      user: 'You',
      text: commentText,
      time: 'Just now',
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `${post.caption}\n\nCheck this out on OCC!`,
        url: post.imageUrl,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOption = (title: string) => {
    setShowOptions(false);
    setTimeout(() => {
      Alert.alert(title, `Managing this post... (UI only)`);
    }, 100);
  };

  return (
    <>
      <View style={[styles.card, { width: cardW }]}>
        <Pressable onPress={handleDoubleTap}>
          <View style={[styles.imageWrap, { width: cardW }]}>
            <Image
              source={{ uri: post.imageUrl }}
              style={[styles.image, { width: cardW }]}
              contentFit="cover"
              cachePolicy="disk"
              transition={300}
            />
            
            {/* Top Row Overlay */}
            <View style={styles.topRowOverlay}>
              <View style={styles.occBadge}>
                <View style={styles.occDot} />
                <Text style={styles.occBadgeText}>OCC POST</Text>
              </View>
              <Pressable style={styles.moreBtnRound} hitSlop={10} onPress={() => setShowOptions(true)}>
                <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
              </Pressable>
            </View>

            <Animated.View style={[styles.bigHeart, { transform: [{ scale: heartScale }] }]}>
              <Ionicons name="heart" size={80} color="rgba(255,255,255,0.9)" />
            </Animated.View>

            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.gradient}>
              <View style={styles.bottomCardContent}>
                {/* Author Info */}
                <View style={styles.overlayAuthorRow}>
                  <Image source={{ uri: post.author.avatarUrl }} style={styles.overlayAvatar} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.nameRow}>
                      <Text style={styles.overlayName}>{post.author.name}</Text>
                      {post.author.verified && (
                        <Ionicons name="checkmark-circle" size={14} color="#818CF8" style={{ marginLeft: 4 }} />
                      )}
                    </View>
                    <Text style={styles.overlayHandle}>@{post.author.handle} · {post.timeLabel} ago</Text>
                  </View>
                  <Pressable hitSlop={8} style={styles.bookmarkBtnRound} onPress={() => Alert.alert('Saved', 'Added to your favorites!')}>
                    <Ionicons name="bookmark-outline" size={20} color="#fff" />
                  </Pressable>
                </View>

                {/* Engagement Row */}
                <View style={styles.pillRowOverlay}>
                  <TouchableOpacity style={styles.actionPill} onPress={toggleLike}>
                    <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? '#EF4444' : '#fff'} />
                    <Text style={styles.actionPillText}>{likeCount.toLocaleString()}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionPill} onPress={() => setShowComments(true)}>
                    <Ionicons name="chatbubble-outline" size={18} color="#fff" />
                    <Text style={styles.actionPillText}>{post.comments + comments.length}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionPill, { minWidth: 80 }]} onPress={onShare}>
                    <Ionicons name="arrow-redo-outline" size={18} color="#fff" />
                    <Text style={styles.actionPillText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Pressable>

        <View style={styles.captionStrip}>
          <Text style={styles.captionText} numberOfLines={2}>{post.caption}</Text>
          <Pressable onPress={() => setShowComments(true)}>
            <Text style={styles.viewComments}>View all {post.comments + comments.length} comments →</Text>
          </Pressable>
        </View>
      </View>

      {/* Options Sheet */}
      <Modal visible={showOptions} animationType="fade" transparent>
        <Pressable style={styles.optionsModalBg} onPress={() => setShowOptions(false)}>
          <View style={styles.optionsContent}>
            <View style={styles.dragNotch} />
            <TouchableOpacity style={styles.optionItemRow} onPress={() => handleOption('Report')}>
              <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
              <Text style={[styles.optionItemText, { color: '#EF4444' }]}>Report post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItemRow} onPress={() => handleOption('Not Interested')}>
              <Ionicons name="eye-off-outline" size={24} color={dash.text} />
              <Text style={styles.optionItemText}>Not interested</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItemRow} onPress={() => handleOption('About Account')}>
              <Ionicons name="information-circle-outline" size={24} color={dash.text} />
              <Text style={styles.optionItemText}>About this account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionItemRow, { borderBottomWidth: 0 }]} onPress={() => setShowOptions(false)}>
              <Text style={[styles.optionItemText, { textAlign: 'center', width: '100%', fontWeight: '800' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Comments Modal */}
      <Modal visible={showComments} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.commentSheet}>
            <View style={styles.commentHeader}>
              <View style={styles.dragNotch} />
              <View style={styles.commentHeaderTitleRow}>
                <Text style={styles.commentHeaderTitle}>Comments</Text>
                <TouchableOpacity onPress={() => setShowComments(false)} hitSlop={12}>
                  <Ionicons name="close" size={24} color={dash.text} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.commentList} showsVerticalScrollIndicator={false}>
              {comments.length === 0 ? (
                <View style={styles.emptyComments}>
                  <Ionicons name="chatbubbles-outline" size={40} color={dash.textSoft} />
                  <Text style={styles.emptyText}>Be the first to comment!</Text>
                </View>
              ) : (
                comments.map((c) => (
                  <View key={c.id} style={styles.commentRow}>
                    <View style={styles.commentAvatarPlaceholder} />
                    <View style={styles.commentTextContent}>
                      <Text style={styles.commentUser}>{c.user}</Text>
                      <Text style={styles.commentText}>{c.text}</Text>
                      <Text style={styles.commentTime}>{c.time}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputRow}>
                  <View style={styles.myAvatarPlaceholder} />
                  <TextInput
                    placeholder="Add a comment..."
                    placeholderTextColor={dash.textSoft}
                    style={styles.commentInput}
                    value={commentText}
                    onChangeText={setCommentText}
                    onSubmitEditing={handleSendComment}
                  />
                  <TouchableOpacity onPress={handleSendComment} disabled={!commentText.trim()}>
                    <Text style={[styles.postLabel, !commentText.trim() && { opacity: 0.5 }]}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 28,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  imageWrap: {
    aspectRatio: 0.7,
    position: 'relative',
    backgroundColor: '#000',
  },
  image: {
    height: '100%',
  },
  topRowOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  occBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    gap: 6,
  },
  occDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  occBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  moreBtnRound: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigHeart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    zIndex: 20,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  bottomCardContent: {
    padding: 16,
    gap: 14,
  },
  overlayAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  overlayAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  overlayHandle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  bookmarkBtnRound: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillRowOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 99,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionPillText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  captionStrip: {
    padding: 16,
    backgroundColor: '#fff',
  },
  captionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
  },
  viewComments: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#6366F1',
  },
  optionsModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  optionsContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  dragNotch: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  optionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  optionItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  commentSheet: {
    height: '70%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  commentHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  commentHeaderTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  commentHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  commentList: {
    flex: 1,
  },
  emptyComments: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 15,
  },
  commentRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  commentAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
  },
  commentTextContent: {
    flex: 1,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  commentText: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  commentTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  inputWrapper: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  myAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
  },
  commentInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#111827',
  },
  postLabel: {
    color: '#6366F1',
    fontWeight: '800',
    fontSize: 14,
  },
});
