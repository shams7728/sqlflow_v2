# 🤖 AI Integration Setup Instructions

## Overview
Your SQL-Flow platform now has full AI integration using Google Gemini API for:
- **Explain Query**: AI explains SQL queries in educational terms
- **Get Hint**: AI provides contextual hints for practice exercises
- **Query Analysis**: AI analyzes queries for errors and improvements

## Setup Steps

### 1. Get Google Gemini API Key (FREE)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Install Backend Dependencies

```bash
cd backend
npm install @google/generative-ai
```

### 3. Configure Environment Variables

Edit `backend/.env` and add your Gemini API key:

```env
# Google Gemini API for AI features
GEMINI_API_KEY=your-actual-api-key-here
```

Replace `your-actual-api-key-here` with the API key you copied from Google AI Studio.

### 4. Restart Backend Server

```bash
cd backend
npm run dev
```

### 5. Test AI Features

1. Navigate to any lesson in your SQL-Flow app
2. Write a SQL query in the editor
3. Click "Explain Query" button - AI will explain your query
4. Click "Get Hint" button - AI will provide a helpful hint
5. Check the "AI Assistant" tab for AI-generated content

## API Endpoints

### POST /api/ai/explain
Explains a SQL query

**Request:**
```json
{
  "query": "SELECT * FROM users WHERE age > 18",
  "lessonContext": "Basic SELECT Queries"
}
```

**Response:**
```json
{
  "success": true,
  "explanation": "This query retrieves all columns from the users table...",
  "query": "SELECT * FROM users WHERE age > 18"
}
```

### POST /api/ai/hint
Gets a hint for a practice exercise

**Request:**
```json
{
  "query": "SELECT name FROM users",
  "exercise": {
    "description": "Find all users older than 18",
    "expectedResult": "List of adult users"
  },
  "lessonContext": "Filtering Data"
}
```

**Response:**
```json
{
  "success": true,
  "hint": "You're on the right track! Consider adding a WHERE clause...",
  "exercise": "Find all users older than 18"
}
```

### POST /api/ai/analyze
Analyzes a SQL query

**Request:**
```json
{
  "query": "SELECT * FROM users WHERE age > 18"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "The query looks good but consider specifying columns..."
}
```

## Features

### 1. Query Explanation
- Click "Explain Query" button in the SQL editor
- AI provides step-by-step breakdown
- Educational and beginner-friendly
- Includes best practices and tips

### 2. AI Hints
- Click "Get Hint" button during practice exercises
- AI analyzes your current query
- Provides guidance without giving away the answer
- Encourages critical thinking

### 3. Fallback System
- If AI service is unavailable, fallback responses are provided
- Ensures users always get some guidance
- No errors or broken functionality

## Cost & Limits

### Google Gemini API (Free Tier)
- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**
- Perfect for educational use!

### Upgrading
If you need more capacity, you can:
1. Upgrade to Gemini Pro paid tier
2. Switch to OpenAI (code already supports it)
3. Implement request caching to reduce API calls

## Troubleshooting

### "Failed to generate explanation"
- Check if GEMINI_API_KEY is set in backend/.env
- Verify API key is valid at Google AI Studio
- Check backend console for error messages

### "AI service unavailable"
- Backend server might not be running
- Check network connectivity
- Verify API endpoint URLs in frontend

### Rate Limiting
- Free tier has 60 requests/minute limit
- Implement caching for frequently asked queries
- Consider upgrading if needed

## Security Best Practices

1. **Never commit API keys** - Already added to .gitignore
2. **Use environment variables** - Already configured
3. **Rate limiting** - Consider adding rate limits to AI endpoints
4. **Input validation** - Already implemented in backend
5. **Error handling** - Fallback system in place

## Future Enhancements

1. **Caching**: Cache common query explanations
2. **Context Memory**: Remember previous interactions
3. **Multi-language**: Support explanations in different languages
4. **Voice Input**: Add voice-to-SQL features
5. **Code Completion**: AI-powered SQL autocomplete

## Support

For issues or questions:
1. Check backend console logs
2. Verify API key configuration
3. Test API endpoints directly with Postman
4. Review Google AI Studio dashboard for usage stats

---

**Your AI integration is now ready to use! 🎉**

Start the backend server and test the AI features in your SQL-Flow application.
