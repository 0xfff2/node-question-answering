import path from "path";
import {
  AddedToken,
  ByteLevelBPETokenizer,
  Encoding,
  getTokenContent,
  PaddingConfiguration,
  Token
} from "tokenizers";
import { robertaProcessing } from "tokenizers/bindings/post-processors";

import { exists } from "../utils";
import { FullTokenizerOptions, Tokenizer } from "./tokenizer";

export interface RobertaTokenizerOptions {
  clsToken: Token;
  eosToken: Token;
  maskToken: Token;
  padToken: Token;
  unkToken: Token;
}

export class RobertaTokenizer extends Tokenizer<ByteLevelBPETokenizer> {
  private readonly clsToken: Token;
  private readonly eosToken: Token;
  private readonly maskToken: Token;
  private readonly padToken: Token;
  private readonly unkToken: Token;

  constructor(tokenizer: ByteLevelBPETokenizer, options: RobertaTokenizerOptions) {
    super(tokenizer);

    this.clsToken = options.clsToken;
    this.eosToken = options.eosToken;
    this.maskToken = options.maskToken;
    this.padToken = options.padToken;
    this.unkToken = options.unkToken;
  }

  static async fromOptions(
    options: FullTokenizerOptions<RobertaTokenizerOptions>
  ): Promise<RobertaTokenizer> {
    let vocabFile = options.vocabFile;

    if (!vocabFile) {
      const fullPath = path.join(options.filesDir, "vocab.json");
      if (await exists(fullPath)) {
        vocabFile = fullPath;
      }

      if (!vocabFile) {
        throw new Error(
          "Unable to find a vocab file. Make sure to provide its path in the options"
        );
      }
    }

    let mergesFile = options.mergesFile;
    if (!mergesFile) {
      const fullPath = path.join(options.filesDir, "merges.txt");
      if (await exists(fullPath)) {
        mergesFile = fullPath;
      }

      if (!mergesFile) {
        throw new Error(
          "Unable to find a merges file. Make sure to provide its path in
