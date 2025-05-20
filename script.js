document.addEventListener('DOMContentLoaded', () => {
  // Page elements
  const app = document.getElementById('app');
  
  // Create all pages
  createStartPage();
  createSurveyPage();
  createResultPage();
  createLoadingPage();
  
  // Setup logo click events
  setTimeout(() => {
    setupLogoClickEvents();
  }, 100);
  
  // Initialize survey data
  initSurvey();
  
  // Setup routing
  setupRouting();
  
  // Navigate to initial route
  handleRouting();
});

// Routing functions
function setupRouting() {
  // Listen for URL changes
  window.addEventListener('popstate', handleRouting);
}

function handleRouting() {
  const pathname = window.location.pathname;
  
  // Default to start page if no path or if path is just "/"
  if (pathname === '/' || pathname === '') {
    navigateTo('start');
    return;
  }
  
  // Extract the page name from URL
  const path = pathname.split('/').pop();
  
  // Show appropriate page based on path
  switch (path) {
    case 'start':
      showPage('start-page');
      break;
    case 'questions':
      showPage('survey-page');
      break;
    case 'analyzing':
      showPage('loading-page');
      break;
    case 'result':
      // Only allow direct access to result if we have results calculated
      if (Object.keys(state.surveyAnswers).length === state.surveyQuestions.length) {
        showPage('result-page');
      } else {
        navigateTo('start');
      }
      break;
    default:
      // Default to start page for unknown routes
      navigateTo('start');
  }
}

function navigateTo(path) {
  const newPath = '/' + path;
  
  // Only push state if it's different from current path
  if (window.location.pathname !== newPath) {
    window.history.pushState({}, '', newPath);
  }
  
  // Always clean up any potential duplicate pages
  document.querySelectorAll('.page').forEach(page => {
    if (page.classList.contains('active')) {
      page.classList.remove('active');
    }
  });
  
  // Handle the route change
  switch (path) {
    case 'start':
      showPage('start-page');
      break;
    case 'questions':
      showPage('survey-page');
      break;
    case 'analyzing':
      showPage('loading-page');
      break;
    case 'result':
      showPage('result-page');
      break;
  }
}

// Global functions for buttons
window.startTest = function() {
  console.log('Start button clicked directly');
  
  // Track start test event
  if (window.va) {
    window.va('event', {
      name: 'start_test'
    });
  }
  
  navigateTo('questions');
};

window.shareResults = function() {
  // Construct share text
  const shareText = `나는 ${state.tendencyType}! 정치 성향 테스트 결과를 확인해보세요.`;
  
  // Track share results event
  if (window.va) {
    window.va('event', {
      name: 'share_results',
      data: { tendency_type: state.tendencyType }
    });
  }
  
  // Check if Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: '정치 성향 테스트 결과',
      text: shareText,
      url: window.location.origin + '/result'
    })
    .then(() => console.log('Shared successfully'))
    .catch((error) => console.log('Error sharing:', error));
  } else {
    // Fallback for browsers that don't support the Web Share API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText + ' ' + window.location.origin + '/result')
        .then(() => {
          alert('클립보드에 복사되었습니다. 원하는 곳에 붙여넣기 하세요.');
        })
        .catch(err => {
          console.error('클립보드 복사 실패:', err);
          alert('공유 기능을 사용할 수 없습니다.');
        });
    } else {
      alert('공유 기능을 지원하지 않는 브라우저입니다.');
    }
  }
};

window.followSocialMedia = function() {
  // This would normally open a link to social media
  window.open('https://www.instagram.com/', '_blank');
};

window.checkResults = function() {
  try {
    console.log('Submit button clicked');
    
    // Track submit answers event
    if (window.va) {
      window.va('event', {
        name: 'submit_answers',
        data: { question_count: Object.keys(state.surveyAnswers).length }
      });
    }
    
    // Navigate to analyzing page
    navigateTo('analyzing');
    
    // Format answers for the API
    const answers = Object.entries(state.surveyAnswers).map(([questionId, value]) => {
      return { questionId, value };
    });
    
    // Call API to calculate results
    fetch('/api/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Save the results
      state.results = {
        economic: data.economic,
        security: data.security,
        social: data.social,
        environment: data.environment,
        law: data.law
      };
      state.tendencyType = data.tendencyType;
      
      // Save results to localStorage so result.html can access them
      localStorage.setItem('surveyResults', JSON.stringify({
        economic: data.economic,
        security: data.security,
        social: data.social,
        environment: data.environment,
        law: data.law,
        tendencyType: data.tendencyType
      }));
      localStorage.setItem('surveyAnswers', JSON.stringify(state.surveyAnswers));
      
      // Update result page with the data
      updateResultPage();
      
      // Navigate to result page
      setTimeout(() => {
        navigateTo('result');
        console.log('Result page should now be displayed');
      }, 1500);
    })
    .catch(error => {
      console.error('Error fetching results:', error);
      alert('결과를 계산하는 중 오류가 발생했습니다. 다시 시도해주세요.');
      navigateTo('start');
    });
  } catch (error) {
    console.error('Error in submit button handler:', error);
    alert('결과를 계산하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    navigateTo('start');
  }
};

