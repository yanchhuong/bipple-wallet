# Beple Wallet — User Journey by Case

사용자 유형별 여정 문서 (User Case별 User Journey)

---

## Case 1: 내국인 + 은행계좌 (Domestic + Bank Account)

> 한국 은행 계좌를 보유한 내국인 사용자

```
Splash Screen
    │
    └─→ "새로운 사용자" 클릭
          │
          ▼
Step 1. 기본 정보 입력
    ├─ 휴대폰 번호 입력
    ├─ 인증번호 발송 → OTP 자동입력 → 인증완료
    ├─ 통신사 / 주민등록번호 / 이름 자동입력
    └─ [다음] 클릭
          │
          ▼
    "한국의 은행 계좌가 있으신가요?"
    ├─ [예, 있습니다] 클릭 → userType = 'domestic'
          │
          ▼
Step 2. 충전 수단 등록
    ├─ [은행 계좌] 선택 ✓
    ├─ 은행 선택 (신한/국민/우리/하나/농협/IBK/카카오/토스)
    ├─ 계좌번호 + 예금주 입력
    ├─ 약관 동의
    ├─ ARS 인증 (2자리 코드)
    └─ 등록 완료 → completeKyc() ✓
          │
          ▼
Step 3. 이용약관 동의
    ├─ 서비스 이용약관 [필수]
    ├─ 개인정보 수집 [필수]
    ├─ 마케팅 수신 [선택]
    └─ [동의하고 계속]
          │
          ▼
Step 4. PIN 설정
    ├─ 6자리 PIN 입력
    ├─ PIN 확인 재입력
    └─ 설정 완료
          │
          ▼
    🏠 Home (0 KRW 잔액)
    ├─ 충전: 은행계좌 / Korbit / Direct Transfer Crypto
    ├─ 결제: QR 결제
    └─ ATM: 현금 출금

    KYC 상태: ✅ KYC 인증 완료
    사용자 유형: 내국인
    충전 한도: 2,000,000 KRW
```

---

## Case 2: 내국인 + Korbit 거래소 (Domestic + Korbit Exchange)

> Korbit 거래소 계정을 보유한 내국인 사용자

```
Splash Screen
    │
    └─→ "새로운 사용자" 클릭
          │
          ▼
Step 1. 기본 정보 입력
    ├─ 휴대폰 인증 (OTP)
    ├─ 통신사 / 주민등록번호 / 이름 자동입력
    └─ [다음]
          │
          ▼
    "한국의 은행 계좌가 있으신가요?"
    ├─ [예, 있습니다] 클릭 → userType = 'domestic'
          │
          ▼
Step 2. 충전 수단 등록
    ├─ [Korbit 거래소] 선택 ✓
    └─ [다음] → Korbit 앱으로 이동
          │
          ▼
    ┌─ Korbit 앱 (시뮬레이션) ─────────┐
    │ ① 연동 Guide                     │
    │ ② 계좌 정보 확인 (email, 등급)     │
    │ ③ 이용 동의 (API/데이터/매도 권한)  │
    │ ④ 인증 코드 확인 (6자리)           │
    │ ⑤ 비밀번호 + 2FA OTP 입력         │
    │ ⑥ 인증 완료 ✓                    │
    └──────────────────────────────────┘
          │
          ▼
    "Korbit Connected!" → completeKyc() ✓
          │
          ▼
Step 3. 이용약관 동의 → Step 4. PIN 설정
          │
          ▼
    🏠 Home (0 KRW 잔액)
    ├─ 충전: 은행계좌 / Korbit / Direct Transfer Crypto
    ├─ 결제: QR 결제
    └─ ATM: 현금 출금

    KYC 상태: ✅ KYC 인증 완료
    사용자 유형: 내국인
    충전 한도: 2,000,000 KRW
```

---

## Case 3: 외국인 + 여권 인증 (Foreigner + Passport KYC)

> 한국 은행 계좌가 없는 외국인 관광객

