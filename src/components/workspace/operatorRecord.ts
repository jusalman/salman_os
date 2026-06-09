const FALLBACK_OPERATOR_NAME = '작업자 미지정'

export function resolveCurrentOperatorName(operatorName: string) {
  const trimmedOperatorName = operatorName.trim()

  return trimmedOperatorName || FALLBACK_OPERATOR_NAME
}

export function createMockOperationLogNotice(actionName: string, operatorName: string) {
  return `${actionName} 기능은 현재 mock UI로만 준비되어 있습니다. 실제 저장은 아직 없고, 후속 저장 단계에서는 현재 작업자 ${resolveCurrentOperatorName(operatorName)} 이름과 함께 operation_logs에 기록됩니다.`
}