// Global state
const state = {
  currentPage: null,
  surveyAnswers: {},
  surveyProgress: 0,
  surveyQuestions: [
    // 경제/복지 (Economy/Welfare)
{ id: 'q1', text: '부유층에 대한 세율을 대폭 인상해야한다', category: 'economic', progressiveValue: true },
{ id: 'q2', text: '국가가 실업·산재 등 최소한의 사회안전망을 제공해야 한다', category: 'economic', progressiveValue: true },
{ id: 'q3', text: '시장 자율에 맡겨서 기업활동 규제를 최소화해야 한다', category: 'economic', progressiveValue: false },
{ id: 'q4', text: '기본소득(무조건적 현금지급)을 도입해야 한다', category: 'economic', progressiveValue: true },

// 안보/외교 (Security/Diplomacy)
{ id: 'q5', text: '북한과의 대화와 협력을 우선해야 한다', category: 'security', progressiveValue: true },
{ id: 'q6', text: '강력한 한미동맹이 국가안보에 필수적이다', category: 'security', progressiveValue: false },
{ id: 'q7', text: '국방비 증액은 현 시점에서 필수적이다', category: 'security', progressiveValue: false },
{ id: 'q8', text: '주변국과의 경제적 협력이 군사적 견제보다 중요하다', category: 'security', progressiveValue: true },

// 사회/문화 (Social/Cultural)
{ id: 'q9', text: '동성결혼을 법적으로 인정해야 한다', category: 'social', progressiveValue: true },
{ id: 'q10', text: '전통적인 가족 가치는 사회의 기본이다', category: 'social', progressiveValue: false },
{ id: 'q11', text: '다문화 정책을 더욱 확대해야 한다', category: 'social', progressiveValue: true },
{ id: 'q12', text: '징병제는 현행대로 유지되어야 한다', category: 'social', progressiveValue: false },

// 환경/에너지 (Environment/Energy)
{ id: 'q13', text: '경제성장보다 환경보호가 우선되어야 한다', category: 'environment', progressiveValue: true },
{ id: 'q14', text: '원자력 발전은 확대되어야 한다', category: 'environment', progressiveValue: false },
{ id: 'q15', text: '탄소중립을 위해 산업규제를 강화해야 한다', category: 'environment', progressiveValue: true },
{ id: 'q16', text: '환경보호보다 일자리 창출이 더 시급하다', category: 'environment', progressiveValue: false },

// 법/치안/기타 (Law/Public Safety/Others)
{ id: 'q17', text: '중대 범죄에 대한 처벌을 강화해야 한다', category: 'law', progressiveValue: false },
{ id: 'q18', text: '사형제도는 폐지되어야 한다', category: 'law', progressiveValue: true },
{ id: 'q19', text: '마약 소지에 대한 처벌을 완화해야 한다', category: 'law', progressiveValue: true },
{ id: 'q20', text: '공공장소 CCTV 설치를 확대해야 한다', category: 'law', progressiveValue: false }
  ],
  results: {
    economic: 80,
    security: 80,
    social: 80,
    environment: 80,
    law: 80
  },
  tendencyType: '중도보수'
};

// Page creation functions
function createStartPage() {
  const startPage = document.createElement('div');
  startPage.classList.add('page', 'start-page');
  startPage.id = 'start-page';
  
  startPage.innerHTML = `
    <div class="logo">
      <div class="logo-img"></div>
    </div>
    <div class="main-title-container">
      <h1 class="main-title">나는 보수일까<br>진보일까?</h1>
    </div>
    <a href="/questions" class="start-btn" id="start-test-btn">테스트 시작하기</a>
  `;
  
  app.appendChild(startPage);
}

