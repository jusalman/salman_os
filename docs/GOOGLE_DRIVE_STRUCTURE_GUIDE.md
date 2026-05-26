# SALMAN OS Google Drive Structure Guide

## 문서 목적

이 문서는 SALMAN OS에서 사용할 Google Drive 폴더 구조를 정리한 가이드다.

SALMAN OS 기준은 **SA/DA 중심 퍼포먼스 마케팅 운영 회사**다.

- SA: Search Ads, 검색광고
- DA: Display Ads, 디스플레이 광고

이 문서의 목적은 단순한 파일 정리가 아니다.

- 고객사별 SA/DA 운영 자료를 섞이지 않게 관리한다.
- 광고 원본 시트, 캠페인 구조, 키워드, 소재, 랜딩, 전환추적, 보고서를 찾기 쉽게 만든다.
- 나중에 Google Drive API로 필요한 파일을 정확히 찾을 수 있게 한다.
- 나중에 AI/RAG 챗봇이 읽어도 되는 자료와 읽으면 안 되는 자료를 구분할 수 있게 한다.

중요한 범위 기준:

- SALMAN OS v1에서는 AI/RAG, OpenAI API, Google Drive API 자동화, Google Sheets API 자동화를 실행하지 않는다.
- 이 문서는 향후 자동화를 대비한 Google Drive 구조 설계 문서다.
- Google Drive는 원본 파일 저장소다.
- Supabase는 SALMAN OS의 운영 데이터 기준 저장소다.

## 읽는 방법

폴더명은 영어로 만든다. 괄호 안 한국어는 이해를 돕기 위한 설명이다.

예시:

```text
04_SA_Operations (검색광고 운영)
```

실제 Google Drive에 만들 폴더명:

```text
04_SA_Operations
```

괄호 안 설명은 폴더명에 넣지 않는다.

## 기본 규칙

- 폴더 앞에 번호를 붙여 정렬 순서를 고정한다.
- 고객사 폴더는 `C001_ClientName`처럼 고객사 코드부터 적는다.
- 모든 고객사는 같은 폴더 구조를 사용한다.
- SA와 DA 자료를 같은 폴더에 섞지 않는다.
- 광고 원본 데이터와 사람이 정리한 보고서를 섞지 않는다.
- 임시 분류 폴더는 `90_`으로 시작한다.
- 보관 또는 AI 읽기 금지 폴더는 `99_`로 시작한다.
- 삭제하지 말고 `99_Archive`로 이동한다.

파일명 기본 규칙:

```text
[CLIENT_ID]_[CHANNEL]_[DOC_TYPE]_[SUBJECT]_[YYYY-MM-DD]_[STATUS]_v01
```

파일명 예시:

```text
C001_SA_NAVER_RAW_DAILY_2026-05-22_FINAL_v01
C001_SA_NAVER_KEYWORD_MASTER_2026-05-22_LIVE_v03
C001_DA_META_CREATIVE_TEST_2026-05-22_REVIEW_v02
C001_DA_NAVER_GFA_REPORT_2026-05_FINAL_v01
C001_TRACKING_GTM_CONVERSION_MAP_2026-05-22_LIVE_v01
C001_REPORT_MONTHLY_PERFORMANCE_2026-05_FINAL_v01
C001_MEETING_WEEKLY_SYNC_2026-05-22_APPROVED_v01
```

상태값은 아래 값만 사용한다.

```text
DRAFT
REVIEW
APPROVED
LIVE
FINAL
ARCHIVED
```

---

## 전체 대분류 구조

SA/DA 회사 기준으로 대분류는 아래 구조를 권장한다.

```text
SALMAN_OS_DRIVE/ (전체 드라이브 루트)
|
|-- 00_Governance_Index (전체 기준과 규칙)
|-- 01_Client_Operations (고객사별 운영 자료)
|-- 02_Sales_Onboarding (영업과 신규 고객 온보딩)
|-- 03_Strategy_Research (전략과 리서치)
|-- 04_SA_Operations (검색광고 운영)
|-- 05_DA_Operations (디스플레이 광고 운영)
|-- 06_Creative_Assets (소재와 크리에이티브 자산)
|-- 07_Landing_Tracking (랜딩페이지와 전환추적)
|-- 08_Reports_Insights (보고서와 인사이트)
|-- 09_Internal_Knowledge (내부 지식과 매뉴얼)
|-- 10_Templates_Library (반복 사용 템플릿)
|-- 11_AI_Automation_Data (AI 자동화 준비 자료)
|-- 12_Admin_Finance_Legal (행정/정산/법무 자료)
|-- 13_People_Training (사람/교육/채용)
|-- 14_Tools_Security (툴/계정/보안)
|-- 90_Inbox (임시 수집함)
+-- 99_Archive (보관함)
```

대분류 설명:

- `00_Governance_Index`: 전체 기준표, 고객사 목록, 폴더 위치표, 파일명 규칙, AI 색인 기준.
- `01_Client_Operations`: 고객사별 실제 운영 자료. 가장 중요한 폴더다.
- `02_Sales_Onboarding`: 영업, 제안, 신규 고객 온보딩 자료.
- `03_Strategy_Research`: 업종, 경쟁사, 타겟, 오퍼, 채널 전략 자료.
- `04_SA_Operations`: 검색광고 공통 운영 기준, 키워드, 검색어, 입찰, 캠페인 구조 자료.
- `05_DA_Operations`: 디스플레이 광고 공통 운영 기준, 소재, 타겟, 지면, 빈도, 테스트 자료.
- `06_Creative_Assets`: 배너, 이미지, 영상, 디자인 원본, 소재 라이선스 자료.
- `07_Landing_Tracking`: 랜딩페이지, GA4, GTM, 픽셀, 전환추적, UTM 자료.
- `08_Reports_Insights`: 보고서, 성과 분석, 인사이트, 리뷰 자료.
- `09_Internal_Knowledge`: 회사 내부 SOP, 운영 매뉴얼, 채널별 노하우.
- `10_Templates_Library`: 보고서, 제안서, 체크리스트, 광고 운영 템플릿.
- `11_AI_Automation_Data`: 향후 AI/RAG 자동화용 정리 자료.
- `12_Admin_Finance_Legal`: 회사 행정, 정산, 세금, 법무 자료.
- `13_People_Training`: 채용, 온보딩, 역할별 교육, 평가 자료.
- `14_Tools_Security`: 협업툴, 광고계정, 권한, 보안 기준, 자동화 도구 자료.
- `90_Inbox`: 아직 분류하지 않은 임시 자료.
- `99_Archive`: 더 이상 사용하지 않지만 삭제하지 않을 보관 자료.

