import { StringKeyStringValueType } from './types'

export const NAVITEM_TYPES = {
  CHAT_TYPE: 'chat_history',
  LLM_TYPE: 'llm_model',
  AGENT_TYPE: 'agent',
}

export const LLM_AGENT_PARAMETERS: StringKeyStringValueType = {
  temperature: `Controls the randomness of the output. Higher values (e.g., {temperatureMax}) make
   the output more random and creative, while lower values (e.g., {temperatureMin})
   make it more focused and deterministic. Default value for the temperature is {temperatureDefault}.`,
  top_p: `Controls the range of possible tokens considered at each step. Lower values (e.g., {top_pMin}) reduce the range of possible tokens, leading to more predictable results, while higher values (e.g., {top_pMax}) allow for more diverse results. Default value for top P is {top_pDefault}.`,
  top_k: `Controls the number of highest probability vocabulary tokens to keep for top-p filtering. Lower values (e.g., {top_kMin}) reduce the number of potential tokens, leading to more focused results, while higher values (e.g., {top_kMax}) allow for more diverse results. Default value for top K is {top_kDefault}.`,
  max_tokens: `Sets the maximum number of tokens to generate in the response. A token is typically a word or part of a word. Higher values (e.g., {max_tokensMax}) allow for longer and more detailed responses, but can also increase processing time. The minimum tokens to generate is {max_tokensMin} and Default value is {max_tokensDefault}.`,
  presence_penalty: `Controls the likelihood of the model using tokens that have already been used in the prompt. Higher values (e.g., {presence_penaltyMax}) discourage the use of tokens that have already been used, while lower values (e.g., {frequency_penaltyMin}) allow for more frequent use of tokens that have already been used. Default value is {presence_penaltyDefault}.`,
  frequency_penalty: `Controls the likelihood of the model using tokens that have already been used frequently in the response. Higher values (e.g., {frequency_penaltyMax}) discourage the use of tokens that have already been used frequently, while lower values (e.g., {frequency_penaltyMin}) allow for more frequent use of tokens that have already been used frequently. Default value is {frequency_penaltyDefault}.`,
  repeat_penalty: `Controls the likelihood of the model repeating the same phrases or sentences. Higher values (e.g., {repeat_penaltyMax}) reduce the likelihood of repetition, while lower values (e.g., {repeat_penaltyMin}) allow for more repetition. Default value is {repeat_penaltyDefault}.`,
}