function createSurveyPage() {
  try {
    const surveyPage = document.createElement('div');
    surveyPage.classList.add('page', 'survey-page');
    surveyPage.id = 'survey-page';
    
    let questionsHTML = '';
    state.surveyQuestions.forEach((question, index) => {
      questionsHTML += `
        <div class="question-container" id="${question.id}" ${index > 0 ? 'style="display: none;"' : 'style="display: flex;"'}>
          <p class="question-text" id="question-text-${question.id}"></p>
          <div class="opinion-scale">
            <div class="opinion-option" data-value="1" data-question="${question.id}" onclick="selectOption(this, 1, '${question.id}')"></div>
            <div class="opinion-option" data-value="2" data-question="${question.id}" onclick="selectOption(this, 2, '${question.id}')"></div>
            <div class="opinion-option" data-value="3" data-question="${question.id}" onclick="selectOption(this, 3, '${question.id}')"></div>
            <div class="opinion-option" data-value="4" data-question="${question.id}" onclick="selectOption(this, 4, '${question.id}')"></div>
            <div class="opinion-option" data-value="5" data-question="${question.id}" onclick="selectOption(this, 5, '${question.id}')"></div>
          </div>
          <div class="opinion-labels">
            <span class="left-label">매우 동의</span>
            <span class="right-label">매우 비동의</span>
          </div>
        </div>
      `;
    });
    
    surveyPage.innerHTML = `
      <div class="logo">
        <div class="logo-img"></div>
      </div>
      ${questionsHTML}
      <a href="javascript:checkResults()" class="submit-btn" id="check-results-btn">결과 확인하기</a>
      <div class="progress-bar-bottom">
        <div class="progress-indicator" id="survey-progress"></div>
      </div>
    `;
    
    app.appendChild(surveyPage);
    
    // Set the formatted text with innerHTML
    state.surveyQuestions.forEach((question) => {
      const questionTextElement = document.getElementById(`question-text-${question.id}`);
      if (questionTextElement) {
        questionTextElement.innerHTML = formatQuestionText(question.text);
      }
    });
  } catch (error) {
    console.error('Error in createSurveyPage:', error);
  }
}

function createResultPage() {
  const resultPage = document.createElement('div');
  resultPage.classList.add('page', 'result-preview');
  resultPage.id = 'result-page';
  
  resultPage.innerHTML = `
    <div class="logo">
      <div class="logo-img"></div>
    </div>
    <p class="result-title">당신은</p>
    <p class="tendency-name">중도보수입니다!</p>
    <div class="result-character"></div>
    
    <div class="tendency-bar">
      <div class="tendency-category">
        <span>경제/복지</span>
      </div>
      <div class="opinion-labels">
        <span class="left-label">진보</span>
        <span class="right-label">보수</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar" style="width: 80%;"></div>
      </div>
    </div>
    
    <div class="tendency-bar">
      <div class="tendency-category">
        <span>안보/외교</span>
      </div>
      <div class="opinion-labels">
        <span class="left-label">진보</span>
        <span class="right-label">보수</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar" style="width: 80%;"></div>
      </div>
    </div>
    
    <div class="tendency-bar">
      <div class="tendency-category">
        <span>사회/문화</span>
      </div>
      <div class="opinion-labels">
        <span class="left-label">진보</span>
        <span class="right-label">보수</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar" style="width: 80%;"></div>
      </div>
    </div>
    
    <div class="tendency-bar">
      <div class="tendency-category">
        <span>환경/에너지</span>
      </div>
      <div class="opinion-labels">
        <span class="left-label">진보</span>
        <span class="right-label">보수</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar" style="width: 80%;"></div>
      </div>
    </div>
    
    <div class="tendency-bar">
      <div class="tendency-category">
        <span>법/치안/기타</span>
      </div>
      <div class="opinion-labels">
        <span class="left-label">진보</span>
        <span class="right-label">보수</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar" style="width: 80%;"></div>
      </div>
    </div>
    
    <p class="share-text">친구들에게 결과를 공유해보세요!</p>
    <a href="javascript:shareResults()" class="share-btn" id="share-btn">결과 공유하기</a>
    
    <p class="additional-info">편향적인 언론 말고<br>중립적인 뉴스를 보고 싶다면?</p>
    <a href="javascript:followSocialMedia()" class="follow-btn" id="follow-btn">팔로우 하러가기</a>
    
    <div class="footer">
      <p>AI 중립뉴스 ●●● 미디안<br>인스타그램 팔로우!</p>
      <p>AI 여론조사<br>솔루션 기념 50% 할인중!<br>의뢰/문의는<br>business@lautrec.kr</p>
    </div>
  `;
  
  app.appendChild(resultPage);
}