---

## 00_Governance_Index

역할: 회사 전체 Drive 사용 규칙을 정리하는 기준 폴더다.

```text
00_Governance_Index/ (전체 기준과 규칙)
|
|-- 01_Client_List (고객사 목록)
|  |-- 01_All_Clients (전체 고객사)
|  |-- 02_Active_Clients (진행중 고객사)
|  |-- 03_Paused_Clients (중단 고객사)
|  |-- 04_Closed_Clients (종료 고객사)
|  +-- 05_Client_Code_Rules (고객사 코드 규칙)
|
|-- 02_Folder_Link_Map (폴더와 시트 링크 지도)
|  |-- 01_Client_Folder_Links (고객사 폴더 링크)
|  |-- 02_SA_Sheet_Links (SA 시트 링크)
|  |-- 03_DA_Sheet_Links (DA 시트 링크)
|  |-- 04_Report_Folder_Links (보고서 폴더 링크)
|  |-- 05_AI_Context_Folder_Links (AI 자료 폴더 링크)
|  +-- 06_Common_Folder_Links (공통 폴더 링크)
|
|-- 03_Naming_Rules (파일명/폴더명 규칙)
|  |-- 01_File_Naming_Rules (파일명 규칙)
|  |-- 02_Folder_Naming_Rules (폴더명 규칙)
|  |-- 03_Client_Code_Rules (고객사 코드 규칙)
|  |-- 04_Channel_Code_Rules (채널 코드 규칙)
|  |-- 05_Date_Status_Version_Rules (날짜/상태/버전 규칙)
|  +-- 06_Bad_Naming_Examples (잘못된 이름 예시)
|
|-- 04_Document_Category_Rules (자료 분류 기준)
|  |-- 01_Admin_Legal_Documents (행정/계약 문서)
|  |-- 02_SA_Operation_Documents (SA 운영 문서)
|  |-- 03_DA_Operation_Documents (DA 운영 문서)
|  |-- 04_Creative_Documents (소재 문서)
|  |-- 05_Landing_Tracking_Documents (랜딩/추적 문서)
|  |-- 06_Report_Documents (보고서 문서)
|  +-- 07_Communication_Documents (커뮤니케이션 문서)
|
|-- 05_Permission_Sharing_Rules (권한과 공유 기준)
|  |-- 01_Internal_Sharing_Rules (내부 공유 기준)
|  |-- 02_Client_Shareable_Materials (고객사 공유 가능 자료)
|  |-- 03_External_Sharing_Forbidden (외부 공유 금지 자료)
|  |-- 04_Sensitive_Data_Rules (민감자료 기준)
|  +-- 05_Sharing_Review_Logs (공유 검토 기록)
|
|-- 06_AI_Indexing_Rules (AI 색인 기준)
|  |-- 01_AI_Read_OK_Rules (AI 읽기 허용 기준)
|  |-- 02_AI_Do_Not_Index_Rules (AI 읽기 금지 기준)
|  |-- 03_AI_Answer_Source_Rules (AI 답변 기준 자료 규칙)
|  |-- 04_Human_Review_Required_Rules (사람 검토 필요 기준)
|  +-- 05_RAG_Source_Registration_Rules (RAG 자료 등록 기준)
|
+-- 99_Archive (보관함)
```

처음에는 아래 3개만 먼저 만들어도 된다.

```text
00_Governance_Index/ (전체 기준과 규칙)
|-- 01_Client_List (고객사 목록)
|-- 02_Folder_Link_Map (폴더와 시트 링크 지도)
+-- 03_Naming_Rules (파일명/폴더명 규칙)
```

---

## 01_Client_Operations

역할: 고객사별 모든 실제 운영 자료를 넣는 폴더다.

```text
01_Client_Operations/ (고객사별 운영 자료)
|
|-- C001_ClientName (고객사 폴더 예시)
|  |-- 00_Client_Index (고객사 기준 정보)
|  |-- 01_Admin_Legal (계약/정산/행정)
|  |-- 02_Strategy_Research (전략과 리서치)
|  |-- 03_SA_Operations (검색광고 운영)
|  |-- 04_DA_Operations (디스플레이 광고 운영)
|  |-- 05_Creative_Assets (소재와 크리에이티브 자산)
|  |-- 06_Landing_Tracking (랜딩페이지와 전환추적)
|  |-- 07_Reports_Insights (보고서와 인사이트)
|  |-- 08_Communication_Approvals (커뮤니케이션/승인)
|  |-- 09_AI_RAG_Context (AI/RAG 정리본)
|  +-- 99_Archive (보관함)
|
|-- C002_ClientName (고객사 폴더 예시)
|  +-- C001과 동일한 구조
|
+-- C003_ClientName (고객사 폴더 예시)
   +-- C001과 동일한 구조
```

고객사 폴더 템플릿:

