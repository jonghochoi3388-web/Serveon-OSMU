# 서브온 OSMU 콘텐츠 생성기 — Vercel 배포 안내

## 폴더 구성
- `index.html` — 생성기 본체 (그대로 두면 됩니다)
- `api/claude.js` — Anthropic API 프록시 함수 (키를 서버에서만 사용)

## 배포 3단계
1. **배포**: 이 폴더를 GitHub 저장소에 올리고 Vercel에서 Import 하거나,
   Vercel CLI로 폴더에서 `vercel` 실행 (Framework Preset: **Other**).
2. **키 등록**: Vercel 프로젝트 → **Settings → Environment Variables** 에
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-...` (Anthropic Console에서 발급)
   - Environment: Production (필요 시 Preview 포함)
   저장 후 **Redeploy** 한 번 실행.
3. **확인**: 배포 주소 접속 → 상단 「🤖 AI 모드」 클릭 →
   "✅ Vercel Environment 설정 완료"가 뜨면 키 입력 없이 켜집니다.

## 동작 방식 (하이브리드)
| 실행 환경 | AI 모달 표시 | 동작 |
|---|---|---|
| Vercel + 환경변수 설정됨 | ✅ Vercel 설정 완료 | 키 입력 없이 ON (프록시 경유, 키 미노출) |
| Vercel인데 환경변수 없음 | ⚠ 환경변수 미설정 안내 | 직접 키 입력으로 폴백 가능 |
| 로컬 파일(file://) 실행 | ⚠ Vercel 환경 아님 안내 | 직접 키 입력으로 폴백 가능 |
| AI 모드 OFF | — | 템플릿 엔진만으로 전체 기능 동작 |

## 참고
- 접속자 모두가 AI 버튼을 쓸 수 있으므로, 사내 공유 시 Vercel의
  Deployment Protection(비밀번호/팀 로그인)을 켜는 것을 권장합니다.
- 과금은 Anthropic Console 사용량 기준(블로그 1편 생성 수십~수백 원 수준).
