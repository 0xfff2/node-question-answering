import {
  BaseTokenizer,
  Encoding,
  PaddingConfiguration,
  TruncationConfiguration,
  TruncationOptions
} from "tokenizers";

import { ModelType } from "../models";

export interface TokenizerBaseOptions {
  lowercase?: boolean;
  mergesFile?: string;
  filesDir: string;
  modelType: ModelType;
  vocabFile?: string;
}

export type FullTokenizerOptions<TokSpecificOptions> = TokenizerBaseOptions &
  Partial<TokSpecificOptions>;

export abstract class Tokenizer<T extends BaseTokenizer<object> = BaseTokenizer<object>> {
  constructor(protected tokenizer: T) {}

  abstract getQuestionLength(encoding: Encoding): number;

  abstract getContextStartIndex(encoding: Encoding): number;

  getContextEndIndex(encoding: Encoding): number {
    const nbAddedTokens = encoding.getSpecialTokensMask().reduce((acc, val) => acc + val, 0);
    const actualLength = encoding.getLength() - nbAddedTokens;
    const contextLength = actualLength - this.getQuestionLength(encoding);

    return this.getContextStartIndex(encoding) + contextLength - 1;
  }

  encode(sequence: string, pair?: string, addSpecialTokens = true): Promise<Encoding> {
    return this.tokenizer.encode(sequence, pair, { addSpecialTokens });
  }

  setPadding(maxLength: number): Readonly<PaddingConfiguration> {
    return this.tokenizer.setPadding({ maxLength });
  }

  setTr