```
Splash Screen
    │
    └─→ "새로운 사용자" 클릭
          │
          ▼
Step 1. 기본 정보 입력
    ├─ 휴대폰 인증 (OTP)
    ├─ 통신사 / 주민등록번호 / 이름 자동입력
    └─ [다음]
          │
          ▼
    "한국의 은행 계좌가 있으신가요?"
    ├─ [아니요, 없습니다] 클릭 → userType = 'foreigner'
          │
          ▼
    Minimal-KYC 시작
          │
          ▼
    여권 촬영 (Passport Scan)
    ├─ 카메라 뷰파인더 + 여권 SVG 샘플
    ├─ [촬영하기] → 스캐닝 애니메이션
    └─ OCR 인식 완료 ✓
          │
          ▼
    여권 정보 확인
    ├─ 성 (SMITH) / 이름 (JOHN)
    ├─ 생년월일 / 여권번호
    ├─ 국적 (자동 인식, 변경 불가)
    └─ [다음]
          │
          ▼
    안면 인식 (Face Recognition)
    ├─ 타원형 가이드 + 얼굴 SVG
    ├─ Face Matching + Liveness Detection
    ├─ 매칭 스코어: 97% ✓
    └─ 인식 완료
          │
          ▼
    HiKorea 조회 대기
    ├─ 여권 정보 인식 ✓
    ├─ 안면 인식 완료 ✓
    ├─ 체류 자격 조회 중... → 완료 ✓
    └─ [Demo: 실패 시뮬레이션 버튼]
          │
          ▼
    인증 완료 (Verification Complete)
    ├─ 충전 한도: 1,000,000 KRW
    ├─ 인증 등급: Minimal-KYC
    └─ completeKyc() ✓
          │
          ▼
Step 2. 이용약관 동의 → Step 3. PIN 설정
          │
          ▼
    🏠 Home (0 KRW 잔액)
    ├─ 충전: Direct Transfer Crypto만 표시
    ├─ 결제: QR 결제
    └─ ATM: 현금 출금

    ⛔ 은행계좌 / Korbit: 표시되지 않음
    ⛔ 설정 > 계좌관리: 표시되지 않음

    KYC 상태: ✅ KYC 인증 완료
    사용자 유형: 외국인
    충전 한도: 1,000,000 KRW
```

---

## Case 4: 기존 사용자 (Existing User — Demo)

> 이미 가입된 사용자 (데모 데이터 로드)

```
Splash Screen
    │
    └─→ "기존 사용자" 클릭
          │
          ▼
    Demo 데이터 자동 로드:
    ├─ 이름: 홍길동
    ├─ 잔액: 150,000 KRW
    ├─ 유형: 내국인 (domestic)
    ├─ KYC: 인증 완료
    ├─ Korbit: 연결됨
    ├─ 은행: 신한은행 110-345-678901
    ├─ 코인: USDC, ETH, BTC
    └─ 거래내역: 6건
          │
          ▼
    🏠 Home (150,000 KRW)
    ├─ 충전/결제/ATM 모두 활성화
    └─ 이용내역, 알림 데이터 포함
```

---

## 충전 Journey: Direct Transfer Crypto (전체 사용자)

> 외부 지갑에서 USDT/USDC를 전송하여 비플머니 충전

```
Home → [충전] → Charge Hub
    │
    └─→ [Direct Transfer Crypto] 선택
          │
          ▼
    안내 (Guide) — 5단계 설명
    ├─ ① 받는 주소 생성 요청
    ├─ ② 가상자산 앱 실행
    ├─ ③ 받는 주소 복사 후 Transfer
    ├─ ④ 입금 확인 대기
    ├─ ⑤ 완료
    ├─ [다음부터 건너뛰기] 체크박스
    └─ [다음]
          │
          ▼
Step ①: 코인 + 네트워크 선택
    ├─ 코인: USDT / USDC
    ├─ 네트워크: ERC-20 / TRC-20 / Solana
    └─ [받는 주소 생성]
          │
          ▼
Step ②: 외부 앱 실행 안내
    ├─ 선택한 코인/네트워크/주소 요약
    └─ [다음]
          │
          ▼
Step ③: 주소 복사 후 Transfer
    ├─ QR 코드 표시
    ├─ 지갑 주소 + [복사] 버튼
    ├─ 30분 유효 타이머
    ├─ [Tap Copy ↓] 힌트
    │
    │   복사 클릭 시 ↓
    │   ┌─ MetaMask 전송 시뮬레이션 ─────┐
    │   │ ① Send (계정 표시)              │
    │   │ ② To (주소 자동입력)             │
    │   │ ③ Amount (코인 + 금액)           │
    │   │ ④ Review (수수료 + 확인)          │
    │   │ ⑤ Transaction Sent ✓           │
    │   └──────────────────────────────┘
    │
    └─ [입금 상태 확인] 활성화
          │
          ▼
Step ④: 입금 확인 대기
    ├─ 원형 프로그레스 (0/30 confirmations)
    └─ 자동 완료
          │
          ▼
Step ⑤: 완료
    ├─ 충전 금액 표시 (환율 적용, 1% 수수료 차감)
    ├─ chargeBippleMoney() 호출 → 잔액 + 거래내역 업데이트
    └─ [확인 (홈으로)] / [이용내역 보기]
```

