// Simple utility script to support basic navigation and UI features
document.addEventListener('DOMContentLoaded', () => {
  console.log("Fixed script.js loaded successfully");
  
  // Setup page navigation
  setupLogoClickEvents();
  
  // Handle initial routing
  const path = window.location.pathname;
  console.log(`Initial path: ${path}`);
});

// Simple page navigation
function navigateTo(page) {
  window.location.href = '/' + page;
}

// Logo click events
function setupLogoClickEvents() {
  document.querySelectorAll('.logo').forEach(logo => {
    logo.addEventListener('click', () => {
      if (window.location.pathname.includes('questions')) {
        // Ask for confirmation if on questions page
        if (confirm('테스트를 처음부터 다시 시작하시겠습니까?')) {
          navigateTo('');
        }
      } else {
        // Just go to start page
        navigateTo('');
      }
    });
  });
}

// Share results function
window.shareResults = function() {
  const resultsJSON = localStorage.getItem('surveyResults');
  if (!resultsJSON) return;
  
  try {
    const results = JSON.parse(resultsJSON);
    const shareText = `나는 ${results.tendencyType}! 정치 성향 테스트 결과를 확인해보세요.`;
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: '정치 성향 테스트 결과',
        text: shareText,
        url: shareUrl
      }).catch(err => console.log('Share error:', err));
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText + ' ' + shareUrl)
        .then(() => alert('클립보드에 복사되었습니다.'))
        .catch(() => alert('공유 기능을 사용할 수 없습니다.'));
    } else {
      alert('공유 기능을 지원하지 않는 브라우저입니다.');
    }
  } catch (err) {
    console.error('Share error:', err);
  }
}; 