export interface TranslationItem {
	lang: string;
	text: string;
}

export interface Answer {
	questionId: string;
	surveyInstanceId?: string;
	answer?: any;
	answers?: any;
	userId?: string;
}

export interface AnswerSemantic {
	id?: string;
	name: string;
	createdDate?: string;
	lastModifiedDate?: string;
	version?: number;
}

export interface Question {
	id: string;
	text: TranslationItem[];
	answerLabel: TranslationItem[];
	answerSemanticId: string;
	status: SURVEY_STATUS;
}
export interface SurveyQuestion {
	questionId?: string;
	question?: Question;
	enabled: boolean;
	mandatory: boolean;
}

export interface Survey {
	id: string;
	name: string;
	status: SURVEY_STATUS;
	title: TranslationItem[];
	description: TranslationItem[];
	surveyQuestions: SurveyQuestion[];
}
export interface SurveyInstance {
	id?: string;
	waitinglistId: string;
	extensionPoint: string;
	surveyId?: string;
	survey?: Survey;
	inputMode?: string;
}

export type SURVEY_STATUS = 'ACTIVE' | 'ARCHIVED';
export type SURVEY_EXTENSION_POINT =
	| 'BEFORE_JOINING_WAITINGLIST'
	| 'BEFORE_PAYMENT'
	| 'AFTER_REGISTRATION'
	| 'AT_CHECKOUT';
export type SURVEY_INPUT_MODE = 'EDITABLE' | 'LOCKED';