```text
C001_ClientName/ (고객사 폴더 예시)
|
|-- 00_Client_Index (고객사 기준 정보)
|  |-- 01_Client_Profile (고객사 기본정보)
|  |-- 02_Key_Links (핵심 링크)
|  |-- 03_Account_Access_Index (계정 권한 현황)
|  |-- 04_Service_Scope (서비스 범위)
|  |-- 05_Source_Of_Truth_Index (최종 기준 자료 목록)
|  +-- 06_Client_Request_Log (고객 요청 기록)
|
|-- 01_Admin_Legal (계약/정산/행정)
|  |-- 01_Contracts (계약서)
|  |-- 02_Estimates_Invoices (견적서/청구서)
|  |-- 03_Business_Documents (사업자/행정 문서)
|  |-- 04_Billing_Tax (청구/세금 자료)
|  +-- 99_Archive (보관함)
|
|-- 02_Strategy_Research (전략과 리서치)
|  |-- 01_Brand_Product (브랜드/상품 정보)
|  |-- 02_Target_Persona (타겟 페르소나)
|  |-- 03_Competitor_Research (경쟁사 리서치)
|  |-- 04_Offer_Message (오퍼와 메시지)
|  |-- 05_Channel_Strategy (채널 전략)
|  +-- 99_Archive (보관함)
|
|-- 03_SA_Operations (검색광고 운영)
|  |-- 00_SA_Index (SA 운영 기준 목록)
|  |-- 01_Naver_Search (네이버 검색광고)
|  |-- 02_Google_Search (구글 검색광고)
|  |-- 03_Keyword_SearchTerm (키워드/검색어)
|  |-- 04_Campaign_Adgroup_Structure (캠페인/광고그룹 구조)
|  |-- 05_Budget_Bidding (예산/입찰)
|  |-- 06_Conversion_Performance (전환 성과)
|  |-- 07_Exports_Raw (원본 export 파일)
|  +-- 99_Archive (보관함)
|
|-- 04_DA_Operations (디스플레이 광고 운영)
|  |-- 00_DA_Index (DA 운영 기준 목록)
|  |-- 01_Naver_GFA (네이버 GFA/성과형 DA)
|  |-- 02_Meta (메타 광고)
|  |-- 03_Google_Display (구글 디스플레이)
|  |-- 04_Kakao_Display (카카오 디스플레이)
|  |-- 05_Audience_Targeting (타겟팅)
|  |-- 06_Placement_Inventory (지면/인벤토리)
|  |-- 07_Creative_Testing (소재 테스트)
|  |-- 08_Exports_Raw (원본 export 파일)
|  +-- 99_Archive (보관함)
|
|-- 05_Creative_Assets (소재와 크리에이티브 자산)
|  |-- 01_Brief (제작 브리프)
|  |-- 02_Copy (광고 카피)
|  |-- 03_Static_Banners (정적 배너)
|  |-- 04_Video (영상 소재)
|  |-- 05_Design_Source (디자인 원본)
|  |-- 06_Final_Delivery (최종 납품본)
|  +-- 99_Archive (보관함)
|
|-- 06_Landing_Tracking (랜딩페이지와 전환추적)
|  |-- 01_Landing_Page (랜딩페이지)
|  |-- 02_GA4_GTM (GA4/GTM)
|  |-- 03_Pixels_Conversions (픽셀/전환추적)
|  |-- 04_UTM_Rules (UTM 규칙)
|  |-- 05_Tracking_QA (추적 검수)
|  +-- 99_Archive (보관함)
|
|-- 07_Reports_Insights (보고서와 인사이트)
|  |-- 01_Weekly_Report (주간 보고서)
|  |-- 02_Monthly_Report (월간 보고서)
|  |-- 03_SA_Analysis (SA 성과 분석)
|  |-- 04_DA_Analysis (DA 성과 분석)
|  |-- 05_Cross_Channel_Analysis (통합 채널 분석)
|  |-- 06_Client_Delivery (고객 전달본)
|  +-- 99_Archive (보관함)
|
|-- 08_Communication_Approvals (커뮤니케이션/승인)
|  |-- 01_Meeting_Notes (회의록)
|  |-- 02_Client_Requests (고객 요청)
|  |-- 03_Approvals (승인 기록)
|  |-- 04_Email_Kakao_Summary (이메일/카카오톡 요약)
|  |-- 05_Internal_Handoff (내부 인수인계)
|  +-- 99_Archive (보관함)
|
|-- 09_AI_RAG_Context (AI/RAG 정리본)
|  |-- 01_Read_OK (AI 읽기 허용 자료)
|  |-- 02_Approved_Facts (확정 사실)
|  |-- 03_Client_FAQ (고객사 FAQ)
|  |-- 04_Source_Of_Truth (최종 기준 자료)
|  |-- 05_Monthly_Summaries (월별 요약본)
|  |-- 90_Need_Human_Review (사람 검토 필요)
|  +-- 99_Do_Not_Index (AI 읽기 금지)
|
+-- 99_Archive (보관함)
```

고객사별 SA 원본 시트 탭 이름 추천:

```text
daily_sa_raw
daily_conversion_sa_raw
weekly_keyword_sa_raw
campaign_master
adgroup_master
keyword_master
search_term_raw
budget_history
bid_change_log
conversion_events
memo
```

고객사별 DA 원본 시트 탭 이름 추천:

```text
daily_da_raw
daily_creative_raw
campaign_master
adgroup_master
creative_master
audience_master
placement_raw
budget_history
creative_test_log
conversion_events
memo
```

---

## 02_Sales_Onboarding

