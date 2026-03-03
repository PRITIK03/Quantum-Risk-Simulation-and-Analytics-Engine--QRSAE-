import { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Minimize2 } from 'lucide-react';
import { apiService, type ChatMessage } from '../services/apiService';

interface AIAssistantProps {
    systemContext?: {
        criticalSystems: number;
        migrationProgress: number;
        budget: number;
        day: number;
    };
}

export function AIAssistant({ systemContext }: AIAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: 'Hello! I\'m your AI Risk Analyst. I can help you analyze quantum threats, provide migration advice, and answer security questions. How can I assist you today?',
            isUser: false,
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = useCallback(async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: inputValue,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await apiService.chat(inputValue);

            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: response.text || 'I apologize, but I couldn\'t process that request.',
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error. Please try again.',
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, isLoading]);

    const getRiskAnalysis = useCallback(async () => {
        if (!systemContext || isLoading) return;

        setIsLoading(true);
        try {
            const response = await apiService.getRiskAnalysis(systemContext);

            const aiMessage: ChatMessage = {
                id: Date.now().toString(),
                text: response.text || 'Unable to generate risk analysis.',
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Risk analysis error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [systemContext, isLoading]);

    const getThreatIntel = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await apiService.getThreatIntelligence();

            const aiMessage: ChatMessage = {
                id: Date.now().toString(),
                text: response.text || 'Unable to fetch threat intelligence.',
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Threat intel error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="animate-float"
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}
            >
                <Bot size={28} color="white" />
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '400px',
            height: '600px',
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            border: '1px solid var(--border-default)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '16px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bot size={24} />
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>AI Risk Analyst</h3>
                        <span style={{ fontSize: '12px', opacity: 0.9 }}>Powered by AI</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'white',
                    }}
                >
                    <Minimize2 size={20} />
                </button>
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <QuickButton onClick={getRiskAnalysis} disabled={isLoading || !systemContext}>
                        📊 Risk Analysis
                    </QuickButton>
                    <QuickButton onClick={getThreatIntel} disabled={isLoading}>
                        🔍 Threat Intel
                    </QuickButton>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
            }}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'flex-start',
                            flexDirection: msg.isUser ? 'row-reverse' : 'row',
                        }}
                    >
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: msg.isUser ? 'var(--accent-primary)' : 'var(--accent-emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            {msg.isUser ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div style={{
                            background: msg.isUser ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                            padding: '12px',
                            borderRadius: '12px',
                            maxWidth: '80%',
                            fontSize: '14px',
                            lineHeight: 1.5,
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--accent-emerald)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Bot size={18} />
                        </div>
                        <div style={{
                            background: 'var(--bg-tertiary)',
                            padding: '12px',
                            borderRadius: '12px',
                            display: 'flex',
                            gap: '4px',
                        }}>
                            <Loader size={16} className="animate-spin" />
                            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '8px',
            }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about security risks..."
                    style={{
                        flex: 1,
                        padding: '12px',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                    }}
                />
                <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    style={{
                        padding: '12px 16px',
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                        opacity: isLoading || !inputValue.trim() ? 0.5 : 1,
                    }}
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}

function QuickButton({ onClick, disabled, children }: {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: '6px 12px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-default)',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                color: 'white',
                transition: 'all 0.2s ease',
            }}
        >
            {children}
        </button>
    );
}
