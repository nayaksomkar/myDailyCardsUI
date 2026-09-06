import React, { useState, useRef, useEffect } from 'react';
import { getSampleChat, getStoryById } from '../../services/data';

export default function ChatPage({ onReadMore }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const chat = getSampleChat();
    const conversation = chat.conversations?.[0];
    if (conversation?.messages) {
      setMessages(conversation.messages);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const prompts = [
    "What's the biggest story today?",
    "Why is everyone talking about AI agents?",
    "Give me today's news in 2 minutes.",
    "What happened in startups today?",
    "Which story should I read first?",
  ];

  const handleSend = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          role: 'assistant',
          content: "Based on today's sources, the strongest theme is the shift toward AI agents and multi-step workflows. Several sources describe AI systems moving from answering questions toward completing tasks.\n\nThis matters because it represents a fundamental change in how we interact with software.",
          stories: ['story-001', 'story-008'],
        },
        {
          role: 'assistant',
          content: "Today's startup coverage focuses on three key areas:\n\n1. Infrastructure-heavy AI companies continue attracting investment\n2. Founders are prioritizing distribution alongside product\n3. Bootstrapped startups are focusing on early revenue\n\nThe common thread is a shift toward sustainable economics.",
          stories: ['story-002', 'story-017'],
        },
        {
          role: 'assistant',
          content: "Here's your 2-minute briefing:\n\n🤖 AI agents are moving from chatbots to autonomous workflows\n💰 Investors favor infrastructure-heavy AI startups\n⚡ Chipmakers focus on efficiency as AI workloads expand\n🚀 Researchers explore reusable space systems\n📈 Markets watch tech spending and interest rates\n⚽ Sports platforms drive digital engagement\n\nStart with the AI agents story — it's the biggest theme today.",
          stories: ['story-001', 'story-003', 'story-005'],
        },
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="chat-page">
      <div className="chat-page-header">
        <div className="chat-page-title">
          <span className="chat-icon">✦</span>
          <h2>myDailyCards AI</h2>
        </div>
        <p>Ask anything about today's briefing</p>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <div className="chat-message-content">
              <p>{msg.content}</p>
              {msg.stories?.length > 0 && (
                <div className="chat-stories">
                  {msg.stories.map((storyId) => {
                    const story = getStoryById(storyId);
                    if (!story) return null;
                    return (
                      <button
                        key={storyId}
                        className="chat-story-card"
                        onClick={() => onReadMore(storyId)}
                      >
                        <span className="chat-story-title">{story.title}</span>
                        <span className="chat-story-meta">
                          {story.sourceCount || story.sources?.length} sources
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant">
            <div className="chat-typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-prompts">
        {prompts.map((prompt) => (
          <button key={prompt} onClick={() => handleSend(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="chat-input-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about today's stories..."
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22,2 15,22 11,13 2,9" />
          </svg>
        </button>
      </form>
    </div>
  );
}