```text
02_Sales_Onboarding/ (영업과 신규 고객 온보딩)
|
|-- 01_Lead_Prospects (잠재 고객)
|  |-- 01_Inbound_Leads (인바운드 리드)
|  |-- 02_Outbound_Leads (아웃바운드 리드)
|  |-- 03_Lead_Research (리드 조사)
|  |-- 04_First_Meeting_Notes (첫 미팅 메모)
|  +-- 99_Archive (보관함)
|
|-- 02_Proposals_Estimates (제안서/견적서)
|  |-- 01_Proposal_Drafts (제안서 초안)
|  |-- 02_Final_Proposals (최종 제안서)
|  |-- 03_Estimates (견적서)
|  |-- 04_Pricing_References (가격 참고자료)
|  +-- 99_Archive (보관함)
|
|-- 03_Service_Introduction (서비스 소개 자료)
|  |-- 01_Company_Deck (회사소개서)
|  |-- 02_SA_Service_Intro (SA 서비스 소개)
|  |-- 03_DA_Service_Intro (DA 서비스 소개)
|  |-- 04_Case_Studies_Public (외부 공유 가능 사례)
|  +-- 99_Archive (보관함)
|
|-- 04_Client_Onboarding (고객 온보딩)
|  |-- 01_Onboarding_Checklist (온보딩 체크리스트)
|  |-- 02_Account_Access_Request (계정 권한 요청)
|  |-- 03_Tracking_Setup_Request (추적 세팅 요청)
|  |-- 04_Kickoff_Materials (킥오프 자료)
|  +-- 99_Archive (보관함)
|
|-- 05_Sales_Tracking (영업 진행 관리)
|  |-- 01_Pipeline (영업 파이프라인)
|  |-- 02_Call_Notes (통화 메모)
|  |-- 03_Follow_Up (후속 연락)
|  |-- 04_Lost_Reasons (실패 사유)
|  +-- 99_Archive (보관함)
|
+-- 99_Archive (보관함)
```

---

## 03_Strategy_Research

```text
03_Strategy_Research/ (전략과 리서치)
|
|-- 01_Market_Research (시장 리서치)
|  |-- 01_Industry_Reports (업종 리포트)
|  |-- 02_Trend_Notes (트렌드 메모)
|  |-- 03_Seasonality (시즌성 자료)
|  |-- 04_Source_Data (원본 데이터)
|  +-- 99_Archive (보관함)
|
|-- 02_Competitor_Research (경쟁사 리서치)
|  |-- 01_Competitor_List (경쟁사 목록)
|  |-- 02_SA_Ad_Examples (SA 광고 예시)
|  |-- 03_DA_Creative_Examples (DA 소재 예시)
|  |-- 04_Landing_Examples (랜딩 예시)
|  |-- 05_Offer_Examples (오퍼 예시)
|  +-- 99_Archive (보관함)
|
|-- 03_Audience_Persona (타겟/페르소나)
|  |-- 01_Target_Persona (타겟 페르소나)
|  |-- 02_Customer_Journey (고객 여정)
|  |-- 03_Pain_Points (고객 문제점)
|  |-- 04_Message_Angles (메시지 각도)
|  +-- 99_Archive (보관함)
|
|-- 04_Offer_Product_Research (오퍼/상품 리서치)
|  |-- 01_Product_Notes (상품 메모)
|  |-- 02_Offer_Map (오퍼 맵)
|  |-- 03_Pricing_Research (가격 리서치)
|  |-- 04_Review_Research (리뷰 리서치)
|  +-- 99_Archive (보관함)
|
|-- 05_Channel_Strategy (채널 전략)
|  |-- 01_SA_Strategy (SA 전략)
|  |-- 02_DA_Strategy (DA 전략)
|  |-- 03_Cross_Channel_Strategy (통합 채널 전략)
|  |-- 04_Budget_Mix_Strategy (예산 배분 전략)
|  +-- 99_Archive (보관함)
|
|-- 06_Benchmark_Cases (벤치마크 사례)
|  |-- 01_Good_Examples (좋은 예시)
|  |-- 02_Bad_Examples (나쁜 예시)
|  |-- 03_Internal_Case_Notes (내부 사례 메모)
|  +-- 99_Archive (보관함)
|
+-- 99_Archive (보관함)
```

---

## 04_SA_Operations

회사 공통 검색광고 운영 기준을 넣는 폴더다. 고객사별 실제 SA 파일은 각 고객사 폴더의 `03_SA_Operations`에 넣는다.

```text
04_SA_Operations/ (검색광고 운영)
|
|-- 01_Naver_Search (네이버 검색광고)
|  |-- 01_Channel_Guide (채널 운영 가이드)
|  |-- 02_Campaign_Structure_Standards (캠페인 구조 기준)
|  |-- 03_Keyword_Rules (키워드 기준)
|  |-- 04_Search_Term_Rules (검색어 기준)
|  |-- 05_Budget_Bidding_Rules (예산/입찰 기준)
|  |-- 06_Report_Export_Standards (리포트 export 기준)
|  +-- 99_Archive (보관함)
|
|-- 02_Google_Search (구글 검색광고)
|  |-- 01_Channel_Guide (채널 운영 가이드)
|  |-- 02_Campaign_Structure_Standards (캠페인 구조 기준)
|  |-- 03_Keyword_Rules (키워드 기준)
|  |-- 04_Search_Term_Rules (검색어 기준)
|  |-- 05_Budget_Bidding_Rules (예산/입찰 기준)
|  |-- 06_Report_Export_Standards (리포트 export 기준)
|  +-- 99_Archive (보관함)
|
|-- 03_Keyword_Library (키워드 라이브러리)
|  |-- 01_By_Industry (업종별)
|  |-- 02_By_Objective (목적별)
|  |-- 03_Negative_Keywords (제외 키워드)
|  |-- 04_Search_Term_Learnings (검색어 학습 내용)
|  +-- 99_Archive (보관함)
|
|-- 04_SA_Metric_Definitions (SA 지표 정의)
|  |-- 01_CTR_CPC_CVR_CPA (CTR/CPC/CVR/CPA)
|  |-- 02_ROAS_Revenue (ROAS/매출)
|  |-- 03_Quality_Score (품질지수)
|  |-- 04_Conversion_Rules (전환 기준)
|  +-- 99_Archive (보관함)
|
|-- 05_SA_Audit_Checklists (SA 점검 체크리스트)
|  |-- 01_Account_Audit (계정 점검)
|  |-- 02_Keyword_Audit (키워드 점검)
|  |-- 03_Search_Term_Audit (검색어 점검)
|  |-- 04_Budget_Bid_Audit (예산/입찰 점검)
|  +-- 99_Archive (보관함)
|
|-- 06_SA_Experiment_Logs (SA 테스트 기록)
|  |-- 01_Test_Plans (테스트 계획)
|  |-- 02_Test_Results (테스트 결과)
|  |-- 03_Learning_Notes (학습 메모)
|  +-- 99_Archive (보관함)
|
+-- 99_Archive (보관함)
```