---

## 충전 Journey: Korbit 매도 충전 (내국인 전용)

> Korbit 거래소에서 코인 매도 후 KRW 충전

```
Home → [충전] → Charge Hub
    │
    └─→ [Korbit] 선택
          │
          ▼
    (최초 미연결 시)
    Korbit 연결 안내 → Korbit 앱 인증 (6단계)
    → "Korbit Connected!" → [다음]
          │
          ▼
    (연결 완료 후)
    자산 선택 (Korbit API 조회)
    ├─ BTC (0.042 BTC)
    ├─ ETH (1.52 ETH)
    ├─ XRP (5000 XRP)
    └─ 수량 입력 + 예상 충전액
          │
          ▼
    매도 확인
    ├─ 매도 자산 / 수량 / 예상 시장가 / 예상 충전 금액
    └─ [매도 및 충전하기]
          │
          ▼
    처리 중 (타임라인)
    ├─ ① 매도 주문 접수
    ├─ ② 시장가 체결
    ├─ ③ KRW 정산 (펌뱅킹)
    ├─ ④ 비플머니 잔액 반영
    └─ chargeBippleMoney() 호출
          │
          ▼
    충전 완료 → Home
```

---

## 결제 Journey (전체 사용자)

> QR 코드 스캔으로 가맹점 결제

```
Home → [결제]
    │
    ▼
PIN 인증 (6자리)
    ├─ 5회 실패 → 5분 잠금
    ├─ PIN 미설정 → PIN 설정 페이지로 이동
    │
    ▼
QR 스캔
    ├─ 카메라 권한 요청 팝업
    ├─ QR 인식 시뮬레이션
    │
    ▼
결제 확인
    ├─ 가맹점명 + 금액
    ├─ 현재 잔액 / 결제 후 잔액
    ├─ 잔액 부족 시 에러 토스트
    │
    ▼
결제 완료
    ├─ payBippleMoney() → 잔액 차감 + 거래 기록
    ├─ 승인번호 / 결제일시 / 잔액
    └─ [확인 (홈으로)] / [전자영수증 보기]
```

---

## ATM 출금 Journey (전체 사용자)

> NICE ATM에서 QR 코드로 현금 출금

```
Home → [ATM 출금]
    │
    ▼
ATM QR 스캔
    ├─ 카메라 권한 요청
    ├─ ATM 화면 QR 인식
    │
    ▼
출금 금액 입력
    ├─ 1만원 단위
    ├─ 최소: 10,000 KRW
    ├─ 최대: 300,000 KRW (1일 한도)
    ├─ 잔액 초과 체크 (수수료 1,300원 포함)
    │
    ▼
출금 정보 확인
    ├─ 출금 금액 / 수수료 (1,300원) / 최종 차감 금액
    │
    ▼
PIN 인증 → 처리 중 (ATM 통신)
    │
    ▼
출금 완료
    ├─ withdrawAtm() → 잔액 차감 + 출금 거래 + 수수료 거래 기록
    ├─ 출금 금액 / 수수료 / 출금 후 잔액
    └─ [확인 (홈으로)]
```

---

## 기능 접근 권한 요약

| 기능 | 내국인 (은행) | 내국인 (Korbit) | 외국인 (여권) |
|---|---|---|---|
| 충전: 은행계좌 | ✅ | ✅ | ❌ |
| 충전: Korbit | ✅ | ✅ | ❌ |
| 충전: Direct Transfer Crypto | ✅ | ✅ | ✅ |
| QR 결제 | ✅ | ✅ | ✅ |
| ATM 출금 | ✅ | ✅ | ✅ |
| 설정: 계좌 관리 | ✅ | ✅ | ❌ |
| KYC 상태 | 인증 완료 | 인증 완료 | 인증 완료 |
| 충전 한도 | 2,000,000 KRW | 2,000,000 KRW | 1,000,000 KRW |

---

## Step Indicator 차이

| 사용자 유형 | Step Bar |
|---|---|
| **내국인** | ① 기본 정보 → ② 은행 등록 → ③ 약관 동의 → ④ PIN |
| **외국인** | ① 기본 정보 → ② 약관 동의 → ③ PIN |

---

*이 문서는 Beple Wallet UI 프로토타입의 사용자 여정을 정리한 것입니다. 실제 백엔드 연동 시 API 호출 포인트와 상태 전이가 추가됩니다.*