function createLoadingPage() {
  const loadingPage = document.createElement('div');
  loadingPage.classList.add('page', 'loading-page');
  loadingPage.id = 'loading-page';
  
  loadingPage.innerHTML = `
    <p class="loading-text">결과 분석중...</p>
    <div class="loading-spinner">
      <div class="spinner-circle"></div>
      <div class="spinner-circle large"></div>
      <div class="spinner-circle"></div>
    </div>
    <div class="footer loading-footer">
      <p>AI 중립뉴스 ●●● 미디안<br>인스타그램 팔로우!</p>
      <a href="javascript:followSocialMedia()" class="follow-btn" id="loading-follow-btn">팔로우 하러가기</a>
    </div>
  `;
  
  app.appendChild(loadingPage);
}

// Helper functions
function showPage(pageId) {
  try {
    console.log(`Attempting to show page: ${pageId}`);
    
    // Hide current page
    if (state.currentPage) {
      const currentPageEl = document.getElementById(state.currentPage);
      if (currentPageEl) {
        currentPageEl.classList.remove('active');
      }
    }
    
    // Show new page
    const newPageEl = document.getElementById(pageId);
    if (newPageEl) {
      newPageEl.classList.add('active');
      state.currentPage = pageId;
      console.log(`Successfully switched to page: ${pageId}`);
    } else {
      console.error(`Page element not found: ${pageId}`);
    }
  } catch (error) {
    console.error('Error in showPage function:', error);
  }
}

function initSurvey() {
  state.surveyAnswers = {};
  state.surveyProgress = 0;
  
  // Fetch questions from API
  fetch('/api/questions')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // If we successfully get questions from the API, use them
      if (data.questions && data.questions.length > 0) {
        state.surveyQuestions = data.questions;
        console.log('Questions loaded from API:', state.surveyQuestions.length);
        
        // Recreate the survey page with the new questions
        const surveyPage = document.getElementById('survey-page');
        if (surveyPage) {
          // Clear existing content
          surveyPage.innerHTML = '';
          // Recreate the survey page
          createSurveyPage();
        }
      }
    })
    .catch(error => {
      console.error('Error fetching questions:', error);
      // Continue with the hardcoded questions on error
      console.log('Using hardcoded questions as fallback');
    })
    .finally(() => {
      // Update the progress bar
      updateSurveyProgress();
    });
}

function updateSurveyProgress() {
  const answeredCount = Object.keys(state.surveyAnswers).length;
  const totalQuestions = state.surveyQuestions.length;
  state.surveyProgress = (answeredCount / totalQuestions) * 100;
  
  const progressBar = document.getElementById('survey-progress');
  if (progressBar) {
    progressBar.style.width = `${state.surveyProgress}%`;
  }
  
  // Show or hide submit button based on progress
  const submitBtn = document.getElementById('check-results-btn');
  if (submitBtn) {
    submitBtn.style.display = answeredCount === totalQuestions ? 'block' : 'none';
  }
}

// New functions for calculating and displaying results
function calculateResults() {
  // Group questions by category
  const questionsByCategory = {};
  state.surveyQuestions.forEach(question => {
    if (!questionsByCategory[question.category]) {
      questionsByCategory[question.category] = [];
    }
    questionsByCategory[question.category].push(question);
  });
  
  // Calculate scores for each category
  Object.keys(questionsByCategory).forEach(category => {
    const questions = questionsByCategory[category];
    let totalScore = 0;
    
    questions.forEach(question => {
      const answer = state.surveyAnswers[question.id] || 3; // Default to middle if not answered
      
      // 1 is strongly agree, 5 is strongly disagree
      // Transform to 0-100 scale where higher means more conservative
      let score;
      if (question.progressiveValue) {
        // For progressive questions, agreeing (low values) means more progressive (low result)
        score = ((answer - 1) / 4) * 100;
      } else {
        // For conservative questions, agreeing (low values) means more conservative (high result)
        score = ((5 - answer) / 4) * 100;
      }
      
      totalScore += score;
    });
    
    // Average score for the category
    state.results[category] = Math.round(totalScore / questions.length);
  });
  
  // Determine overall tendency type
  const overallScore = Object.values(state.results).reduce((sum, score) => sum + score, 0) / Object.keys(state.results).length;
  
  if (overallScore >= 80) {
    state.tendencyType = '극우보수';
  } else if (overallScore >= 60) {
    state.tendencyType = '중도보수';
  } else if (overallScore >= 40) {
    state.tendencyType = '중도';
  } else if (overallScore >= 20) {
    state.tendencyType = '중도진보';
  } else {
    state.tendencyType = '극좌진보';
  }
  
  console.log('Results calculated:', state.results, 'Tendency Type:', state.tendencyType);
}

