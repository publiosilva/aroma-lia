export interface TestModel {
  name: string;
  asserts: TestAssertModel[];
  annotations?: TestAnnotationModel[];
}

export interface TestAssertModel {
  literalActual?: string;
  matcher?: string;
  literalExpected?: string;
  message?: string;
}

export interface TestAnnotationModel {
  name: string;
  value?: string;
}
