/**
 * Component Transform Configuration
 * 
 * 각 컴포넌트의 크기(scale)와 위치(translate)를 중앙에서 관리합니다.
 * 이곳에서 모든 요소들의 위치와 크기를 조정할 수 있습니다.
 */

export interface ComponentTransform {
  scale: number;
  translateX: number;
  translateY: number;
}

export interface ComponentTransformConfig {
  [category: string]: {
    [componentId: string]: ComponentTransform;
  } | ComponentTransform; // 카테고리 전체에 적용되는 기본값
}

/**
 * 컴포넌트별 transform 설정
 */
export const componentTransforms: ComponentTransformConfig = {
  // Ghost Body (기본 몸통) - 고정
  ghostBody: {
    scale: 0.54,
    translateX: 280,
    translateY: 180,
  },

  // Eyes 카테고리
  eyes: {
    scale: 1.0,
    translateX: 0,
    translateY: 0,
  },

  // Hats 카테고리  
  hats: {
    scale: 1.0,
    translateX: 0,
    translateY: 0,
  },

  // Capes 카테고리
  capes: {
    scale: 1.0,
    translateX: 0,
    translateY: 0,
  },

  // Accessories 카테고리
  accessories: {
    scale: 1.0,
    translateX: 0,
    translateY: 0,
  },

  // Backgrounds 카테고리
  backgrounds: {
    scale: 1.0,
    translateX: 0,
    translateY: 0,
  },
};

/**
 * 특정 컴포넌트의 transform 값을 가져옵니다
 */
export function getComponentTransform(
  category: string, 
  componentId?: string
): ComponentTransform {
  const categoryConfig = componentTransforms[category];
  
  if (!categoryConfig) {
    // 기본값 반환
    return { scale: 1.0, translateX: 0, translateY: 0 };
  }

  // 카테고리 전체에 적용되는 설정인 경우
  if ('scale' in categoryConfig) {
    return categoryConfig as ComponentTransform;
  }

  // 특정 컴포넌트 설정이 있는 경우
  if (componentId && categoryConfig[componentId]) {
    return categoryConfig[componentId] as ComponentTransform;
  }

  // 기본값 반환
  return { scale: 1.0, translateX: 0, translateY: 0 };
}

/**
 * Transform 값을 SVG transform 문자열로 변환합니다
 */
export function transformToString(transform: ComponentTransform): string {
  const { scale, translateX, translateY } = transform;
  
  let transformString = '';
  
  if (scale !== 1.0) {
    transformString += `scale(${scale})`;
  }
  
  if (translateX !== 0 || translateY !== 0) {
    if (transformString) transformString += ' ';
    transformString += `translate(${translateX}, ${translateY})`;
  }
  
  return transformString || undefined;
}