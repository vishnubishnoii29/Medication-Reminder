# Groq API Token Optimization Guide

## Token Usage Overview

Your Groq API chatbot has been optimized for the **free tier** with aggressive token reduction strategies.

## Optimizations Applied

### 1. **Reduced Max Output Tokens**
- **Before:** 1024 tokens per response
- **After:** 256 tokens per response
- **Savings:** ~75% token reduction per chat message

### 2. **Limited Context Window**
- **Before:** Entire conversation history (unlimited)
- **After:** Last 4 messages only
- **Benefit:** Reduces input tokens, keeps recent context

### 3. **Compressed System Prompt**
- **Before:** 1,500+ characters with detailed instructions
- **After:** ~700 characters (50% reduction)
- **Maintained:** All core health expert functionality

### 4. **Token Usage Logging**
- Every chat logs actual token consumption
- High usage warnings if exceeding 1000 tokens/message
- Visible in server logs

## Estimated Token Costs (Free Tier)

### Per Message Breakdown
| Component | Tokens | Notes |
|-----------|--------|-------|
| System Prompt | 120-150 | Fixed per request |
| User Input | 10-50 | Varies by message length |
| Context (4 msgs) | 100-200 | Recent conversation history |
| Response (256 max) | 150-250 | Limited to 256 tokens |
| **TOTAL PER MESSAGE** | **400-650** | Average: ~500 tokens |

### Monthly Estimation (Free Tier)
- **Free Limit:** ~30,000 tokens/month (varies)
- **Messages Possible:** ~50-75 messages/month
- **Usage Pattern:** ~1,500-2,000 per day recommended

## Free Tier Limits (Groq)

| Limit | Value |
|-------|-------|
| Monthly Tokens | ~30,000 (varies) |
| Rate Limit | 30 requests/minute |
| Requests/Day | ~1,500 |
| Model | mixtral-8x7b-32768 |

## How to Monitor Usage

### In Server Logs
```
INFO Chat tokens used: 523 (input: 281, output: 242)
WARN High token usage: 1,250 tokens (input: 750, output: 500)
```

### Server Console Output
- Run: `npm run dev`
- Watch terminal for token usage logs
- Check for any high-usage warnings

## Further Optimization Options (If Needed)

### Option 1: Reduce Response Length
Change in `aiService.js`:
```javascript
max_tokens: 128,  // Even shorter responses
```

### Option 2: Limit Context Further
```javascript
const recentHistory = messageHistory.slice(-2);  // Last 2 messages only
```

### Option 3: Fallback Strategy
Use Python service first, Groq as backup:
```javascript
// Try Python service first, fall back to Groq
```

## Monthly Usage Estimate

**Example Scenario:** 2 users using app actively
- Vishnu: 10 messages/day = 5,000 tokens/day
- Pragya: 10 messages/day = 5,000 tokens/day
- **Total:** ~10,000 tokens/day = **300,000 tokens/month**

⚠️ **This would exceed free tier!**

## Recommendation for Production

For production with multiple users, consider:
1. **Paid Groq Tier** - ~$0.00015 per token (very cheap)
2. **Hybrid Approach** - Use Python service for heavy lifting, Groq for specialized health questions
3. **Caching** - Store common responses locally
4. **Rate Limiting** - Cap users to 5 messages/day

## Current Implementation

✅ **Current Config (Optimized for Free Tier):**
- Max output: 256 tokens
- Context: 4 messages
- System prompt: ~700 chars
- Estimated: 500 tokens/message
- Monthly capacity: ~60 messages

This is ideal for 1-2 active users or light testing. Scale up with paid API for production.
