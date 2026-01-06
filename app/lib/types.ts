export type PopGroup = "Asian" | "Japan" | "NEA" | "SEA" | "UBC" | "US";

export type Classifier = "lda" | "logit" | "rf";
export type GroupCount = "two" | "more2";
export type Stepwise = "none" | "forward" | "backward";

export type IsotopeInputs = {
  collagen: { col13c: string; col15n: string; col34s: string };
  apatite: { a13c: string; a18o: string };
  enamel: { e13c: string; e18o: string };
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