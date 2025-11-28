# Ghost Parts - SVG 기반 컴포넌트 시스템

이 시스템은 SVG 파일을 폴더에 추가하기만 하면 자동으로 React 컴포넌트로 변환하여 사용할 수 있도록 합니다.

## 새로운 SVG 추가 방법

### 1단계: SVG 파일 생성

`public/ghost-parts/{카테고리}/` 폴더에 SVG 파일을 추가합니다.

예시:
```
public/ghost-parts/eyes/round-eyes.svg
public/ghost-parts/eyes/happy-eyes.svg
```

**SVG 파일 규칙:**
- 파일명은 kebab-case 사용 (예: `round-eyes.svg`, `witch-hat.svg`)
- viewBox는 `0 0 1024 1024` 사용
- 파일명이 자동으로 라벨로 변환됩니다 (예: `round-eyes` → "Round Eyes")

### 2단계: 카테고리 index.ts 업데이트

해당 카테고리의 `index.ts` 파일에서 SVG 파일명을 배열에 추가합니다.

```typescript
// components/GhostParts/Eyes/index.ts
import { createSvgRegistryFromFiles } from '@/lib/svgLoader';

const svgFiles = [
  'round-eyes.svg',
  'happy-eyes.svg',
  'new-eyes.svg',  // 새로운 파일 추가!
];

export const registry = createSvgRegistryFromFiles('eyes', svgFiles);
```

### 3단계: 완료!

이제 새로운 옵션이 자동으로 UI에 나타나고 사용할 수 있습니다.

## 카테고리 구조

```
public/ghost-parts/
├── eyes/           # 눈 SVG 파일들
├── mouths/         # 입 SVG 파일들
├── eyebrows/       # 눈썹 SVG 파일들
├── bodies/         # 몸체 SVG 파일들
├── hats/           # 모자 SVG 파일들
├── handItems/      # 손에 드는 아이템 SVG 파일들
└── backgrounds/    # 배경 SVG 파일들

components/GhostParts/
├── Eyes/
│   └── index.ts    # SVG 파일 목록만 관리
├── Mouths/
│   └── index.ts
└── ...
```

## SVG 작성 가이드

### 좌표 시스템
- viewBox: `0 0 1024 1024`
- 중심점: (512, 512)
- 머리 영역: Y 200-500
- 몸체 영역: Y 400-900
- 왼손 위치: X ~300, Y ~600
- 오른손 위치: X ~724, Y ~600

### 예시 SVG

```xml
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- 왼쪽 눈 -->
  <circle cx="380" cy="420" r="35" fill="#000000" />
  
  <!-- 오른쪽 눈 -->
  <circle cx="644" cy="420" r="35" fill="#000000" />
</svg>
```

## 장점

✅ **간단함**: React 컴포넌트를 작성할 필요 없음  
✅ **빠름**: SVG 파일만 추가하면 즉시 사용 가능  
✅ **유지보수**: 파일 목록만 관리하면 됨  
✅ **확장성**: 새로운 카테고리도 같은 패턴으로 추가 가능
