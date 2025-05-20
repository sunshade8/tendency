// Export the questions array for other modules to use
export const questions = [
  {
    id: 'q1',
    text: '기업에 대한 규제를 완화해야 한다',
    category: 'economic',
    progressiveValue: false
  },
  {
    id: 'q2',
    text: '부자들에게 더 많은 세금을 부과해야 한다',
    category: 'economic',
    progressiveValue: true
  },
  {
    id: 'q3',
    text: '시장 자율에 맡겨서 기업활동 규제를 최소화해야 한다',
    category: 'economic',
    progressiveValue: false
  },
  {
    id: 'q4',
    text: '기본소득(무조건적 현금지급)을 도입해야 한다',
    category: 'economic',
    progressiveValue: true
  },
  
  // 안보/외교
  {
    id: 'q5',
    text: '북한과의 대화와 협력을 우선해야 한다',
    category: 'security',
    progressiveValue: true
  },
  {
    id: 'q6',
    text: '강력한 한미동맹이 국가안보에 필수적이다',
    category: 'security',
    progressiveValue: false
  },
  
  // 사회/문화
  {
    id: 'q7',
    text: '동성결혼을 법적으로 인정해야 한다',
    category: 'social',
    progressiveValue: true
  },
  {
    id: 'q8',
    text: '전통적인 가족 가치는 사회의 기본이다',
    category: 'social',
    progressiveValue: false
  },
  
  // 환경/에너지
  {
    id: 'q9',
    text: '경제성장보다 환경보호가 우선되어야 한다',
    category: 'environment',
    progressiveValue: true
  },
  {
    id: 'q10',
    text: '원자력 발전은 확대되어야 한다',
    category: 'environment',
    progressiveValue: false
  },
  
  // 법/치안/기타
  {
    id: 'q11',
    text: '중대 범죄에 대한 처벌을 강화해야 한다',
    category: 'law',
    progressiveValue: false
  },
  {
    id: 'q12',
    text: '사형제도는 폐지되어야 한다',
    category: 'law',
    progressiveValue: true
  }
];

export default function handler(request, response) {
  response.status(200).json({ questions });
}