---

## 05_DA_Operations

회사 공통 디스플레이 광고 운영 기준을 넣는 폴더다. 고객사별 실제 DA 파일은 각 고객사 폴더의 `04_DA_Operations`에 넣는다.

```text
05_DA_Operations/ (디스플레이 광고 운영)
|
|-- 01_Naver_GFA (네이버 GFA/성과형 DA)
|  |-- 01_Channel_Guide (채널 운영 가이드)
|  |-- 02_Campaign_Structure_Standards (캠페인 구조 기준)
|  |-- 03_Audience_Targeting_Rules (타겟팅 기준)
|  |-- 04_Creative_Rules (소재 기준)
|  |-- 05_Report_Export_Standards (리포트 export 기준)
|  +-- 99_Archive (보관함)
|
|-- 02_Meta (메타 광고)
|  |-- 01_Channel_Guide (채널 운영 가이드)
|  |-- 02_Campaign_Structure_Standards (캠페인 구조 기준)
|  |-- 03_Audience_Targeting_Rules (타겟팅 기준)
|  |-- 04_Creative_Testing_Rules (소재 테스트 기준)
|  |-- 05_Report_Export_Standards (리포트 export 기준)
|  +-- 99_Archive (보관함)
|
|-- 03_Google_Display (구글 디스플레이)
|  |-- 01_Channel_Guide (채널 운영 가이드)
|  |-- 02_Campaign_Structure_Standards (캠페인 구조 기준)
|  |-- 03_Placement_Rules (지면 기준)
|  |-- 04_Creative_Rules (소재 기준)
|  |-- 05_Report_Export_Standards (리포트 export 기준)
|  +-- 99_Archive (보관함)
|
|-- 04_Kakao_Display (카카오 디스플레이)
|  |-- 01_Channel_Guide (채널 운영 가이드)
|  |-- 02_Campaign_Structure_Standards (캠페인 구조 기준)
|  |-- 03_Targeting_Rules (타겟팅 기준)
|  |-- 04_Creative_Rules (소재 기준)
|  +-- 99_Archive (보관함)
|
|-- 05_Audience_Targeting_Library (타겟팅 라이브러리)
|  |-- 01_By_Industry (업종별)
|  |-- 02_By_Objective (목적별)
|  |-- 03_Remarketing (리마케팅)
|  |-- 04_Lookalike (유사타겟)
|  +-- 99_Archive (보관함)
|
|-- 06_Creative_Test_Library (소재 테스트 라이브러리)
|  |-- 01_Hook_Angles (후킹 각도)
|  |-- 02_Banner_Formats (배너 포맷)
|  |-- 03_Video_Formats (영상 포맷)
|  |-- 04_Test_Results (테스트 결과)
|  +-- 99_Archive (보관함)
|
|-- 07_DA_Metric_Definitions (DA 지표 정의)
|  |-- 01_CTR_CPC_CPM (CTR/CPC/CPM)
|  |-- 02_CVR_CPA_ROAS (CVR/CPA/ROAS)
|  |-- 03_Frequency_Fatigue (빈도/소재 피로도)
|  |-- 04_Placement_Quality (지면 품질)
|  +-- 99_Archive (보관함)
|
|-- 08_DA_Audit_Checklists (DA 점검 체크리스트)
|  |-- 01_Campaign_Audit (캠페인 점검)
|  |-- 02_Audience_Audit (타겟 점검)
|  |-- 03_Creative_Audit (소재 점검)
|  |-- 04_Placement_Audit (지면 점검)
|  +-- 99_Archive (보관함)
|
+-- 99_Archive (보관함)
```

---

## 06_Creative_Assets

```text
06_Creative_Assets/ (소재와 크리에이티브 자산)
|
|-- 01_Brand_Assets (브랜드 자산)
|  |-- 01_SALMAN_Brand (SALMAN 브랜드)
|  |-- 02_Logo (로고)
|  |-- 03_Fonts (폰트)
|  |-- 04_Color_Guides (색상 가이드)
|  +-- 99_Archive (보관함)
|
|-- 02_Static_Banners (정적 배너)
|  |-- 01_Size_Guides (사이즈 가이드)
|  |-- 02_Banner_Examples (배너 예시)
|  |-- 03_Final_Exports (최종 export)
|  |-- 04_Platform_Specs (매체별 규격)
|  +-- 99_Archive (보관함)
|
|-- 03_Video_Creatives (영상 소재)
|  |-- 01_Source_Footage (영상 원본)
|  |-- 02_Editing_Project_Files (편집 프로젝트 파일)
|  |-- 03_Final_Exports (최종 export)
|  |-- 04_Subtitles (자막)
|  +-- 99_Archive (보관함)
|
|-- 04_Copy_Angles (카피 각도)
|  |-- 01_Hook_Copy (후킹 카피)
|  |-- 02_Offer_Copy (오퍼 카피)
|  |-- 03_Urgency_Copy (긴급성 카피)
|  |-- 04_Proof_Copy (신뢰 근거 카피)
|  +-- 99_Archive (보관함)
|
|-- 05_Design_Source (디자인 원본)
|  |-- 01_Figma (Figma 원본)
|  |-- 02_Photoshop (Photoshop 원본)
|  |-- 03_Illustrator (Illustrator 원본)
|  |-- 04_Canva (Canva 원본)
|  +-- 99_Archive (보관함)
|
|-- 06_Stock_License (스톡/라이선스)
|  |-- 01_Stock_Image_Licenses (스톡 이미지 라이선스)
|  |-- 02_Font_Licenses (폰트 라이선스)
|  |-- 03_Music_Licenses (음악 라이선스)
|  +-- 99_Archive (보관함)
|
+-- 99_Archive (보관함)
```

