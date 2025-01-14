import { DetectAssertionRouletteTestSmellService, DetectDuplicateAssertTestSmellService } from '../../../services';

export function makeDetectAssertionRouletteTestSmellService() {
  return new DetectAssertionRouletteTestSmellService();
}

export function makeDetectDuplicateAssertTestSmellService() {
  return new DetectDuplicateAssertTestSmellService();
}
