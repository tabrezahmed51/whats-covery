// AI Chat Modal with OpenRouter Integration
// Free Models Available on OpenRouter

class AIChatModal {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentModel = 'deepseek/deepseek-r1:free';
        this.apiKey = ''; // User needs to set their OpenRouter API key
        
        // Free models available on OpenRouter
        this.models = [
            { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', provider: 'DeepSeek' },
            { id: 'deepseek/deepseek-v3:free', name: 'DeepSeek V3', provider: 'DeepSeek' },
            { id: 'qwen/qwen3-8b:free', name: 'Qwen 3 8B', provider: 'Alibaba' },
            { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder', provider: 'Alibaba' },
            { id: 'google/gemini-2.5-pro-experimental:free', name: 'Gemini 2.5 Pro (Exp)', provider: 'Google' },
            { id: 'meta-llama/llama-4-scout:free', name: 'Llama 4 Scout', provider: 'Meta' },
            { id: 'cognitivecomputations/dolphin3.0-mistral-24b:free', name: 'Dolphin 3.0 Mistral 24B', provider: 'Mistral' },
            { id: 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free', name: 'Dolphin 3.0 R1 Mistral 24B', provider: 'Mistral' },
            { id: 'mistral/mistral-small:free', name: 'Mistral Small', provider: 'Mistral' },
            { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air', provider: 'Zhipu AI' }
        ];
        
        this.init();
    }
    
    init() {
        this.createModal();
        this.attachEventListeners();
        this.loadAPIKey();
    }
    
    createModal() {
        const modalHTML = `
            <!-- AI Chat Button -->
            <button id="ai-chat-toggle" class="ai-chat-toggle" title="AI Assistant">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="11" r="1"/>
                    <circle cx="8" cy="11" r="1"/>
                    <circle cx="16" cy="11" r="1"/>
                </svg>
            </button>
            
            <!-- AI Chat Modal -->
            <div id="ai-chat-modal" class="ai-chat-modal">
                <div class="ai-chat-container">
                    <!-- Header -->
                    <div class="ai-chat-header">
                        <div class="ai-chat-header-left">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <span>AI Assistant</span>
                        </div>
                        <button id="ai-chat-close" class="ai-chat-close-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Model Selector -->
                    <div class="ai-chat-model-selector">
                        <label for="ai-model-select">Model:</label>
                        <select id="ai-model-select" class="ai-model-select">
                            ${this.models.map(model => 
                                `<option value="${model.id}">${model.name} (${model.provider})</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <!-- API Key Input -->
                    <div id="ai-api-key-section" class="ai-api-key-section">
                        <input 
                            type="password" 
                            id="ai-api-key-input" 
                            placeholder="Enter OpenRouter API Key (get free at openrouter.ai)" 
                            class="ai-api-key-input"
                        />
                        <button id="ai-save-key-btn" class="ai-save-key-btn">Save</button>
                    </div>
                    
                    <!-- Messages Container -->
                    <div id="ai-chat-messages" class="ai-chat-messages"></div>
                    
                    <!-- Input Area -->
                    <div class="ai-chat-input-container">
                        <textarea 
                            id="ai-chat-input" 
                            class="ai-chat-input" 
                            placeholder="Ask me anything..."
                            rows="1"
                        ></textarea>
                        <button id="ai-chat-send" class="ai-chat-send-btn" disabled>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    attachEventListeners() {
        // Toggle modal
        document.getElementById('ai-chat-toggle').addEventListener('click', () => this.toggle());
        document.getElementById('ai-chat-close').addEventListener('click', () => this.close());
        
        // Model selector
        document.getElementById('ai-model-select').addEventListener('change', (e) => {
            this.currentModel = e.target.value;
        });
        
        // API Key
        document.getElementById('ai-save-key-btn').addEventListener('click', () => this.saveAPIKey());
        
        // Send message
        document.getElementById('ai-chat-send').addEventListener('click', () => this.sendMessage());
        document.getElementById('ai-chat-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        document.getElementById('ai-chat-input').addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
        });
    }
    
    loadAPIKey() {
        const savedKey = localStorage.getItem('openrouter_api_key');
        if (savedKey) {
            this.apiKey = savedKey;
            document.getElementById('ai-api-key-input').value = savedKey;
            document.getElementById('ai-api-key-section').style.display = 'none';
            document.getElementById('ai-chat-send').disabled = false;
        }
    }
    
    saveAPIKey() {
        const keyInput = document.getElementById('ai-api-key-input');
        const key = keyInput.value.trim();
        
        if (key) {
            this.apiKey = key;
            localStorage.setItem('openrouter_api_key', key);
            document.getElementById('ai-api-key-section').style.display = 'none';
            document.getElementById('ai-chat-send').disabled = false;
            this.addMessage('System', 'API Key saved! You can now chat with AI.');
        } else {
            alert('Please enter a valid API key');
        }
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.isOpen = true;
        document.getElementById('ai-chat-modal').classList.add('active');
        document.getElementById('ai-chat-input').focus();
    }
    
    close() {
        this.isOpen = false;
        document.getElementById('ai-chat-modal').classList.remove('active');
    }
    
    addMessage(role, content) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message-${role.toLowerCase()}`;
        
        messageDiv.innerHTML = `
            <div class="ai-message-avatar">
                ${role === 'user' ? '👤' : '🤖'}
            </div>
            <div class="ai-message-content">
                <div class="ai-message-role">${role}</div>
                <div class="ai-message-text">${this.formatMessage(content)}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    formatMessage(text) {
        // Basic markdown-like formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }
    
    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message || !this.apiKey) return;
        
        // Add user message
        this.addMessage('User', message);
        this.messages.push({ role: 'user', content: message });
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        
        // Disable input while processing
        input.disabled = true;
        document.getElementById('ai-chat-send').disabled = true;
        
        try {
            // Add loading indicator
            this.addMessage('Assistant', '💭 Thinking...');
            const messagesContainer = document.getElementById('ai-chat-messages');
            const loadingMessage = messagesContainer.lastElementChild;
            
            // Call OpenRouter API
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Whats-Covery AI Assistant'
                },
                body: JSON.stringify({
                    model: this.currentModel,
                    messages: this.messages
                })
            });
            
            const data = await response.json();
            
            // Remove loading message
            loadingMessage.remove();
            
            if (data.choices && data.choices[0]) {
                const assistantMessage = data.choices[0].message.content;
                this.addMessage('Assistant', assistantMessage);
                this.messages.push({ role: 'assistant', content: assistantMessage });
            } else {
                throw new Error(data.error?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('System', `Error: ${error.message}`);
        } finally {
            // Re-enable input
            input.disabled = false;
            document.getElementById('ai-chat-send').disabled = false;
            input.focus();
        }
    }
}

// Initialize AI Chat Modal when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aiChat = new AIChatModal();
    });
} else {
    window.aiChat = new AIChatModal();
}
