import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import { getChatMessages, postChatMessage } from '../api';

/**
 * ChatWindow — Bootstrap DM-style chat window (light theme)
 */
const ChatWindow = ({ chatId, peerAnonymousUsername }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await getChatMessages(chatId);
      setMessages(res.data.messages || []);
      setError(null);
    } catch {
      setError('Could not load message history.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(true);
    const pollInterval = setInterval(() => fetchMessages(false), 3000);
    return () => clearInterval(pollInterval);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    const body = newMessage.trim();
    setNewMessage('');
    setSending(true);
    try {
      const res = await postChatMessage(chatId, body);
      setMessages(prev => [...prev, res.data.data]);
    } catch {
      setError('Could not send message. Please retry.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="d-flex flex-column h-100 bg-white">
      {/* Chat Header */}
      <div className="d-flex align-items-center gap-2 px-3 py-2 border-bottom" style={{ background: '#F0F9F7' }}>
        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
          style={{ width: 34, height: 34, background: '#0F5257', fontSize: '0.8rem', flexShrink: 0 }}>
          {peerAnonymousUsername?.charAt(0) || 'A'}
        </div>
        <div>
          <div className="fw-semibold" style={{ fontSize: '0.88rem', color: '#1A2E35' }}>
            {peerAnonymousUsername}
          </div>
          <div className="text-muted-sm">
            <span className="me-1" style={{ color: '#22c55e' }}>●</span>Anonymous Chat
          </div>
        </div>
        <span className="badge bg-warning bg-opacity-10 text-warning ms-auto border border-warning border-opacity-25" 
          style={{ fontSize: '0.7rem' }}>
          <i className="bi bi-shield-lock me-1"></i>Private
        </span>
      </div>

      {/* Messages Area */}
      <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-3" style={{ background: '#9CA57D' }}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <CircularProgress size={28} style={{ color: '#0F5257' }} />
          </div>
        ) : error ? (
          <div className="alert alert-danger py-2 mx-2" style={{ fontSize: '0.82rem' }}>{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted d-flex flex-column align-items-center justify-content-center h-100">
            <i className="bi bi-chat-square-dots" style={{ fontSize: '2.5rem', opacity: 0.2 }}></i>
            <p className="mt-2 mb-0" style={{ fontSize: '0.82rem' }}>
              No messages yet. Say hello anonymously!
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderAnonymousUsername !== peerAnonymousUsername;
            return (
              <div key={msg.id || msg._id || i}
                className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}>
                {!isMe && (
                  <div className="text-muted-sm mb-1 ms-1">{peerAnonymousUsername}</div>
                )}
                <div className={`chat-bubble ${isMe ? 'chat-bubble-self' : 'chat-bubble-peer'}`}>
                  {msg.message}
                </div>
                <div className={`chat-timestamp ${isMe ? 'text-end me-1' : 'ms-1'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="d-flex gap-2 p-2 border-top bg-white">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message anonymously..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading}
          autoComplete="off"
          style={{ borderRadius: 50, fontSize: '0.88rem' }}
        />
        <button
          type="submit"
          className="btn btn-primary d-flex align-items-center justify-content-center"
          disabled={loading || !newMessage.trim() || sending}
          style={{ borderRadius: '50%', width: 40, height: 40, flexShrink: 0, background: '#0F5257', border: 'none', padding: 0 }}
        >
          {sending ? (
            <span className="spinner-border spinner-border-sm" style={{ width: 16, height: 16 }}></span>
          ) : (
            <i className="bi bi-send-fill" style={{ fontSize: '0.9rem' }}></i>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;



