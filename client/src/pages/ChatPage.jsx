import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getChats } from '../api';
import ChatWindow from '../components/ChatWindow';

/**
 * ChatPage — Bootstrap split-view DM interface
 */
const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const queryChatId = searchParams.get('chatId');
  const queryPeer = searchParams.get('peer');
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    getChats()
      .then(res => setChats(res.data.chats || []))
      .catch(() => setError('Failed to load conversations.'))
      .finally(() => setLoading(false));
  }, [queryChatId]);

  useEffect(() => {
    if (queryChatId && queryPeer) {
      setSelectedChat({ chatId: queryChatId, peerAnonymousUsername: queryPeer });
    }
  }, [queryChatId, queryPeer]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setSearchParams({ chatId: chat.chatId, peer: chat.peerAnonymousUsername });
  };

  return (
    <div className="container py-4">
      <div className="mb-3">
        <h1 className="page-title">
          <i className="bi bi-chat-dots me-2" style={{ color: '#0F5257' }}></i>
          Anonymous Chat
        </h1>
        <p className="page-subtitle">
          Private one-to-one conversations. Real identities are never shared.
        </p>
      </div>

      {error && (
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i> {error}
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <CircularProgress style={{ color: '#0F5257' }} />
        </div>
      ) : (
        <div className="row g-0 mm-card overflow-hidden" style={{ height: '68vh' }}>
          {/* ── Sidebar: Conversation List ── */}
          <div className="col-12 col-md-4 border-end bg-light d-flex flex-column" style={{ minWidth: 0 }}>
            <div className="p-3 border-bottom bg-white">
              <h6 className="mb-0 fw-semibold" style={{ fontSize: '0.88rem', color: '#374151' }}>
                Conversations
              </h6>
            </div>
            <div className="flex-grow-1 overflow-auto p-2">
              {chats.length === 0 ? (
                <div className="text-center text-muted py-5" style={{ fontSize: '0.82rem' }}>
                  <i className="bi bi-chat-square-dots" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                  <p className="mt-2 mb-0">No active chats yet.<br />Go to Peer Support to connect.</p>
                </div>
              ) : (
                chats.map((chat) => {
                  const isCurrent = selectedChat?.chatId === chat.chatId;
                  return (
                    <div
                      key={chat.chatId}
                      className={`rounded p-3 mb-1 cursor-pointer ${isCurrent ? 'bg-primary bg-opacity-10 border border-primary border-opacity-25' : 'bg-white border'}`}
                      onClick={() => handleSelectChat(chat)}
                      style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                      role="button"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: 34, height: 34, fontSize: '0.8rem', flexShrink: 0, background: '#0F5257' }}>
                          {chat.peerAnonymousUsername?.charAt(0) || 'A'}
                        </div>
                        <div className="min-w-0">
                          <div className={`fw-semibold text-truncate ${isCurrent ? 'text-primary' : ''}`}
                            style={{ fontSize: '0.82rem' }}>
                            {chat.peerAnonymousUsername}
                          </div>
                          <div className="text-muted-sm">
                            Since {new Date(chat.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Main: Chat Window ── */}
          <div className="col-12 col-md-8 d-flex flex-column">
            {selectedChat ? (
              <ChatWindow
                chatId={selectedChat.chatId}
                peerAnonymousUsername={selectedChat.peerAnonymousUsername}
                currentUserId="user"
              />
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted bg-white">
                <i className="bi bi-chat-square-text" style={{ fontSize: '3rem', opacity: 0.2 }}></i>
                <p className="mt-3 mb-0 fw-semibold" style={{ fontSize: '0.9rem' }}>No conversation selected</p>
                <p className="text-muted-sm">Pick a chat from the left or start one via Peer Support.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;


