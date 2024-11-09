import _ from 'lodash';
import { TestModel } from '../../../domain/models';
import { DetectTestSmell } from '../../../domain/usecases';

export class DuplicateAssertDetectTestSmell implements DetectTestSmell {
  execute(test: TestModel): boolean {
    return _.size(test.asserts) !== _.size(_.uniqWith(test.asserts, _.isEqual));
  }
}
