import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationSound = new Audio('/notification.mp3');

  useEffect(() => {
    // Ask for notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Listen for reconnection events
    socket.io.on('reconnect_attempt', () => {
      console.info('🔄 Reconnecting to server...');
    });

    socket.io.on('reconnect', () => {
      console.info('✅ Reconnected to server!');
    });

    socket.on('connect_error', () => {
      console.warn('⚠️ Connection error. Trying to reconnect...');
    });

    // Incoming messages
    socket.on('receive_message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    socket.on('private_message', (msg) => {
      setChat((prev) => [...prev, { ...msg, private: true }]);

      if (Notification.permission === 'granted' && document.hidden) {
        new Notification(`Private message from ${msg.sender}`, {
          body: msg.message,
        });
      }

      notificationSound.play().catch(() => {});
    });

    // System events
    socket.on('user_list', (userList) => setUsers(userList));
    socket.on('user_joined', (data) =>
      setChat((prev) => [...prev, { system: true, message: `${data.username} joined the chat` }])
    );
    socket.on('user_left', (data) =>
      setChat((prev) => [...prev, { system: true, message: `${data.username} left the chat` }])
    );
    socket.on('typing_users', (list) =>
      setTypingUsers(list.filter((u) => u !== username))
    );

    // Unread messages when tab is hidden
    const handleVisibility = () => {
      if (!document.hidden) setUnreadCount(0);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      socket.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [username]);

  const joinChat = () => {
    if (username.trim()) {
      socket.emit('user_join', username);
      setIsJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      if (selectedUser) {
        socket.emit('private_message', {
          to: selectedUser.id,
          message,
        });
      } else {
        socket.emit('send_message', { message }, (res) => {
          if (res?.status === 'ok') {
            console.log('📩 Message delivered ✅', res.messageId);
          }
        });
      }

      setMessage('');
      socket.emit('typing', false);
    }
  };

  // Track unread count
  useEffect(() => {
    if (document.hidden && chat.length > 0) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [chat]);

  useEffect(() => {
    document.title =
      unreadCount > 0 ? `(${unreadCount}) New messages | Chat App` : 'Chat App';
  }, [unreadCount]);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      {!isJoined ? (
        <div>
          <h2>Join Chat</h2>
          <input
            type="text"
            placeholder="Enter your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button onClick={joinChat} style={{ padding: '8px 16px' }}>
            Join
          </button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {username}</h2>

          <div style={{ marginBottom: 10 }}>
            <strong>Online Users:</strong>
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUser(u)}
                style={{
                  margin: '0 5px',
                  background: selectedUser?.id === u.id ? '#ddd' : '#f0f0f0',
                  border: '1px solid #999',
                  padding: '4px 8px',
                  cursor: 'pointer',
                }}
              >
                {u.username}
              </button>
            ))}
            <button
              onClick={() => setSelectedUser(null)}
              style={{
                marginLeft: 10,
                background: !selectedUser ? '#ddd' : '#f0f0f0',
                border: '1px solid #999',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              Global Chat
            </button>
          </div>

          <div
            style={{
              height: 200,
              overflowY: 'scroll',
              border: '1px solid #ccc',
              marginBottom: 10,
              padding: 10,
              backgroundColor: '#fafafa',
            }}
          >
            {chat.map((msg, idx) => (
              <p key={idx}>
                {msg.system ? (
                  <em>{msg.message}</em>
                ) : (
                  <>
                    <strong>{msg.sender}:</strong> {msg.message}
                    {msg.private && (
                      <span style={{ color: 'red', marginLeft: 5 }}>(Private)</span>
                    )}
                  </>
                )}
              </p>
            ))}
          </div>

          {typingUsers.length > 0 && (
            <div style={{ fontStyle: 'italic', color: 'gray', marginBottom: 10 }}>
              {typingUsers.join(', ')}{' '}
              {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}

          <input
            type="text"
            value={message}
            placeholder={
              selectedUser
                ? `Message ${selectedUser.username}...`
                : 'Type a message...'
            }
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              socket.emit('typing', true);
              if (e.key === 'Enter') sendMessage();
            }}
            onKeyUp={() => setTimeout(() => socket.emit('typing', false), 1000)}
            onBlur={() => socket.emit('typing', false)}
            style={{ width: '70%', padding: '8px' }}
          />
          <button
            onClick={sendMessage}
            style={{ padding: '8px 16px', marginLeft: '10px' }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
