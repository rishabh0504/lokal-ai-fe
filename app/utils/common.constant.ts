import { LabelValuePair, StringKeyStringValueType } from './types'

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

export const LLM_CONFIG_FOR_MODELS = `
You are professional expert for the LLM configuration, I am configuring the LLMConfig in the below format.

**name** : provide the model name
**modelName** : provide the ollama model name
**version** : Provide  the version
**description** : Provide  the description
**temperatureMin** : Provide  the temperatureMin
**temperatureMax**: Provide  the temperatureMax
**temperatureDefault**: Provide  the temperatureDefault
**top_pMin**: Provide  the top_pMin
**top_pMax**: Provide  the top_pMax
**top_pDefault**: Provide  the top_pDefault

**top_kMin**: Provide  the top_kMin
**top_kMax**: Provide  the top_kMax
**top_kDefault**: Provide  the top_kDefault

**max_tokensMin**: Provide  the max_tokensMin
**max_tokensMax**: Provide  the max_tokensMax
**max_tokensDefault**: Provide  the max_tokensDefault

**presence_penaltyMin**: Provide  the presence_penaltyMin
**presence_penaltyMax**: Provide  the presence_penaltyMax
**presence_penaltyDefault**: Provide  the presence_penaltyDefault

**frequency_penaltyMin**: Provide  the frequency_penaltyMin
**frequency_penaltyMax**: Provide  the frequency_penaltyMax
**frequency_penaltyDefault**: Provide  the frequency_penaltyDefault

**repeat_penaltyMin**: Provide  the repeat_penaltyMin
**repeat_penaltyMax**: Provide  the repeat_penaltyMax
**repeat_penaltyDefault**: Provide  the repeat_penaltyDefault

**defaultPrompt**: Provide  the defaultPrompt ( minimum characters size is 100 and maximum 1000) to
 get precise information from the LLM

Below is the modelName for which llm config is needed
Model Name : {modelName}

Please provide the data in the JSON format like shown in below format

Format :  
{FORMAT}

`

export const STOP_SEQUENCES: LabelValuePair[] = [
  { label: 'Double New Line', value: '\n\n' },
  { label: 'End of Text (OpenAI)', value: '<|endoftext|>' },
  { label: 'User Prompt', value: 'User:' },
  { label: 'Assistant Response', value: 'Assistant:' },
  { label: 'Question Prefix', value: 'Q:' },
  { label: 'Answer Prefix', value: 'A:' },
]
