export type PopGroup = "Asian" | "Japan" | "NEA" | "SEA" | "UBC" | "US";

export type Classifier = "lda" | "logit" | "rf";
export type GroupCount = "two" | "more2";
export type Stepwise = "none" | "forward" | "backward";

export type IsotopeInputs = {
  collagen: { col13c: number; col15n: number; col34s: number };
  apatite: { a13c: number; a18o: number };
  enamel: { e13c: number; e18o: number };
};

export type EvaluateRequest = {
  caseNumber: string;
  analystName: string;
  elementSampled: string;

  referenceSample: "modern";
  numberOfGroups: GroupCount;
  classifier: Classifier;
  stepwise: Stepwise;
  populations: PopGroup[];

  isotopes: IsotopeInputs;
};

export type PosteriorRow = {
  group: PopGroup;
  posterior: number;     // 0..1
  chi2Typicality: number; // 0..1
  distance: number;      // >=0
};

export type EvaluateResponse = {
  ok: true;
  model: {
    referenceSample: string;
    classifier: string;
    stepwise: string;
  };
  rows: PosteriorRow[];
};