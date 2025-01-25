import { DetectTestFiles } from '../../../domain/usecases';
import { DetectCSharpXUnitTestFilesService, DetectJavaJUnitTestFilesService, DetectPythonUnittestTestFilesService } from '../../../services';

export function makeDetectCSharpXUnitTestFilesService(): DetectTestFiles {
  return new DetectCSharpXUnitTestFilesService();
}

export function makeDetectJavaJUnitTestFilesService(): DetectTestFiles {
  return new DetectJavaJUnitTestFilesService();
}

export function makeDetectPythonUnittestTestFilesService(): DetectTestFiles {
  return new DetectPythonUnittestTestFilesService();
}
