import { AssertionRouletteDetectTestSmellService, DuplicateAssertDetectTestSmellService } from '../../../services';

export function makeAssertionRouletteDetectTestSmellService() {
  return new AssertionRouletteDetectTestSmellService();
}

export function makeDuplicateAssertDetectTestSmellService() {
  return new DuplicateAssertDetectTestSmellService();
}
