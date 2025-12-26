import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { useAuth } from '../../lib/AuthContext'; // Import useAuth
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const { siteConfig } = useDocusaurusContext();
  const apiBaseUrl = (siteConfig.customFields?.apiBaseUrl as string) || 'http://localhost:8000';
  const authServerUrl = (siteConfig.customFields?.authBaseUrl as string) || 'http://localhost:10000';

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! I am your AI assistant for this course. Ask me anything about Physical AI, ROS 2, or the provided reading materials.', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [eddsaToken, setEddsaToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { session, isLoading: authLoading } = useAuth(); // Get session and authLoading state
  const history = useHistory();
  const loginPath = useBaseUrl('/login');

  // Fetch EdDSA token when session is available
  useEffect(() => {
    const fetchEddsaToken = async () => {
      if (session && !eddsaToken) {
        try {
          const response = await fetch(`${authServerUrl}/api/auth/token/eddsa`, {
            credentials: 'include' // Include session cookie
          });

          if (response.ok) {
            const data = await response.json();
            setEddsaToken(data.token);
            console.log('✓ EdDSA token obtained for Python backend');
          } else {
            console.error('Failed to get EdDSA token:', response.status);
          }
        } catch (error) {
          console.error('Error fetching EdDSA token:', error);
        }
      }
    };

    fetchEddsaToken();
  }, [session, eddsaToken, authServerUrl]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!session) {
        // If not logged in, redirect to login page
        history.push(loginPath);
        return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Add Authorization header with the EdDSA token for Python backend
    if (eddsaToken) {
        headers['Authorization'] = `Bearer ${eddsaToken}`;
    } else {
        // If we don't have an EdDSA token yet, try to fetch it
        console.warn('No EdDSA token available, fetching...');
        try {
            const tokenResponse = await fetch(`${authServerUrl}/api/auth/token/eddsa`, {
                credentials: 'include'
            });
            if (tokenResponse.ok) {
                const tokenData = await tokenResponse.json();
                setEddsaToken(tokenData.token);
                headers['Authorization'] = `Bearer ${tokenData.token}`;
            } else {
                throw new Error('Failed to get EdDSA token');
            }
        } catch (error) {
            console.error('Error fetching EdDSA token:', error);
            history.push(loginPath);
            setIsLoading(false);
            return;
        }
    }

    try {
      // Call the FastAPI backend
      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          user_query: userMessage.text,
        }),
      });

      if (response.status === 401) {
        // Unauthorized, redirect to login
        history.push(loginPath);
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error trying to reach the server. Please ensure the backend is running.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Optionally, show a loading state for authentication
  if (authLoading) {
    return <div className={styles.chatContainer}>Loading authentication...</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === 'user' ? styles.userMessage : styles.botMessage
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.botMessage}`}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || !session} // Disable input if not logged in
        />
        <button 
          className={styles.sendButton} 
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim() || !session} // Disable button if not logged in
        >
          {session ? 'Send' : 'Login to Chat'}
        </button>
      </div>
    </div>
  );
}
