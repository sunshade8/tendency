import { questions } from './questions';

export default function handler(request, response) {
    // Only allow POST method
    if (request.method !== 'POST') {
      return response.status(405).json({ error: 'Method not allowed' });
    }
    
    const { answers } = request.body;
    
    // Initialize categories
    const categories = {
      economic: { progressive: 0, conservative: 0 },
      security: { progressive: 0, conservative: 0 },
      social: { progressive: 0, conservative: 0 },
      environment: { progressive: 0, conservative: 0 },
      law: { progressive: 0, conservative: 0 }
    };
    
    // Calculate scores
    answers.forEach(answer => {
      const { questionId, value } = answer;
      const question = getQuestionById(questionId);
      
      if (question) {
        const isProgressiveAnswer = question.progressiveValue ? (value > 3) : (value < 3);
        const category = categories[question.category];
        
        if (isProgressiveAnswer) {
          category.progressive += Math.abs(value - 3);
        } else {
          category.conservative += Math.abs(value - 3);
        }
      }
    });
    
    // Calculate percentages
    const results = {
      economic: calculatePercentage(categories.economic),
      security: calculatePercentage(categories.security),
      social: calculatePercentage(categories.social),
      environment: calculatePercentage(categories.environment),
      law: calculatePercentage(categories.law)
    };
    
    // Calculate tendency type
    const average = (results.economic + results.security + results.social + 
                     results.environment + results.law) / 5;
    
    let tendencyType;
    if (average >= 80) {
      tendencyType = '극우보수';
    } else if (average >= 60) {
      tendencyType = '중도보수';
    } else if (average >= 40) {
      tendencyType = '중도';
    } else if (average >= 20) {
      tendencyType = '중도진보';
    } else {
      tendencyType = '극좌진보';
    }
    
    results.tendencyType = tendencyType;
    
    response.status(200).json(results);
  }
  
  // Helper functions
  function getQuestionById(id) {
    return questions.find(q => q.id === id);
  }
  
  function calculatePercentage(category) {
    const total = category.progressive + category.conservative;
    if (total === 0) return 50;
    return Math.round((category.conservative / total) * 100);
  }