function updateResultPage() {
  // Update tendency name
  document.querySelector('.tendency-name').textContent = state.tendencyType + '입니다!';
  
  // Update progress bars
  const progressBars = document.querySelectorAll('.progress-bar');
  
  // Update economic score
  progressBars[0].style.width = `${state.results.economic}%`;
  
  // Update security score
  progressBars[1].style.width = `${state.results.security}%`;
  
  // Update social score
  progressBars[2].style.width = `${state.results.social}%`;
  
  // Update environment score
  progressBars[3].style.width = `${state.results.environment}%`;
  
  // Update law score
  progressBars[4].style.width = `${state.results.law}%`;
  
  // Update character image based on tendency type
  const characterImage = document.querySelector('.result-character');
  let characterImagePath = '';
  
  switch(state.tendencyType) {
    case '극우보수':
      characterImagePath = 'images/character-conservative.png';
      break;
    case '중도보수':
      characterImagePath = 'images/character-moderate-conservative.png';
      break;
    case '중도':
      characterImagePath = 'images/character-moderate.png';
      break;
    case '중도진보':
      characterImagePath = 'images/character-moderate-progressive.png';
      break;
    case '극좌진보':
      characterImagePath = 'images/character-progressive.png';
      break;
  }
  
  if (characterImagePath) {
    characterImage.style.backgroundImage = `url('${characterImagePath}')`;
    characterImage.style.backgroundSize = 'contain';
    characterImage.style.backgroundPosition = 'center';
    characterImage.style.backgroundRepeat = 'no-repeat';
  }
}

// Add logo click event to all pages
function setupLogoClickEvents() {
  document.querySelectorAll('.logo').forEach(logo => {
    logo.addEventListener('click', () => {
      // Don't redirect if already on start page
      if (state.currentPage !== 'start-page') {
        // Ask for confirmation if in the middle of the survey
        if (state.currentPage === 'survey-page' && Object.keys(state.surveyAnswers).length > 0) {
          if (confirm('테스트를 처음부터 다시 시작하시겠습니까? 현재 진행 상황은 저장되지 않습니다.')) {
            initSurvey();
            navigateTo('start');
          }
        } else {
          navigateTo('start');
        }
      }
    });
  });
}

// Format question text for better line breaks
function formatQuestionText(text) {
  if (!text || text.length < 10) return text;
  
  // For longer text, try to find a good breaking point
  const midpoint = Math.floor(text.length / 2);
  
  // Try to find a space near the midpoint
  let breakIndex = -1;
  for (let i = 0; i < 10; i++) {
    // Check increasingly farther from the midpoint
    const checkIndex = text.indexOf(' ', midpoint - i);
    if (checkIndex !== -1 && checkIndex <= midpoint + i) {
      breakIndex = checkIndex;
      break;
    }
  }
  
  if (breakIndex !== -1) {
    return text.substring(0, breakIndex) + '<br>' + text.substring(breakIndex + 1);
  }
  
  return text;
}

// Add this new function for opinion option selection
window.selectOption = function(element, value, questionId) {
  // Remove selection from other options in the same question
  document.querySelectorAll(`.opinion-option[data-question="${questionId}"]`).forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Add selection to clicked option
  element.classList.add('selected');
  
  // Save answer
  state.surveyAnswers[questionId] = value;
  
  // Update progress
  updateSurveyProgress();
  
  // Move to next question with a slight delay for animation
  const currentIndex = state.surveyQuestions.findIndex(q => q.id === questionId);
  if (currentIndex < state.surveyQuestions.length - 1) {
    setTimeout(() => {
      document.getElementById(questionId).style.display = 'none';
      document.getElementById(state.surveyQuestions[currentIndex + 1].id).style.display = 'flex';
    }, 300);
  }
}; 