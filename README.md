# ScriptGrab

유튜브 URL만 붙여넣으면 자막 추출 + AI 요약을 한번에 해주는 SaaS 서비스.

## 기술스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **인증**: NextAuth.js (Google OAuth)
- **DB**: PostgreSQL + Prisma ORM
- **AI**: OpenAI GPT-4o-mini (스트리밍 요약)
- **결제**: Lemon Squeezy (구독)
- **배포**: Railway

## 주요 기능

- 유튜브 영상 자막 추출 (한국어/영어/자동생성 자막 지원)
- AI 3줄 요약 + 키워드 + 타임라인 (스트리밍)
- 타임스탬프 보기 / 전체 텍스트 보기 탭
- 자막 내 키워드 검색 + 하이라이트
- TXT / SRT 파일 다운로드
- Google OAuth 로그인
- 사용량 제한 (FREE 3회/일, PRO/TEAM 무제한)
- 대시보드 (사용 현황, 추출 기록)
- 구독 결제 (Lemon Squeezy)

## 로컬 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local에 실제 값 입력

# DB 테이블 생성
npx prisma db push

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인

## 환경변수

| 변수 | 설명 |
|---|---|
| `OPENAI_API_KEY` | OpenAI API 키 |
| `NEXTAUTH_SECRET` | NextAuth 시크릿 (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | 앱 URL (로컬: `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿 |
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `LEMONSQUEEZY_API_KEY` | Lemon Squeezy API 키 |
| `LEMONSQUEEZY_STORE_ID` | Lemon Squeezy 스토어 ID |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook 검증 시크릿 |
| `LEMONSQUEEZY_PRO_VARIANT_ID` | Pro 상품 Variant ID |
| `LEMONSQUEEZY_TEAM_VARIANT_ID` | Team 상품 Variant ID |

## Railway 배포

1. Railway에서 새 프로젝트 생성
2. PostgreSQL 서비스 추가
3. GitHub 레포 연결 또는 `railway up`
4. 환경변수 설정 (`DATABASE_URL`은 Railway 내부 주소 자동 연결)
5. 빌드/시작은 `railway.toml`에 정의됨

## 프로젝트 구조

```
app/
├── page.tsx                 # 랜딩 페이지
├── layout.tsx               # 공통 레이아웃 + 메타데이터
├── auth/signin/             # 로그인 페이지
├── dashboard/               # 대시보드
│   ├── page.tsx             # 사용 현황
│   ├── billing/             # 구독 관리
│   └── layout.tsx           # 사이드바 레이아웃
└── api/
    ├── auth/                # NextAuth
    ├── transcript/          # 자막 추출 API
    ├── summarize/           # AI 요약 API
    └── lemonsqueezy/        # 결제 API
components/                  # UI 컴포넌트
lib/                         # 유틸리티
prisma/                      # DB 스키마
types/                       # 타입 정의
```