---

## 07_Landing_Tracking

```text
07_Landing_Tracking/ (랜딩페이지와 전환추적)
|
|-- 01_Landing_Pages (랜딩페이지 기준)
|  |-- 01_Landing_Page_Standards (랜딩페이지 기준)
|  |-- 02_Landing_Page_Examples (랜딩페이지 예시)
|  |-- 03_Copy_Sections (랜딩 카피 섹션)
|  |-- 04_Form_Examples (폼 예시)
|  +-- 99_Archive (보관함)
|
|-- 02_GA4_GTM (GA4/GTM)
|  |-- 01_GA4_Setup_Guide (GA4 세팅 가이드)
|  |-- 02_GTM_Setup_Guide (GTM 세팅 가이드)
|  |-- 03_Tag_Standards (태그 기준)
|  |-- 04_Event_Standards (이벤트 기준)
|  +-- 99_Archive (보관함)
|
|-- 03_Pixels_Conversions (픽셀/전환추적)
|  |-- 01_Naver_Conversion (네이버 전환추적)
|  |-- 02_Google_Conversion (구글 전환추적)
|  |-- 03_Meta_Pixel (메타 픽셀)
|  |-- 04_Kakao_Pixel (카카오 픽셀)
|  +-- 99_Archive (보관함)
|
|-- 04_UTM_Rules (UTM 규칙)
|  |-- 01_UTM_Naming_Rules (UTM 이름 규칙)
|  |-- 02_UTM_Examples (UTM 예시)
|  |-- 03_Campaign_URL_Builder (캠페인 URL 생성기준)
|  +-- 99_Archive (보관함)
|
|-- 05_Tracking_QA (추적 검수)
|  |-- 01_QA_Checklists (QA 체크리스트)
|  |-- 02_Test_Results (테스트 결과)
|  |-- 03_Issue_Logs (이슈 기록)
|  +-- 99_Archive (보관함)
|
+-- 99_Archive (보관함)
```

---

## 08_Reports_Insights

```text
08_Reports_Insights/ (보고서와 인사이트)
|
|-- 01_Weekly_Reports (주간 보고서 모음)
|  |-- 01_Report_Standards (보고서 기준)
|  |-- 02_Report_Examples (보고서 예시)
|  |-- 03_Insight_Examples (인사이트 예시)
|  +-- 99_Archive (보관함)
|
|-- 02_Monthly_Reports (월간 보고서 모음)
|  |-- 01_Report_Standards (보고서 기준)
|  |-- 02_Report_Examples (보고서 예시)
|  |-- 03_Executive_Summary_Examples (대표 요약 예시)
|  +-- 99_Archive (보관함)
|
|-- 03_SA_Analysis (SA 성과 분석)
|  |-- 01_Keyword_Analysis (키워드 분석)
|  |-- 02_Search_Term_Analysis (검색어 분석)
|  |-- 03_Budget_Bid_Analysis (예산/입찰 분석)
|  |-- 04_Conversion_Analysis (전환 분석)
|  +-- 99_Archive (보관함)
|
|-- 04_DA_Analysis (DA 성과 분석)
|  |-- 01_Creative_Analysis (소재 분석)
|  |-- 02_Audience_Analysis (타겟 분석)
|  |-- 03_Placement_Analysis (지면 분석)
|  |-- 04_Frequency_Fatigue_Analysis (빈도/피로도 분석)
|  +-- 99_Archive (보관함)
|
|-- 05_Cross_Channel_Insights (통합 채널 인사이트)
|  |-- 01_SA_DA_Comparison (SA/DA 비교)
|  |-- 02_Funnel_Insights (퍼널 인사이트)
|  |-- 03_Budget_Mix_Insights (예산 배분 인사이트)
|  |-- 04_Learning_Notes (학습 메모)
|  +-- 99_Archive (보관함)
|
+-- 99_Archive (보관함)
```

---

## 09_Internal_Knowledge

```text
09_Internal_Knowledge/ (내부 지식과 매뉴얼)
|
|-- 01_SOP_Playbooks (SOP/업무 매뉴얼)
|  |-- 01_Client_Onboarding_SOP (고객 온보딩 SOP)
|  |-- 02_SA_Operation_SOP (SA 운영 SOP)
|  |-- 03_DA_Operation_SOP (DA 운영 SOP)
|  |-- 04_Report_Creation_SOP (보고서 작성 SOP)
|  |-- 05_Creative_Production_SOP (소재 제작 SOP)
|  +-- 99_Archive (보관함)
|
|-- 02_Channel_Guides (채널별 가이드)
|  |-- 01_Naver_Search (네이버 검색광고)
|  |-- 02_Google_Search (구글 검색광고)
|  |-- 03_Naver_GFA (네이버 GFA/성과형 DA)
|  |-- 04_Meta (메타 광고)
|  |-- 05_Google_Display (구글 디스플레이)
|  |-- 06_Kakao_Display (카카오 디스플레이)
|  +-- 99_Archive (보관함)
|
|-- 03_Checklists (체크리스트)
|  |-- 01_Account_Setup_Checklists (계정 세팅 체크리스트)
|  |-- 02_SA_Launch_Checklists (SA 런칭 체크리스트)
|  |-- 03_DA_Launch_Checklists (DA 런칭 체크리스트)
|  |-- 04_Tracking_Checklists (추적 체크리스트)
|  |-- 05_Report_Checklists (보고서 체크리스트)
|  +-- 99_Archive (보관함)
|
|-- 04_Role_Guides (역할별 가이드)
|  |-- 01_Account_Manager (AE/PM)
|  |-- 02_SA_Marketer (SA 마케터)
|  |-- 03_DA_Marketer (DA 마케터)
|  |-- 04_Designer (디자이너)
|  |-- 05_Operator (운영 담당자)
|  +-- 99_Archive (보관함)
|
|-- 05_Troubleshooting (문제 해결)
|  |-- 01_SA_Issues (SA 이슈)
|  |-- 02_DA_Issues (DA 이슈)
|  |-- 03_Tracking_Issues (추적 이슈)
|  |-- 04_Report_Issues (보고서 이슈)
|  |-- 05_Client_Communication_Issues (고객 커뮤니케이션 이슈)
|  +-- 99_Archive (보관함)
|
|-- 06_Internal_FAQ (내부 FAQ)
|  |-- 01_Process_FAQ (프로세스 FAQ)
|  |-- 02_Tool_FAQ (툴 FAQ)
|  |-- 03_Client_Response_FAQ (고객 응대 FAQ)
|  +-- 99_Archive (보관함)
|
|-- 09_AI_RAG_Context (AI/RAG 정리본)
|  |-- 01_Read_OK (AI 읽기 허용 자료)
|  |-- 02_Approved_Internal_Knowledge (승인된 내부 지식)
|  |-- 90_Need_Human_Review (사람 검토 필요)
|  +-- 99_Do_Not_Index (AI 읽기 금지)
|
+-- 99_Archive (보관함)
```

---

## 10_Templates_Library

```text
10_Templates_Library/ (반복 사용 템플릿)
|
|-- 01_Report_Templates (보고서 템플릿)
|  |-- 01_Weekly_Report (주간 보고서)
|  |-- 02_Monthly_Report (월간 보고서)
|  |-- 03_SA_Report (SA 보고서)
|  |-- 04_DA_Report (DA 보고서)
|  |-- 05_Cross_Channel_Report (통합 보고서)
|  +-- 99_Archive (보관함)
|
|-- 02_Proposal_Templates (제안서 템플릿)
|  |-- 01_Service_Proposal (서비스 제안서)
|  |-- 02_SA_Proposal (SA 제안서)
|  |-- 03_DA_Proposal (DA 제안서)
|  |-- 04_SA_DA_Package_Proposal (SA/DA 패키지 제안서)
|  +-- 99_Archive (보관함)
|
|-- 03_Checklist_Templates (체크리스트 템플릿)
|  |-- 01_Client_Onboarding_Checklist (고객 온보딩 체크리스트)
|  |-- 02_SA_Launch_Checklist (SA 런칭 체크리스트)
|  |-- 03_DA_Launch_Checklist (DA 런칭 체크리스트)
|  |-- 04_Tracking_QA_Checklist (추적 QA 체크리스트)
|  |-- 05_Report_QA_Checklist (보고서 QA 체크리스트)
|  +-- 99_Archive (보관함)
|
|-- 04_Meeting_Templates (회의 템플릿)
|  |-- 01_Kickoff_Meeting (킥오프 미팅)
|  |-- 02_Weekly_Meeting (주간 미팅)
|  |-- 03_Monthly_Review (월간 리뷰)
|  |-- 04_Internal_Handoff (내부 인수인계)
|  +-- 99_Archive (보관함)
|
|-- 05_Client_Onboarding_Templates (고객 온보딩 템플릿)
|  |-- 01_Client_Profile_Template (고객사 기본정보 템플릿)
|  |-- 02_Key_Link_Template (핵심 링크 템플릿)
|  |-- 03_Account_Access_Index_Template (계정 권한 템플릿)
|  |-- 04_Source_Of_Truth_Template (최종 기준 자료 템플릿)
|  +-- 99_Archive (보관함)
|
|-- 06_SA_Operation_Templates (SA 운영 템플릿)
|  |-- 01_Campaign_Master_Template (캠페인 마스터 템플릿)
|  |-- 02_Keyword_Master_Template (키워드 마스터 템플릿)
|  |-- 03_Search_Term_Template (검색어 템플릿)
|  |-- 04_Budget_Bid_History_Template (예산/입찰 변경 템플릿)
|  +-- 99_Archive (보관함)
|
|-- 07_DA_Operation_Templates (DA 운영 템플릿)
|  |-- 01_Campaign_Master_Template (캠페인 마스터 템플릿)
|  |-- 02_Creative_Master_Template (소재 마스터 템플릿)
|  |-- 03_Audience_Master_Template (타겟 마스터 템플릿)
|  |-- 04_Creative_Test_Log_Template (소재 테스트 기록 템플릿)
|  +-- 99_Archive (보관함)
|
+-- 99_Archive (보관함)
```

---

## 11_AI_Automation_Data

역할: 향후 AI/RAG 자동화를 위한 정리 자료를 넣는 폴더다.

주의:

- 이 폴더는 v1.5 이후 준비용이다.
- SALMAN OS v1에서는 AI/RAG 자동화가 실행되지 않는다.
- 비밀번호, API 키, service account JSON, private token은 절대 넣지 않는다.

```text
11_AI_Automation_Data/ (AI 자동화 준비 자료)
|
|-- 00_AI_Readme (AI 폴더 안내)
|-- 01_RAG_Source_Registry (RAG 소스 등록부)
|-- 02_Ingestion_Queue (색인 후보 대기열)
|-- 03_Clean_Text_Summaries (정리된 텍스트 요약본)
|-- 04_Prompt_Library (프롬프트 모음)
|-- 05_Evaluation_QA (평가용 Q&A)
|-- 06_Automation_Logs (자동화 로그)
|-- 07_Human_Approval_Logs (사람 승인 기록)
|-- 90_Need_Review (검토 필요)
+-- 99_Do_Not_Index (AI 읽기 금지)
```

---

## 12_Admin_Finance_Legal

```text
12_Admin_Finance_Legal/ (행정/정산/법무 자료)
|
|-- 01_Company_Legal_Docs (회사 법무 문서)
|-- 02_Internal_Contracts (내부 계약서)
|-- 03_Billing_Tax (청구/세금 자료)
|-- 04_Accounting_Settlement (회계 정산)
|-- 05_Compliance_Risk (컴플라이언스/리스크)
|-- 06_Vendor_Admin (거래처 관리)
+-- 99_Archive (보관함)
```

---

## 13_People_Training

```text
13_People_Training/ (사람/교육/채용)
|
|-- 01_Recruiting (채용)
|-- 02_Onboarding (직원 온보딩)
|-- 03_Role_Training (역할별 교육)
|-- 04_Evaluation (평가)
|-- 05_Handbooks_Policies (사내 규칙)
|-- 06_Offboarding (퇴사/권한 회수)
+-- 99_Archive (보관함)
```

---

## 14_Tools_Security

```text
14_Tools_Security/ (툴/계정/보안)
|
|-- 01_Tool_Index (사용 툴 목록)
|-- 02_Account_Access_Rules (계정 권한 기준)
|-- 03_Security_Policies (보안 정책)
|-- 04_Automation_Tools (자동화 도구)
|-- 05_API_Credential_Rules (API/인증정보 관리 기준)
|-- 06_Incident_Logs (보안/권한 이슈 기록)
+-- 99_Archive (보관함)
```

주의:

- 실제 비밀번호, API 키, private key, service account JSON은 Drive 문서에 저장하지 않는다.
- 이 폴더에는 실제 값이 아니라 관리 기준, 권한 현황, 요청 절차만 둔다.

---

## 90_Inbox

```text
90_Inbox/ (임시 수집함)
|
|-- 01_To_Classify (분류 대기)
|-- 02_Need_Client_Mapping (고객사 매핑 필요)
|-- 03_Need_Owner_Assignment (담당자 지정 필요)
|-- 04_Need_AI_Index_Decision (AI 색인 판단 필요)
|-- 05_Need_Rename (이름 변경 필요)
+-- 99_Old_Inbox (이전 임시함)
```

운영 규칙:

- `90_Inbox`는 임시 폴더이므로 오래 방치하지 않는다.
- 정기적으로 확인해서 올바른 고객사 폴더나 회사 공통 폴더로 이동한다.
- AI가 읽으면 안 되는 자료는 `99_Do_Not_Index` 또는 적절한 민감자료 폴더로 옮긴다.

---

## 99_Archive

```text
99_Archive/ (보관함)
|
|-- 01_Client_Archive (고객사 보관)
|-- 02_SA_Archive (SA 보관)
|-- 03_DA_Archive (DA 보관)
|-- 04_Internal_Archive (내부자료 보관)
|-- 05_Template_Archive (템플릿 보관)
|-- 06_Automation_Archive (자동화자료 보관)
|-- 07_Old_Inbox_Archive (이전 임시자료 보관)
+-- 99_Long_Term_Archive (장기 보관)
```

운영 규칙:

- 삭제보다 보관을 우선한다.
- 보관할 때도 고객사 코드, 날짜, 문서 종류를 알 수 있게 정리한다.
- `99_Archive`를 아무 파일이나 던지는 쓰레기통처럼 쓰지 않는다.

---

## AI 읽기 기준

나중에 AI/RAG 챗봇을 만들 때 가장 중요한 기준이다.

AI가 읽어도 되는 자료:

- 승인된 고객사 요약본
- 최종 보고서
- 고객사 확정 정보
- SA/DA 운영 인사이트 요약본
- 회사 내부 SOP 중 공유 가능한 자료
- 기준 자료로 지정된 Source of Truth 문서

AI가 읽으면 안 되는 자료:

- 비밀번호
- API 키
- service account JSON
- private token
- 세금계산서, 결제 자료
- 민감한 계약서 원본
- 검토되지 않은 초안
- 출처가 불분명한 자료
- 고객사 공유 금지 자료

권장 위치:

```text
AI가 읽어도 되는 고객사 자료:
01_Client_Operations/C001_ClientName/09_AI_RAG_Context/01_Read_OK

고객사 확정 사실:
01_Client_Operations/C001_ClientName/09_AI_RAG_Context/02_Approved_Facts

AI 답변 기준 자료:
01_Client_Operations/C001_ClientName/09_AI_RAG_Context/04_Source_Of_Truth

AI가 읽으면 안 되는 자료:
01_Client_Operations/C001_ClientName/09_AI_RAG_Context/99_Do_Not_Index
11_AI_Automation_Data/99_Do_Not_Index
```

---

## 처음 세팅 순서

처음에는 모든 폴더를 완벽하게 채우려고 하지 말고, 아래 순서로 만든다.

1. `SALMAN_OS_DRIVE`를 만든다.
2. `00`부터 `14`, `90`, `99`까지 대분류 폴더를 만든다.
3. `00_Governance_Index` 안에 `01_Client_List`, `02_Folder_Link_Map`, `03_Naming_Rules`를 먼저 만든다.
4. `01_Client_Operations` 안에 `C001_ClientName` 고객사 폴더를 만든다.
5. 고객사 폴더 템플릿을 모든 고객사에 복사한다.
6. 고객사별로 SA 자료는 `03_SA_Operations`, DA 자료는 `04_DA_Operations`에 분리한다.
7. 아직 분류가 애매한 파일은 `90_Inbox`에 넣는다.
8. 오래된 파일은 삭제하지 말고 `99_Archive`에 넣는다.
9. AI가 읽어도 되는 정리본은 고객사별 `09_AI_RAG_Context`에 넣는다.
10. AI가 읽으면 안 되는 자료는 `99_Do_Not_Index`에 넣는다.

